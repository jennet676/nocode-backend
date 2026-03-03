import * as db from './db.js';

async function check() {
    try {
        const res = await db.query("SELECT * FROM projects LIMIT 0");
        console.log('FIELDS:', res.fields.map(f => f.name).join(', '));
        process.exit(0);
    } catch (err) {
        console.error('Error querying projects:', err.message);
        process.exit(1);
    }
}

check();
