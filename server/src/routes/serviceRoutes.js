const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', serviceController.getAll);
router.get('/:id', serviceController.getById);
router.post('/', authMiddleware, serviceController.create);
router.put('/:id', authMiddleware, serviceController.update);
router.delete('/:id', authMiddleware, serviceController.remove);

module.exports = router;
