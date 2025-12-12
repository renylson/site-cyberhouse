const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();

// Get all positions
router.get(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT * FROM job_positions ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  })
);

// Get active positions (for frontend form)
router.get(
  '/active',
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT id, name FROM job_positions WHERE is_active = true ORDER BY name ASC'
    );

    res.json({
      success: true,
      data: result.rows
    });
  })
);

// Create position
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Nome do cargo é obrigatório'),
    body('description').optional().trim(),
    body('is_active').optional().isBoolean()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, description, is_active = true } = req.body;

    // Check if position name already exists
    const existing = await query(
      'SELECT id FROM job_positions WHERE name = $1',
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cargo com este nome já existe'
      });
    }

    const result = await query(
      'INSERT INTO job_positions (name, description, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name, description || '', is_active]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Update position
router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Nome do cargo não pode estar vazio'),
    body('description').optional().trim(),
    body('is_active').optional().isBoolean()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, description, is_active } = req.body;

    // Check if position exists
    const existing = await query(
      'SELECT id FROM job_positions WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cargo não encontrado'
      });
    }

    // Check if name is already taken by another position
    if (name) {
      const nameCheck = await query(
        'SELECT id FROM job_positions WHERE name = $1 AND id != $2',
        [name, id]
      );

      if (nameCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Cargo com este nome já existe'
        });
      }
    }

    const result = await query(
      `UPDATE job_positions
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_active = COALESCE($3, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [name, description, is_active, id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

// Delete position
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await query(
      'DELETE FROM job_positions WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cargo não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Cargo excluído com sucesso'
    });
  })
);

module.exports = router;