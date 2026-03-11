import express from 'express';
import * as promptController from '../controllers/promptController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * components:
 *   schemas:
 *     Prompt:
 *       type: object
 *       required:
 *         - project_id
 *         - prompt
 *       properties:
 *         id:
 *           type: integer
 *         project_id:
 *           type: integer
 *         prompt:
 *           type: string
 *         ai_response:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/prompts:
 *   post:
 *     summary: Create a new prompt
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       201:
 *         description: Prompt created
 */
router.post('/', promptController.createPrompt);

/**
 * @swagger
 * /api/prompts:
 *   get:
 *     summary: Get all prompts (optional filter by project_id)
 *     tags: [Prompts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: integer
 *         description: Filter prompts by project ID
 *     responses:
 *       200:
 *         description: List of prompts
 */
router.get('/', promptController.getAllPrompts);

/**
 * @swagger
 * /api/prompts/{id}:
 *   get:
 *     summary: Get prompt by ID
 *     tags: [Prompts]
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
 *         description: Prompt details
 */
router.get('/:id', promptController.getPromptById);

/**
 * @swagger
 * /api/prompts/{id}:
 *   put:
 *     summary: Update prompt
 *     tags: [Prompts]
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
 *             $ref: '#/components/schemas/Prompt'
 *     responses:
 *       200:
 *         description: Prompt updated
 */
router.put('/:id', promptController.updatePrompt);

/**
 * @swagger
 * /api/prompts/{id}:
 *   delete:
 *     summary: Delete prompt
 *     tags: [Prompts]
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
 *         description: Prompt deleted
 */
router.delete('/:id', promptController.deletePrompt);

export default router;
