const CrudRepository = require('./crud-repository');
const { TeacherSubject } = require('../models');

class TeacherSubjectRepository extends CrudRepository {
    constructor() {
        super(TeacherSubject);
    }

    async assign(teacher_id, subject_id) {
        const [assignment, created] = await this.model.findOrCreate({
            where: { teacher_id, subject_id },
            defaults: { teacher_id, subject_id }
        });
        return { assignment, created };
    }

    async unassign(teacher_id, subject_id) {
        return await this.model.destroy({
            where: { teacher_id, subject_id }
        });
    }

    async findAssignment(teacher_id, subject_id) {
        return await this.model.findOne({
            where: { teacher_id, subject_id }
        });
    }
}

module.exports = TeacherSubjectRepository;

