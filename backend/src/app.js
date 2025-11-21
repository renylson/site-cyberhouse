const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const xss = require('xss-clean');
const path = require('path');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const plansRoutes = require('./routes/plans');
const applicationsRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const usersRoutes = require('./routes/users');

const app = express();

app.use(helmet());
app.use(xss());
app.use(cors({
  origin: [
    'http://localhost:3071',
    'http://localhost:8071',
    'http://docker.renylson.com.br:8071',
    'http://179.48.192.10:3071',
    'https://cyberhousenet.com.br',
    'http://cyberhousenet.com.br',
    'https://www.cyberhousenet.com.br',
    'http://www.cyberhousenet.com.br'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(compression());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/', rateLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.use(errorHandler);

module.exports = app;
