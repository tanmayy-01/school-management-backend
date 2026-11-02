const CrudRepository = require('./crud-repository');
const { School } = require('../models');

class SchoolRepository extends CrudRepository {
    constructor() {
        super(School);
    }
}

module.exports = SchoolRepository;

