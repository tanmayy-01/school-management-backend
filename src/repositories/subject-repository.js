const CrudRepository = require('./crud-repository');
const { Subject } = require('../models');

class SubjectRepository extends CrudRepository {
    constructor() {
        super(Subject);
    }
}

module.exports = SubjectRepository;

