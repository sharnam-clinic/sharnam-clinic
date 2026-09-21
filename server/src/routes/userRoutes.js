const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.post('/', authMiddleware, userController.create);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.remove);

module.exports = router;
