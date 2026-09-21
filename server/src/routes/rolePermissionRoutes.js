const express = require('express');
const router = express.Router();
const rolePermissionController = require('../controllers/rolePermissionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:userTypeId', authMiddleware, rolePermissionController.getByUserTypeId);
router.post('/bulk', authMiddleware, rolePermissionController.saveBulk);

module.exports = router;
