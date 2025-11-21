const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', asyncHandler(async (req, res) => {
  const result = await query(
    'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
  );

  res.json({
    success: true,
    count: result.rows.length,
    data: result.rows
  }));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Usuário não encontrado'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  }));
}));

router.post(
  '/',
  [
    body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role inválido')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, name, role = 'admin' } = req.body;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'E-mail já cadastrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (email, password, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, hashedPassword, name, role]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.put(
  '/:id',
  [
    body('email').optional().isEmail().normalizeEmail().withMessage('E-mail inválido'),
    body('name').optional().trim().notEmpty().withMessage('Nome não pode estar vazio'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role inválido')
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
    const { email, name, role } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    if (email) {
      const emailCheck = await query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'E-mail já está em uso'
        });
      }
    }

    const result = await query(
      `UPDATE users
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           role = COALESCE($3, role)
       WHERE id = $4
       RETURNING id, email, name, role, created_at`,
      [email, name, role, id]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.put(
  '/:id/password',
  [
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
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
    const { password } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, id]
    );

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  })
);

router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      error: 'Você não pode excluir seu próprio usuário'
    });
  }

  const existingUser = await query('SELECT id FROM users WHERE id = $1', [id]);

  if (existingUser.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Usuário não encontrado'
    });
  }

  await query('DELETE FROM users WHERE id = $1', [id]);

  res.json({
    success: true,
    message: 'Usuário excluído com sucesso'
  });
}));

module.exports = router;
