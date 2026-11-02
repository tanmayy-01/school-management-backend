const CrudRepository = require('./crud-repository');
const { ClassSubject } = require('../models');

class ClassSubjectRepository extends CrudRepository {
    constructor() {
        super(ClassSubject);
    }

    async assign(class_id, subject_id) {
        const [assignment, created] = await this.model.findOrCreate({
            where: { class_id, subject_id },
            defaults: { class_id, subject_id }
        });
        return { assignment, created };
    }

    async unassign(class_id, subject_id) {
        return await this.model.destroy({
            where: { class_id, subject_id }
        });
    }

    async findAssignment(class_id, subject_id) {
        return await this.model.findOne({
            where: { class_id, subject_id }
        });
    }
}

module.exports = ClassSubjectRepository;

