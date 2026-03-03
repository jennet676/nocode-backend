import * as db from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';

dotenv.config();

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

async function setup() {
    try {
        console.log('--- Setting up test user with ID 1 ---');
        
        // 1. Check if user_id: 1 exists
        const checkUser = await db.query('SELECT * FROM users WHERE id = 1');
        
        let user;
        if (checkUser.rows.length === 0) {
            console.log('User with ID 1 not found. Creating a test user...');
            // We might not be able to force ID 1 if SERIAL is used, but typically it starts at 1.
            // If it's already higher, we'll use the first user or create a new one and tell the user the ID.
            const newUser = await db.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                ['testuser1', 'test1@example.com', hashPassword('password123')]
            );
            user = newUser.rows[0];
            console.log(`Created user: ${user.username} (ID: ${user.id})`);
            if (user.id !== 1) {
                console.warn(`WARNING: Created user ID is ${user.id}, not 1. Please update tests accordingly.`);
            }
        } else {
            user = checkUser.rows[0];
            console.log(`User with ID 1 already exists: ${user.username}`);
        }

        // 2. Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } // Long lived for testing
        );

        console.log('\n--- TOKEN FOR TESTING ---');
        console.log(token);
        console.log('------------------------\n');
        
        // Save to file for easy access
        fs.writeFileSync('test_token.txt', token);
        console.log('Token saved to test_token.txt');
        
        console.log('Setup completed.');
        process.exit(0);
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

setup();
