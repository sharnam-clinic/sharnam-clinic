const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const userTypeRoutes = require('./routes/userTypeRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const healthConditionRoutes = require('./routes/healthConditionRoutes');
const clinicPhotoRoutes = require('./routes/clinicPhotoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/permissions', rolePermissionRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/health-conditions', healthConditionRoutes);
app.use('/api/clinic-photos', clinicPhotoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: true, message: 'Sharanam Clinic API is running' });
});

module.exports = app;
