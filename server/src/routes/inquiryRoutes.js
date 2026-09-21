const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, inquiryController.getAll);
router.post('/', inquiryController.create);
router.put('/:id/read', authMiddleware, inquiryController.markAsRead);
router.delete('/:id', authMiddleware, inquiryController.remove);

module.exports = router;
