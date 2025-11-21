const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT * FROM plans WHERE status = $1 ORDER BY order_position ASC',
    ['active']
  );

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  }));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT * FROM plans WHERE id = $1',
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Plan not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  }));
}));

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('speed').trim().notEmpty().withMessage('Speed is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('features').isArray().withMessage('Features must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, speed, price, status, features, is_popular, order_position } = req.body;

    const result = await query(
      `INSERT INTO plans (name, speed, price, status, features, is_popular, order_position) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        name, 
        speed, 
        price, 
        status || 'active', 
        features || [], 
        is_popular || false, 
        order_position || 0
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Plan name cannot be empty'),
    body('speed').optional().trim().notEmpty().withMessage('Speed cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('features').optional().isArray().withMessage('Features must be an array')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, speed, price, status, features, is_popular, order_position } = req.body;

    const result = await query(
      `UPDATE plans 
       SET name = COALESCE($1, name),
           speed = COALESCE($2, speed),
           price = COALESCE($3, price),
           status = COALESCE($4, status),
           features = COALESCE($5, features),
           is_popular = COALESCE($6, is_popular),
           order_position = COALESCE($7, order_position),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, speed, price, status, features, is_popular, order_position, req.params.id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await query(
      'DELETE FROM plans WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  })
);

router.get(
  '/admin/all',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT * FROM plans ORDER BY order_position ASC, created_at DESC'
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  })
);

module.exports = router;
