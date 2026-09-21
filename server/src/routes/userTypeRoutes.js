const express = require('express');
const router = express.Router();
const userTypeController = require('../controllers/userTypeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, userTypeController.getAll);
router.get('/:id', authMiddleware, userTypeController.getById);
router.post('/', authMiddleware, userTypeController.create);
router.put('/:id', authMiddleware, userTypeController.update);
router.delete('/:id', authMiddleware, userTypeController.remove);

module.exports = router;
