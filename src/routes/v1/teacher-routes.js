const express = require('express');
const { TeacherController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

router.use(AuthMiddlewares.checkAuth);

router.post('/', TeacherController.create);
router.get('/', TeacherController.getAll);
router.get('/:id', TeacherController.get);
router.put('/:id', TeacherController.update);
router.patch('/:id', TeacherController.update);
router.delete('/:id', TeacherController.destroy);

// Subject assignment to teacher
router.post('/:id/subjects', TeacherController.assignSubject);
router.delete('/:id/subjects/:subjectId', TeacherController.removeSubject);

// Class assignment to teacher
router.post('/:id/classes', TeacherController.assignClass);
router.delete('/:id/classes/:classId', TeacherController.removeClass);

module.exports = router;

