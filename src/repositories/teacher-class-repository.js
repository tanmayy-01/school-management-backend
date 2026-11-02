const CrudRepository = require('./crud-repository');
const { TeacherClass, Teacher, Class } = require('../models');

class TeacherClassRepository extends CrudRepository {
    constructor() {
        super(TeacherClass);
    }

    async assign(teacher_id, class_id) {
        const [assignment, created] = await this.model.findOrCreate({
            where: { teacher_id, class_id },
            defaults: { teacher_id, class_id }
        });
        return { assignment, created };
    }

    async unassign(teacher_id, class_id) {
        return await this.model.destroy({
            where: { teacher_id, class_id }
        });
    }

    async findAssignment(teacher_id, class_id) {
        return await this.model.findOne({
            where: { teacher_id, class_id }
        });
    }
}

module.exports = TeacherClassRepository;

