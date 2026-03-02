import * as db from '../db.js';

export const createProject = async (req, res) => {
    const { project_name, generated_code, user_prompt } = req.body;
    const user_id = req.user.id;
    try {
        const result = await db.query(
            'INSERT INTO projects (user_id, project_name, generated_code, user_prompt) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, project_name, generated_code, user_prompt]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProjects = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT id, project_name, user_prompt, created_at FROM projects WHERE user_id = $1', [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProjectById = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
            return res.status(404).json({ error: 'Project not found' });
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
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProjectVersions = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        // Verify project ownership first
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

        const result = await db.query('SELECT id, version_name, user_prompt, created_at FROM project_versions WHERE project_id = $1 ORDER BY created_at DESC', [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getProjectVersionById = async (req, res) => {
    const { id, versionId } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

        const result = await db.query('SELECT * FROM project_versions WHERE id = $1 AND project_id = $2', [versionId, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Version not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const restoreProjectVersion = async (req, res) => {
    const { id, versionId } = req.params;
    const user_id = req.user.id;
    try {
        const project = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

        const version = await db.query('SELECT * FROM project_versions WHERE id = $1 AND project_id = $2', [versionId, id]);
        if (version.rows.length === 0) return res.status(404).json({ error: 'Version not found' });

        // Save current state as a new version before restoring
        await db.query(
            'INSERT INTO project_versions (project_id, version_name, generated_code, user_prompt) VALUES ($1, $2, $3, $4)',
            [id, `Backup before restore ${new Date().toISOString()}`, project.rows[0].generated_code, project.rows[0].user_prompt]
        );

        // Update project with version code and prompt
        const result = await db.query(
            'UPDATE projects SET generated_code = $1, user_prompt = $2 WHERE id = $3 RETURNING *',
            [version.rows[0].generated_code, version.rows[0].user_prompt, id]
        );
        res.json({ message: 'Project restored successfully', project: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        const result = await db.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
