const express = require('express');
const router = express.Router();
const clinicPhotoController = require('../controllers/clinicPhotoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', clinicPhotoController.getAll);
router.get('/:id', clinicPhotoController.getById);
router.post('/', authMiddleware, clinicPhotoController.create);
router.put('/:id', authMiddleware, clinicPhotoController.update);
router.delete('/:id', authMiddleware, clinicPhotoController.remove);

module.exports = router;
