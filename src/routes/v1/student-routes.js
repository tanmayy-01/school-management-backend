const express = require('express');
const { StudentController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddlewares.checkAuth);

router.post('/', StudentController.create);
router.get('/', StudentController.getAll);
router.get('/:id', StudentController.get);
router.put('/:id', StudentController.update);
router.patch('/:id', StudentController.update);
router.delete('/:id', StudentController.destroy);

module.exports = router;

