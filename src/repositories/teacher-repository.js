const CrudRepository = require('./crud-repository');
const { Teacher } = require('../models');

class TeacherRepository extends CrudRepository {
    constructor() {
        super(Teacher);
    }
}

module.exports = TeacherRepository;

