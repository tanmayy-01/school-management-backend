const CrudRepository = require('./crud-repository');
const { Class } = require('../models');

class ClassRepository extends CrudRepository {
    constructor() {
        super(Class);
    }
}

module.exports = ClassRepository;

