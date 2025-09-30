const express = require('express');
const pool = require('../database/connection');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateRequest, sanitizeInput } = require('../middleware/validation');
const { taskValidation } = require('../validators/validationSchemas');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated task ID
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Task description
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *           description: Task status
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Task priority
 *         userId:
 *           type: integer
 *           description: ID of the user who owns the task
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Task last update timestamp
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         description: Filter by task status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by task priority
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Task'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalTasks:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, priority } = req.query;

    let whereClause = 'WHERE user_id = $1';
    const values = [req.user.id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (priority) {
      paramCount++;
      whereClause += ` AND priority = $${paramCount}`;
      values.push(priority);
    }

    const result = await pool.query(`
      SELECT id, title, description, status, priority, user_id, created_at, updated_at
      FROM tasks
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `, [...values, limit, offset]);

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM tasks ${whereClause}
    `, values);

    const totalTasks = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      status: 'success',
      data: {
        tasks: result.rows.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          userId: task.user_id,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Task doesn't belong to user)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT id, title, description, status, priority, user_id, created_at, updated_at
      FROM tasks
      WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    const task = result.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project assignment
 *               description:
 *                 type: string
 *                 example: Build a scalable REST API with authentication
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 default: pending
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *                 example: high
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, sanitizeInput, taskValidation, validateRequest, async (req, res, next) => {
  try {
    const { title, description, status = 'pending', priority = 'medium' } = req.body;

    const result = await pool.query(`
      INSERT INTO tasks (title, description, status, priority, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, status, priority, user_id, created_at, updated_at
    `, [title, description, status, priority, req.user.id]);

    const task = result.rows[0];

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project assignment
 *               description:
 *                 type: string
 *                 example: Build a scalable REST API with authentication
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Task doesn't belong to user)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, sanitizeInput, taskValidation, validateRequest, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    // Check if task exists and belongs to user
    const taskExists = await pool.query(`
      SELECT id FROM tasks WHERE id = $1 AND user_id = $2
    `, [id, req.user.id]);

    if (taskExists.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(`
      UPDATE tasks 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, title, description, status, priority, user_id, created_at, updated_at
    `, values);

    const task = result.rows[0];

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        userId: task.user_id,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Task doesn't belong to user)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM tasks 
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `, [id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of tasks per page
 *     responses:
 *       200:
 *         description: All tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin access required)
 *       500:
 *         description: Internal server error
 */
router.get('/admin/all', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT t.id, t.title, t.description, t.status, t.priority, t.user_id, 
             t.created_at, t.updated_at,
             u.email, u.first_name, u.last_name
      FROM tasks t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM tasks');
    const totalTasks = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      status: 'success',
      data: {
        tasks: result.rows.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          userId: task.user_id,
          userEmail: task.email,
          userName: `${task.first_name} ${task.last_name}`,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

