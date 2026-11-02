const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const {
    TeacherRepository,
    SchoolRepository,
    SubjectRepository,
    ClassRepository,
    TeacherSubjectRepository,
    TeacherClassRepository
} = require('../repositories');
const { AppError } = require('../utils');

class TeacherService {
    constructor() {
        this.teacherRepository = new TeacherRepository();
        this.schoolRepository = new SchoolRepository();
        this.subjectRepository = new SubjectRepository();
        this.classRepository = new ClassRepository();
        this.teacherSubjectRepository = new TeacherSubjectRepository();
        this.teacherClassRepository = new TeacherClassRepository();
    }

    async createTeacher(data) {
        const { name, email, address, mobile_number, school_id } = data;
        if (!name || !email || !mobile_number || !school_id) {
            throw new AppError(
                'Name, email, mobile number and school_id are required',
                StatusCodes.BAD_REQUEST
            );
        }

        // Verify school exists
        await this.schoolRepository.get(school_id);

        const existing = await this.teacherRepository.findOne({ where: { email } });
        if (existing) {
            throw new AppError('A teacher with this email already exists', StatusCodes.CONFLICT);
        }

        return await this.teacherRepository.create(data);
    }

    async getTeacher(id) {
        return await this.teacherRepository.get(id, {
            include: [
                { association: 'school', attributes: ['id', 'name', 'email'] },
                {
                    association: 'classes',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                },
                {
                    association: 'subjects',
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });
    }

    async getAllTeachers(query = {}) {
        const where = {};

        if (query.school_id) {
            where.school_id = query.school_id;
        }

        if (query.search) {
            const search = `%${query.search.trim()}%`;
            where[Op.or] = [
                { name: { [Op.like]: search } },
                { email: { [Op.like]: search } },
                { mobile_number: { [Op.like]: search } }
            ];
        }

        const include = [
            { association: 'school', attributes: ['id', 'name'] },
            {
                association: 'classes',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            },
            {
                association: 'subjects',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        ];

        if (query.all === 'true') {
            const teachers = await this.teacherRepository.getAll({
                where,
                include,
                order: [['name', 'ASC']],
                distinct: true
            });
            return {
                totalRecords: teachers.length,
                totalPages: 1,
                currentPage: 1,
                limit: teachers.length,
                rows: teachers
            };
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await this.teacherRepository.findAndCountAll({
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

    async updateTeacher(id, data) {
        if (data.school_id) {
            await this.schoolRepository.get(data.school_id);
        }

        if (data.email) {
            const existing = await this.teacherRepository.findOne({
                where: { email: data.email, id: { [Op.ne]: id } }
            });
            if (existing) {
                throw new AppError('A teacher with this email already exists', StatusCodes.CONFLICT);
            }
        }

        return await this.teacherRepository.update(id, data);
    }

    async deleteTeacher(id) {
        return await this.teacherRepository.destroy(id);
    }

    async assignSubject(teacherId, subjectId) {
        const teacher = await this.teacherRepository.get(teacherId);
        const subject = await this.subjectRepository.get(subjectId);

        if (teacher.school_id !== subject.school_id) {
            throw new AppError('Subject and Teacher must belong to the same school', StatusCodes.BAD_REQUEST);
        }

        const { assignment, created } = await this.teacherSubjectRepository.assign(teacherId, subjectId);
        return {
            assigned: true,
            isNew: created,
            teacherId,
            subjectId
        };
    }

    async removeSubject(teacherId, subjectId) {
        await this.teacherRepository.get(teacherId);
        await this.subjectRepository.get(subjectId);

        const response = await this.teacherSubjectRepository.unassign(teacherId, subjectId);
        if (!response) {
            throw new AppError('Assignment not found to remove', StatusCodes.NOT_FOUND);
        }
        return { unassigned: true, teacherId, subjectId };
    }

    async assignClass(teacherId, classId) {
        const teacher = await this.teacherRepository.get(teacherId);
        const cls = await this.classRepository.get(classId);

        if (teacher.school_id !== cls.school_id) {
            throw new AppError('Teacher and Class must belong to the same school', StatusCodes.BAD_REQUEST);
        }

        const { assignment, created } = await this.teacherClassRepository.assign(teacherId, classId);
        return {
            assigned: true,
            isNew: created,
            teacherId,
            classId
        };
    }

    async removeClass(teacherId, classId) {
        await this.teacherRepository.get(teacherId);
        await this.classRepository.get(classId);

        const response = await this.teacherClassRepository.unassign(teacherId, classId);
        if (!response) {
            throw new AppError('Assignment not found to remove', StatusCodes.NOT_FOUND);
        }
        return { unassigned: true, teacherId, classId };
    }
}

module.exports = TeacherService;

