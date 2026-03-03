import * as db from './db.js';

async function fix() {
    try {
        console.log('Adding user_id column to projects table...');
        await db.query("ALTER TABLE projects ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE");
        console.log('Column added successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error adding column:', err.message);
        process.exit(1);
    }
}

fix();
