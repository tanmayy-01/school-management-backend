const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { SubjectRepository, SchoolRepository } = require('../repositories');
const { AppError } = require('../utils');

class SubjectService {
    constructor() {
        this.subjectRepository = new SubjectRepository();
        this.schoolRepository = new SchoolRepository();
    }

    async createSubject(data) {
        const { name, school_id } = data;
        if (!name || !school_id) {
            throw new AppError('Subject name and school_id are required', StatusCodes.BAD_REQUEST);
        }

        // Verify school exists
        await this.schoolRepository.get(school_id);

        const existing = await this.subjectRepository.findOne({
            where: { name, school_id }
        });
        if (existing) {
            throw new AppError('A subject with this name already exists in this school', StatusCodes.CONFLICT);
        }

        return await this.subjectRepository.create(data);
    }

    async getSubject(id) {
        return await this.subjectRepository.get(id, {
            include: [
                { association: 'school', attributes: ['id', 'name', 'email'] },
                {
                    association: 'teachers',
                    attributes: ['id', 'name', 'email'],
                    through: { attributes: [] }
                },
                {
                    association: 'classes',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });
    }

    async getAllSubjects(query = {}) {
        const where = {};

        if (query.school_id) {
            where.school_id = query.school_id;
        }

        if (query.search) {
            const search = `%${query.search.trim()}%`;
            where.name = { [Op.like]: search };
        }

        const include = [
            { association: 'school', attributes: ['id', 'name'] },
            {
                association: 'teachers',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            },
            {
                association: 'classes',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        ];

        if (query.all === 'true') {
            const subjects = await this.subjectRepository.getAll({
                where,
                include,
                order: [['name', 'ASC']],
                distinct: true
            });
            return {
                totalRecords: subjects.length,
                totalPages: 1,
                currentPage: 1,
                limit: subjects.length,
                rows: subjects
            };
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await this.subjectRepository.findAndCountAll({
            where,
            include,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            distinct: true
        });

        return {
            totalRecords: count,
            totalPages: Math.ceil(count / limit) || 1,
            currentPage: page,
            limit,
            rows
        };
    }

    async updateSubject(id, data) {
        const subject = await this.subjectRepository.get(id);

        const targetSchoolId = data.school_id !== undefined ? data.school_id : subject.school_id;
        const targetName = data.name !== undefined ? data.name : subject.name;

        if (data.school_id) {
            await this.schoolRepository.get(data.school_id);
        }

        if (data.name || data.school_id) {
            const existing = await this.subjectRepository.findOne({
                where: {
                    name: targetName,
                    school_id: targetSchoolId,
                    id: { [Op.ne]: id }
                }
            });
            if (existing) {
                throw new AppError('A subject with this name already exists in this school', StatusCodes.CONFLICT);
            }
        }

        return await this.subjectRepository.update(id, data);
    }

    async deleteSubject(id) {
        return await this.subjectRepository.destroy(id);
    }
}

module.exports = SubjectService;

