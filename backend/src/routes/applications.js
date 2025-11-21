const express = require('express');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { uploadRateLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');
const { query } = require('../database/db');

const router = express.Router();

router.post(
  '/',
  uploadRateLimiter,
  upload.single('resume'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('message').optional().trim()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, email, phone, position, message } = req.body;
    const resume_path = req.file ? req.file.path : null;

    if (!resume_path) {
      return res.status(400).json({
        success: false,
        error: 'Resume file is required'
      });
    }

    const result = await query(
      `INSERT INTO job_applications (name, email, phone, position, message, resume_path, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [name, email, phone, position, message || '', resume_path]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
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

    let queryText = 'SELECT * FROM job_applications';
    let queryParams = [];

    if (status) {
      queryText += ' WHERE status = $1';
      queryParams.push(status);
    }

    queryText += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);

    const countQuery = status 
      ? 'SELECT COUNT(*) FROM job_applications WHERE status = $1'
      : 'SELECT COUNT(*) FROM job_applications';
    const countResult = await query(countQuery, status ? [status] : []);

    res.json({
      success: true,
      count: result.rows.length,
      total: parseInt(countResult.rows[0].count),
      data: result.rows
    });
  })
);

router.get(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const result = await query(
      'SELECT * FROM job_applications WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [
    body('status').isIn(['pending', 'reviewing', 'accepted', 'rejected']).withMessage('Invalid status')
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
      'UPDATE job_applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
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
      'DELETE FROM job_applications WHERE id = $1 RETURNING id, resume_path',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  })
);

module.exports = router;
