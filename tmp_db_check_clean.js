import * as db from './db.js';

async function check() {
    try {
        const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
        console.log('COLUMNS:', res.rows.map(r => r.column_name).join(', '));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
