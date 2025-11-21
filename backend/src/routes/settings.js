const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { protect, authorize } = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/settings');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /png|ico/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'image/png' || file.mimetype === 'image/x-icon';

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PNG e ICO são permitidos'));
    }
  }
});

router.get('/', asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM settings WHERE id = 1');
  
  if (result.rows.length === 0) {
    return res.json({
      success: true,
      data: {
        logo: null,
        favicon: null,
        phone: '(87) 98169-0984',
        whatsapp: '5587988694529',
        address: 'Rua 11, nº 50 - Cosme e Damião - Petrolina-PE'
      }
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  }));
}));

router.put(
  '/',
  protect,
  authorize('admin'),
  [
    body('phone').optional().trim().notEmpty().withMessage('Telefone não pode estar vazio'),
    body('whatsapp').optional().trim().notEmpty().withMessage('WhatsApp não pode estar vazio'),
    body('address').optional().trim().notEmpty().withMessage('Endereço não pode estar vazio'),
    body('client_area_url').optional().trim().isURL().withMessage('URL da área do cliente inválida')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phone, whatsapp, address, client_area_url } = req.body;

    const existing = await query('SELECT id FROM settings WHERE id = 1');

    if (existing.rows.length === 0) {
      const result = await query(
        `INSERT INTO settings (id, phone, whatsapp, address, client_area_url, created_at, updated_at)
         VALUES (1, $1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [phone, whatsapp, address, client_area_url]
      );

      return res.json({
        success: true,
        data: result.rows[0]
      });
    }

    const result = await query(
      `UPDATE settings
       SET phone = COALESCE($1, phone),
           whatsapp = COALESCE($2, whatsapp),
           address = COALESCE($3, address),
           client_area_url = COALESCE($4, client_area_url),
           updated_at = NOW()
       WHERE id = 1
       RETURNING *`,
      [phone, whatsapp, address, client_area_url]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  })
);

router.post(
  '/logo',
  protect,
  authorize('admin'),
  upload.single('logo'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo não enviado'
      });
    }

    const logoPath = `/uploads/settings/${req.file.filename}`;

    await query(
      `INSERT INTO settings (id, logo, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE
       SET logo = $1, updated_at = NOW()`,
      [logoPath]
    );

    res.json({
      success: true,
      data: { logo: logoPath }
    });
  })
);

router.post(
  '/favicon',
  protect,
  authorize('admin'),
  upload.single('favicon'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Arquivo não enviado'
      });
    }

    const faviconPath = `/uploads/settings/${req.file.filename}`;

    await query(
      `INSERT INTO settings (id, favicon, updated_at)
       VALUES (1, $1, NOW())
       ON CONFLICT (id) DO UPDATE
       SET favicon = $1, updated_at = NOW()`,
      [faviconPath]
    );

    res.json({
      success: true,
      data: { favicon: faviconPath }
    });
  })
);

module.exports = router;
