const { createDatabaseIfNotExists, initializeTables } = require('./db');

async function test() {
    try {
        console.log('Testing database initialization...');
        await createDatabaseIfNotExists();
        await initializeTables();
        console.log('Test completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

test();
