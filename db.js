import pkg from 'pg';
const { Pool, Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

export const createDatabaseIfNotExists = async () => {
  const client = new Client({ ...dbConfig, database: "postgres" });
  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME],
    );
    if (res.rowCount === 0) {
      console.log(
        `Database ${process.env.DB_NAME} does not exist. Creating...`,
      );
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
};

const pool = new Pool({
  ...dbConfig,
  database: process.env.DB_NAME,
});

export const initializeTables = async () => {
  const schemaPath = path.join(__dirname, "schema.sql");
  if (!fs.existsSync(schemaPath)) {
    console.warn("schema.sql not found, skipping table initialization.");
    return;
  }

  const schema = fs.readFileSync(schemaPath, "utf8");
  try {
    // Split and execute one by one to handle potential errors better
    const queries = schema.split(';').filter(q => q.trim());
    for (const q of queries) {
        await pool.query(q);
    }
    console.log("Tables initialized successfully.");
  } catch (err) {
    console.error("Error initializing tables:", err);
  }
};

export const query = (text, params) => pool.query(text, params);
