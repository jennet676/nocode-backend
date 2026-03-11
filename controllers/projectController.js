import * as db from '../db.js';
import { executeQuery, executeSingleQuery } from '../utils/dbHelper.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/responseHelper.js';

/**
 * Täze taslama döretmek. (Create a new project)
 */
export const createProject = async (req, res) => {
    const { project_name, generated_code, user_prompt, ai_response } = req.body;
    const user_id = req.user.id;
    try {
        // 1. Create the project
        const projectResult = await db.query(
            'INSERT INTO projects (user_id, project_name, generated_code) VALUES ($1, $2, $3) RETURNING *',
            [user_id, project_name, generated_code]
        );
        
        const project = projectResult.rows[0];

        // 2. Log the initial prompt
        await db.query(
            'INSERT INTO project_prompts (project_id, prompt, ai_response) VALUES ($1, $2, $3)',
            [project.id, user_prompt, ai_response || 'Project created']
        );

        sendSuccess(res, project, 'Taslama döredildi we taryha ýazyldy', 201);
    } catch (err) {
        sendError(res, err.message);
    }
};

export const getProjects = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT id, project_name, created_at FROM projects WHERE user_id = $1', [user_id]);
        sendSuccess(res, result.rows, 'Taslamalar alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

export const getProjectById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Taslama tapylmady');
        }
        sendSuccess(res, result.rows[0], 'Taslama maglumaty alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { project_name, generated_code } = req.body;
    const user_id = req.user.id;
    try {
        // 1. Check if project exists
        const current = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (current.rows.length === 0) {
            return sendNotFound(res, 'Taslama tapylmady');
        }

        // 2. Update the project
        const result = await db.query(
            'UPDATE projects SET project_name = $1, generated_code = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [project_name || current.rows[0].project_name, generated_code, id, user_id]
        );

        sendSuccess(res, result.rows[0], 'Taslama täzelendi');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Taslamanyň prompt taryhyny almak. (Get project prompt history)
 */
export const getProjectPrompts = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');

        const result = await db.query(
            'SELECT id, prompt, ai_response, created_at FROM project_prompts WHERE project_id = $1 ORDER BY created_at DESC',
            [id]
        );
        sendSuccess(res, result.rows, 'Prompt taryhy alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};


/**
 * Taslamany pozmak. (Delete project)
 */
export const deleteProject = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await db.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
        if (result.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');
        sendSuccess(res, null, 'Taslama pozuldy');
    } catch (err) {
        sendError(res, err.message);
    }
};
