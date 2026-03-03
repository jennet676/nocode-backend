import * as db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function reset() {
    try {
        console.log('Resetting projects tables...');
        await db.query("DROP TABLE IF EXISTS project_versions CASCADE");
        await db.query("DROP TABLE IF EXISTS projects CASCADE");
        console.log('Tables dropped.');
        
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const queries = schema.split(';').filter(q => q.trim());
        for (const q of queries) {
            await db.query(q);
        }
        
        console.log('Tables recreated from schema.sql');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reset();
