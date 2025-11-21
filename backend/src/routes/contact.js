const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message } = req.body;

    const result = await query(
      `INSERT INTO contact_messages (name, email, phone, subject, message, status) 
       VALUES ($1, $2, $3, $4, $5, 'unread') 
       RETURNING *`,
      [name, email, phone || '', subject || '', message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  })
);

router.get(
  '/',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM contact_messages';
    let queryParams = [];

    if (status) {
      queryText += ' WHERE status = $1';
      queryParams.push(status);
    }

    queryText += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    const countQuery = status 
      ? 'SELECT COUNT(*) FROM contact_messages WHERE status = $1'
      : 'SELECT COUNT(*) FROM contact_messages';
    const countResult = await query(countQuery, status ? [status] : []);

    res.json({
      success: true,
      count: result.rows.length,
      total: parseInt(countResult.rows[0].count),
      data: result.rows
    });
  })
);

router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [
    body('status').isIn(['unread', 'read', 'archived']).withMessage('Invalid status')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { status } = req.body;

    const result = await query(
      'UPDATE contact_messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

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
      'DELETE FROM contact_messages WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  })
);

module.exports = router;
