import * as db from './db.js';

async function check() {
    try {
        const res = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
