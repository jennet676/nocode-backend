import * as db from '../db.js';
import { executeQuery, executeSingleQuery } from '../utils/dbHelper.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/responseHelper.js';

/**
 * Täze taslama döretmek. (Create a new project)
 */
export const createProject = async (req, res) => {
    const { project_name, generated_code, user_prompt } = req.body;
    const user_id = req.user.id;
    try {
        const result = await db.query(
            'INSERT INTO projects (user_id, project_name, generated_code, user_prompt) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, project_name, generated_code, user_prompt]
        );
        sendSuccess(res, result.rows[0], 'Taslama döredildi', 201);
    } catch (err) {
        sendError(res, err.message);
    }
};

export const getProjects = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT id, project_name, user_prompt, created_at FROM projects WHERE user_id = $1', [user_id]);
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
    const { project_name, generated_code, user_prompt, version_name } = req.body;
    const user_id = req.user.id;
    try {
        // 1. Get current project state to save as a version before updating
        const current = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (current.rows.length === 0) {
            return sendNotFound(res, 'Taslama tapylmady');
        }

        // 2. Save current state to versions
        await db.query(
            'INSERT INTO project_versions (project_id, version_name, generated_code, user_prompt) VALUES ($1, $2, $3, $4)',
            [id, version_name || `Auto-save ${new Date().toISOString()}`, current.rows[0].generated_code, current.rows[0].user_prompt]
        );

        // 3. Update the project
        const result = await db.query(
            'UPDATE projects SET project_name = $1, generated_code = $2, user_prompt = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [project_name || current.rows[0].project_name, generated_code, user_prompt, id, user_id]
        );
        
        sendSuccess(res, result.rows[0], 'Taslama täzelendi we köne wersiýasy ýatda saklanyldy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Taslamanyň wersiýalaryny almak. (Get project versions)
 */
export const getProjectVersions = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');

        const result = await db.query('SELECT id, version_name, user_prompt, created_at FROM project_versions WHERE project_id = $1 ORDER BY created_at DESC', [id]);
        sendSuccess(res, result.rows, 'Wersiýalar alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Taslamanyň belli bir wersiýasyny döretmek. (Create a specific project version manually)
 */
export const createProjectVersion = async (req, res) => {
    const { id } = req.params;
    const { version_name, generated_code, user_prompt } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO project_versions (project_id, version_name, generated_code, user_prompt) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, version_name, generated_code, user_prompt]
        );
        sendSuccess(res, result.rows[0], 'Täze wersiýa döredildi', 201);
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Wersiýanyň adyny üýtgetmek. (Update version metadata)
 */
export const updateProjectVersion = async (req, res) => {
    const { id, versionId } = req.params;
    const { version_name } = req.body;
    try {
        const result = await db.query(
            'UPDATE project_versions SET version_name = $1 WHERE id = $2 AND project_id = $3 RETURNING *',
            [version_name, versionId, id]
        );
        if (result.rows.length === 0) return sendNotFound(res, 'Wersiýa tapylmady');
        sendSuccess(res, result.rows[0], 'Wersiýa ady üýtgedildi');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Wersiýany pozmak. (Delete a specific version)
 */
export const deleteProjectVersion = async (req, res) => {
    const { id, versionId } = req.params;
    try {
        const result = await db.query('DELETE FROM project_versions WHERE id = $1 AND project_id = $2 RETURNING *', [versionId, id]);
        if (result.rows.length === 0) return sendNotFound(res, 'Wersiýa tapylmady');
        sendSuccess(res, null, 'Wersiýa pozuldy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Wersiýanyň maglumatyny almak. (Get specific version details)
 */
export const getProjectVersionById = async (req, res) => {
    const { id, versionId } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');

        const result = await db.query('SELECT * FROM project_versions WHERE id = $1 AND project_id = $2', [versionId, id]);
        if (result.rows.length === 0) return sendNotFound(res, 'Wersiýa tapylmady');
        sendSuccess(res, result.rows[0], 'Wersiýa alyndy');
    } catch (err) {
        sendError(res, err.message);
    }
};

/**
 * Wersiýany dikeltmek. (Restore project to a specific version)
 */
export const restoreProjectVersion = async (req, res) => {
    const { id, versionId } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return sendNotFound(res, 'Taslama tapylmady');

        const version = await db.query('SELECT * FROM project_versions WHERE id = $1 AND project_id = $2', [versionId, id]);
        if (version.rows.length === 0) return sendNotFound(res, 'Wersiýa tapylmady');

        // Restore project with version code and prompt
        const result = await db.query(
            'UPDATE projects SET generated_code = $1, user_prompt = $2 WHERE id = $3 RETURNING *',
            [version.rows[0].generated_code, version.rows[0].user_prompt, id]
        );
        sendSuccess(res, result.rows[0], 'Taslama öňki ýagdaýyna dikeldildi');
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
