import express from 'express';
import * as projectController from '../controllers/projectController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - project_name
 *       properties:
 *         id:
 *           type: integer
 *         project_name:
 *           type: string
 *         generated_code:
 *           type: string
 *         user_prompt:
 *           type: string
 *     ProjectVersion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         project_id:
 *           type: integer
 *         version_name:
 *           type: string
 *         generated_code:
 *           type: string
 *         user_prompt:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', projectController.createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all user projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', projectController.getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project details
 */
router.get('/:id', projectController.getProjectById);

/**
 * @swagger
 * /api/projects/{id}/versions:
 *   get:
 *     summary: Get all versions of a project
 *     tags: [Project Versions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of project versions
 */
router.get('/:id/versions', projectController.getProjectVersions);

/**
 * @swagger
 * /api/projects/{id}/versions/{versionId}:
 *   get:
 *     summary: Get specific version details
 *     tags: [Project Versions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Version details
 */
router.get('/:id/versions/:versionId', projectController.getProjectVersionById);

/**
 * @swagger
 * /api/projects/{id}/versions/{versionId}/restore:
 *   post:
 *     summary: Restore project to a specific version
 *     tags: [Project Versions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project restored
 */
router.post('/:id/versions/:versionId/restore', projectController.restoreProjectVersion);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update project (creates a new version automatically)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 */
router.put('/:id', projectController.updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete('/:id', projectController.deleteProject);

export default router;
