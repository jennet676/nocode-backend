const db = require('../db');

exports.createProject = async (req, res) => {
    const { project_name, generated_code } = req.body;
    const user_id = req.user.id;
    try {
        const result = await db.query(
            'INSERT INTO projects (user_id, project_name, generated_code) VALUES ($1, $2, $3) RETURNING *',
            [user_id, project_name, generated_code]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjects = async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await db.query('SELECT * FROM projects WHERE user_id = $1', [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
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

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { project_name, generated_code } = req.body;
    const user_id = req.user.id;
    try {
        // 1. Get current project state to save as a version before updating
        const current = await db.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (current.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // 2. Save current state to versions
        await db.query(
            'INSERT INTO project_versions (project_id, version_name, generated_code) VALUES ($1, $2, $3)',
            [id, `Auto-save ${new Date().toISOString()}`, current.rows[0].generated_code]
        );

        // 3. Update the project
        const result = await db.query(
            'UPDATE projects SET project_name = $1, generated_code = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [project_name, generated_code, id, user_id]
        );
        
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectVersions = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    try {
        // Verify project ownership first
        const project = await db.query('SELECT id FROM projects WHERE id = $1 AND user_id = $2', [id, user_id]);
        if (project.rows.length === 0) return res.status(404).json({ error: 'Project not found' });

        const result = await db.query('SELECT id, version_name, created_at FROM project_versions WHERE project_id = $1 ORDER BY created_at DESC', [id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteProject = async (req, res) => {
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
