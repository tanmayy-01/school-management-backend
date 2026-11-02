const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const { StudentRepository, SchoolRepository, ClassRepository } = require('../repositories');
const { AppError } = require('../utils');

class StudentService {
    constructor() {
        this.studentRepository = new StudentRepository();
        this.schoolRepository = new SchoolRepository();
        this.classRepository = new ClassRepository();
    }

    async createStudent(data) {
        const { first_name, last_name, email, address, school_id, class_id } = data;
        if (!first_name || !last_name || !email || !address || !school_id) {
            throw new AppError(
                'First name, last name, email, address and school_id are required',
                StatusCodes.BAD_REQUEST
            );
        }

        // Verify school exists
        await this.schoolRepository.get(school_id);

        // If class_id provided, verify class exists and belongs to same school
        if (class_id) {
            const cls = await this.classRepository.get(class_id);
            if (cls.school_id !== Number(school_id)) {
                throw new AppError('The selected class does not belong to this school', StatusCodes.BAD_REQUEST);
            }
        }

        const existing = await this.studentRepository.findOne({ where: { email } });
        if (existing) {
            throw new AppError('A student with this email already exists', StatusCodes.CONFLICT);
        }

        return await this.studentRepository.create(data);
    }

    async getStudent(id) {
        return await this.studentRepository.get(id, {
            include: [
                { association: 'school', attributes: ['id', 'name', 'email'] },
                { association: 'class', attributes: ['id', 'name'] }
            ]
        });
    }

    async getAllStudents(query = {}) {
        const where = {};

        if (query.school_id) {
            where.school_id = query.school_id;
        }

        if (query.class_id) {
            where.class_id = query.class_id;
        }

        if (query.search) {
            const search = `%${query.search.trim()}%`;
            where[Op.or] = [
                { first_name: { [Op.like]: search } },
                { last_name: { [Op.like]: search } },
                { email: { [Op.like]: search } },
                { mobile_number: { [Op.like]: search } }
            ];
        }

        const include = [
            { association: 'school', attributes: ['id', 'name'] },
            { association: 'class', attributes: ['id', 'name'] }
        ];

        if (query.all === 'true') {
            const students = await this.studentRepository.getAll({
                where,
                include,
                order: [['first_name', 'ASC']]
            });
            return {
                totalRecords: students.length,
                totalPages: 1,
                currentPage: 1,
                limit: students.length,
                rows: students
            };
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await this.studentRepository.findAndCountAll({
            where,
            include,
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

    async updateStudent(id, data) {
        const student = await this.studentRepository.get(id);

        const targetSchoolId = data.school_id !== undefined ? data.school_id : student.school_id;

        if (data.school_id) {
            await this.schoolRepository.get(data.school_id);
        }

        if (data.class_id) {
            const cls = await this.classRepository.get(data.class_id);
            if (cls.school_id !== Number(targetSchoolId)) {
                throw new AppError('The selected class does not belong to the student’s school', StatusCodes.BAD_REQUEST);
            }
        }

        if (data.email) {
            const existing = await this.studentRepository.findOne({
                where: { email: data.email, id: { [Op.ne]: id } }
            });
            if (existing) {
                throw new AppError('A student with this email already exists', StatusCodes.CONFLICT);
            }
        }

        return await this.studentRepository.update(id, data);
    }

    async deleteStudent(id) {
        return await this.studentRepository.destroy(id);
    }
}

module.exports = StudentService;

