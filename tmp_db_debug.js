import * as db from './db.js';

async function debug() {
    try {
        const dbNameRes = await db.query("SELECT current_database()");
        console.log('Current DB:', dbNameRes.rows[0].current_database);
        
        const tablesRes = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', tablesRes.rows.map(t => t.table_name).join(', '));
        
        const colsRes = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
        console.log('Project Columns:', colsRes.rows.map(c => c.column_name).join(', '));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
