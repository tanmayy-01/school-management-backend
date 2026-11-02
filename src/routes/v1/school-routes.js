const express = require('express');
const { SchoolController } = require('../../controllers');
const { AuthMiddlewares } = require('../../middlewares');

const router = express.Router();

// Apply auth middleware to all school routes
router.use(AuthMiddlewares.checkAuth);

router.post('/', SchoolController.create);
router.get('/', SchoolController.getAll);
router.get('/:id', SchoolController.get);
router.put('/:id', SchoolController.update);
router.patch('/:id', SchoolController.update);
router.delete('/:id', SchoolController.destroy);

// Helper endpoints to fetch module data scoped to selected school
router.get('/:id/classes', SchoolController.getClassesBySchool);
router.get('/:id/subjects', SchoolController.getSubjectsBySchool);
router.get('/:id/teachers', SchoolController.getTeachersBySchool);

module.exports = router;

