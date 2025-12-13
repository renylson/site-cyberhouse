const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get client IP endpoint
router.get('/ip', asyncHandler(async (req, res) => {
  // Get client IP from various headers (considering proxy/load balancer)
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.headers['x-real-ip'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   req.ip ||
                   'unknown';

  // Clean up IPv4-mapped IPv6 addresses
  const cleanIP = clientIP.replace(/^::ffff:/, '');

  res.json({
    ip: cleanIP,
    userAgent: req.headers['user-agent'] || 'unknown'
  });
}));

// Ping test endpoint
router.get('/ping', asyncHandler(async (req, res) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Content-Type': 'text/plain'
  });
  res.send('pong');
}));

// Download test endpoint
router.get('/download', asyncHandler(async (req, res) => {
  const size = parseInt(req.query.size) || 120; // Size in MB - padrão 120MB
  const chunkSize = 1024 * 1024; // 1MB chunks - aumentado para melhor performance
  const totalSize = size * 1024 * 1024; // Convert to bytes

  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Length': totalSize.toString(),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Content-Disposition': 'attachment; filename="speed-test.dat"',
    'Transfer-Encoding': 'chunked' // Melhor para streams grandes
  });

  // Generate and send data in chunks
  let sent = 0;
  const buffer = Buffer.alloc(chunkSize);

  // Fill buffer with random data once
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }

  while (sent < totalSize) {
    const remaining = totalSize - sent;
    const sendSize = Math.min(chunkSize, remaining);

    if (req.destroyed) {
      break; // Client disconnected
    }

    res.write(buffer.slice(0, sendSize));
    sent += sendSize;

    // Pequena pausa para não sobrecarregar
    await new Promise(resolve => setImmediate(resolve));
  }

  res.end();
}));

// Upload test endpoint
router.post('/upload', asyncHandler(async (req, res) => {
  let receivedBytes = 0;
  const startTime = process.hrtime.bigint();
  const maxSize = 600 * 1024 * 1024; // 600MB max para suportar testes maiores
  let exceeded = false;

  req.on('data', (chunk) => {
    receivedBytes += chunk.length;
    if (receivedBytes > maxSize) {
      exceeded = true;
      req.destroy(); // Para o upload se exceder
    }
  });

  req.on('end', () => {
    if (exceeded) {
      return res.status(413).json({
        success: false,
        error: 'Upload size exceeded'
      });
    }

    const endTime = process.hrtime.bigint();
    const durationNs = Number(endTime - startTime); // nanoseconds
    const duration = durationNs / 1e9; // seconds
    const speedMbps = (receivedBytes * 8) / (1024 * 1024) / duration; // Mbps

    res.json({
      success: true,
      receivedBytes,
      duration,
      speedMbps
    });
  });

  req.on('error', (error) => {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Upload failed'
    });
  });
}));

module.exports = router;