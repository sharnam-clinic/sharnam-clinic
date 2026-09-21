const express = require('express');
const router = express.Router();
const healthConditionController = require('../controllers/healthConditionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', healthConditionController.getAll);
router.get('/:id', healthConditionController.getById);
router.post('/', authMiddleware, healthConditionController.create);
router.put('/:id', authMiddleware, healthConditionController.update);
router.delete('/:id', authMiddleware, healthConditionController.remove);

module.exports = router;
