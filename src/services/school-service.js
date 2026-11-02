const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { SchoolRepository } = require('../repositories');
const { AppError } = require('../utils');

class SchoolService {
    constructor() {
        this.schoolRepository = new SchoolRepository();
    }

    async createSchool(data) {
        const { name, address, email, mobile_number } = data;
        if (!name || !address || !email || !mobile_number) {
            throw new AppError('Name, address, email and mobile number are required', StatusCodes.BAD_REQUEST);
        }

        const existing = await this.schoolRepository.findOne({ where: { email } });
        if (existing) {
            throw new AppError('A school with this email already exists', StatusCodes.CONFLICT);
        }

        return await this.schoolRepository.create(data);
    }

    async getSchool(id) {
        return await this.schoolRepository.get(id, {
            include: [
                { association: 'classes', attributes: ['id', 'name'] },
                { association: 'subjects', attributes: ['id', 'name'] }
            ]
        });
    }

    async getAllSchools(query = {}) {
        const where = {};

        if (query.search) {
            const search = `%${query.search.trim()}%`;
            where[Op.or] = [
                { name: { [Op.like]: search } },
                { email: { [Op.like]: search } },
                { address: { [Op.like]: search } },
                { mobile_number: { [Op.like]: search } }
            ];
        }

        // Support returning all schools for dropdown selectors
        if (query.all === 'true') {
            const schools = await this.schoolRepository.getAll({
                where,
                order: [['name', 'ASC']]
            });
            return {
                totalRecords: schools.length,
                totalPages: 1,
                currentPage: 1,
                limit: schools.length,
                rows: schools
            };
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await this.schoolRepository.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            totalRecords: count,
            totalPages: Math.ceil(count / limit) || 1,
            currentPage: page,
            limit,
            rows
        };
    }

    async updateSchool(id, data) {
        if (data.email) {
            const existing = await this.schoolRepository.findOne({
                where: { email: data.email, id: { [Op.ne]: id } }
            });
            if (existing) {
                throw new AppError('A school with this email already exists', StatusCodes.CONFLICT);
            }
        }
        return await this.schoolRepository.update(id, data);
    }

    async deleteSchool(id) {
        return await this.schoolRepository.destroy(id);
    }
}

module.exports = SchoolService;

