import * as db from '../db.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/responseHelper.js';

/**
 * Täze prompt döretmek. (Create a new prompt)
 */
export const createPrompt = async (req, res) => {
    const { project_id, prompt, ai_response } = req.body;
    try {
        // Taslamanyň bardygyny barlamak
        const project = await db.query('SELECT id FROM projects WHERE id = $1', [project_id]);
        if (project.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');

        const result = await db.query(
            'INSERT INTO project_prompts (project_id, prompt, ai_response) VALUES ($1, $2, $3) RETURNING *',
            [project_id, prompt, ai_response]
        );
        sendSuccess(res, result.rows[0], 'Prompt döredildi', 201);
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Ähli promptlary almak. (Get all prompts)
 */
export const getAllPrompts = async (req, res) => {
    const { project_id } = req.query;
    try {
        let query = 'SELECT * FROM project_prompts';
        let params = [];
        
        if (project_id) {
            query += ' WHERE project_id = $1';
            params.push(project_id);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const result = await db.query(query, params);
        sendSuccess(res, result.rows, 'Promptlar alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * ID boýunça prompt almak. (Get prompt by ID)
 */
export const getPromptById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM project_prompts WHERE id = $1', [id]);
        if (result.rows.length === 0) return sendNotFound(res, 'Prompt tapylmady');
        sendSuccess(res, result.rows[0], 'Prompt maglumaty alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Prompt täzelemek. (Update prompt)
 */
export const updatePrompt = async (req, res) => {
    const { id } = req.params;
    const { prompt, ai_response } = req.body;
    try {
        const current = await db.query('SELECT * FROM project_prompts WHERE id = $1', [id]);
        if (current.rows.length === 0) return sendNotFound(res, 'Prompt tapylmady');

        const result = await db.query(
            'UPDATE project_prompts SET prompt = $1, ai_response = $2 WHERE id = $3 RETURNING *',
            [prompt || current.rows[0].prompt, ai_response || current.rows[0].ai_response, id]
        );
        sendSuccess(res, result.rows[0], 'Prompt täzelendi');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Prompt pozmak. (Delete prompt)
 */
export const deletePrompt = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM project_prompts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return sendNotFound(res, 'Prompt tapylmady');
        sendSuccess(res, null, 'Prompt pozuldy');
    } catch (err) {
        sendError(res, err.message);
    }
};
