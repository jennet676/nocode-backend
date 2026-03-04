import * as db from '../db.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendSuccess, sendError, sendBadRequest, sendUnauthorized, sendNotFound } from '../utils/responseHelper.js';

dotenv.config();

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Täze ulanyjy hasabyny döretmek (Register new user)
 */
export const register = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return sendBadRequest(res, 'Ähli meýdançalary dolduryň (email we parol)');
    }

    try {
        const hashedPassword = hashPassword(password);
        const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
        sendSuccess(res, { token, user: { id: user.id, email: user.email } }, 'Hasap döredildi we giriş edildi', 201);
    } catch (err) {
        if (err.code === '23505') {
            const field = err.detail.includes('username') ? 'Ulanyjy ady' : 'Email';
            return sendBadRequest(res, `${field} eýýäm bar`);
        }
        sendError(res, err.message);
    }
};

/**
 * Sisteme girmek (Login)
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendBadRequest(res, 'Email we parol hökmandyr');
    }

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return sendUnauthorized(res, 'Email ýa-da parol nädogry');
        }

        const user = result.rows[0];
        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return sendUnauthorized(res, 'Email ýa-da parol nädogry');
        }

        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET);
        sendSuccess(res, { token, user: { id: user.id, email: user.email, username: user.username } }, 'Giriş şowly');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Ähli ulanyjylary almak (Get all users)
 */
export const getUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, email FROM users');
        sendSuccess(res, result.rows, 'Ulanyjylar alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * ID boýunça ulanyjyny almak (Get user by ID)
 */
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Ulanyjy tapylmady');
        }
        sendSuccess(res, result.rows[0], 'Ulanyjy maglumaty alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Ulanyjyny üýtgetmek (Update user)
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        // First get current user data
        const currentResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (currentResult.rows.length === 0) {
            return sendNotFound(res, 'Ulanyjy tapylmady');
        }
        const currentUser = currentResult.rows[0];

        const updatedUsername = username !== undefined ? username : currentUser.username;
        const updatedEmail = email !== undefined ? email : currentUser.email;
        
        let queryStr = 'UPDATE users SET username = $1, email = $2';
        let params = [updatedUsername, updatedEmail, id];
        
        if (password) {
            queryStr += ', password = $4';
            params.push(hashPassword(password));
        }
        
        queryStr += ' WHERE id = $3 RETURNING id, username, email';
        const result = await db.query(queryStr, params);
        sendSuccess(res, result.rows[0], 'Ulanyjy maglumaty täzelendi');
    } catch (err) {
        if (err.code === '23505') {
            const field = err.detail.includes('username') ? 'Ulanyjy ady' : 'Email';
            return sendBadRequest(res, `${field} eýýäm bar`);
        }
        sendError(res, err.message);
    }
};

/**
 * Ulanyjyny pozmak (Delete user)
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Ulanyjy tapylmady');
        }
        sendSuccess(res, null, 'Ulanyjy pozuldy');
    } catch (err) {
        sendError(res, err.message);
    }
};
