const express = require('express');
const { SubjectController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddlewares.checkAuth);

router.post('/', SubjectController.create);
router.get('/', SubjectController.getAll);
router.get('/:id', SubjectController.get);
router.put('/:id', SubjectController.update);
router.patch('/:id', SubjectController.update);
router.delete('/:id', SubjectController.destroy);

module.exports = router;

