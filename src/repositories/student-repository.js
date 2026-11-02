const CrudRepository = require('./crud-repository');
const { Student } = require('../models');

class StudentRepository extends CrudRepository {
    constructor() {
        super(Student);
    }
}

module.exports = StudentRepository;

