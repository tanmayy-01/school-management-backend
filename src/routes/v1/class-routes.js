const express = require('express');
const { ClassController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddlewares.checkAuth);

router.post('/', ClassController.create);
router.get('/', ClassController.getAll);
router.get('/:id', ClassController.get);
router.put('/:id', ClassController.update);
router.patch('/:id', ClassController.update);
router.delete('/:id', ClassController.destroy);

// Teacher assignment to class
router.post('/:id/teachers', ClassController.assignTeacher);
router.delete('/:id/teachers/:teacherId', ClassController.removeTeacher);

// Subject assignment to class
router.post('/:id/subjects', ClassController.assignSubject);
router.delete('/:id/subjects/:subjectId', ClassController.removeSubject);

module.exports = router;

