const express = require('express');
const { InfoController } = require('../../controllers');
const authRoutes = require('./auth-routes');
const schoolRoutes = require('./school-routes');
const classRoutes = require('./class-routes');
const studentRoutes = require('./student-routes');
const teacherRoutes = require('./teacher-routes');
const subjectRoutes = require('./subject-routes');

const router = express.Router();

router.get('/info', InfoController.info);
router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/classes', classRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/subjects', subjectRoutes);

module.exports = router;
