const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');
const {
    ClassRepository,
    SchoolRepository,
    TeacherRepository,
    SubjectRepository,
    TeacherClassRepository,
    ClassSubjectRepository
} = require('../repositories');
const { AppError } = require('../utils');

class ClassService {
    constructor() {
        this.classRepository = new ClassRepository();
        this.schoolRepository = new SchoolRepository();
        this.teacherRepository = new TeacherRepository();
        this.subjectRepository = new SubjectRepository();
        this.teacherClassRepository = new TeacherClassRepository();
        this.classSubjectRepository = new ClassSubjectRepository();
    }

    async createClass(data) {
        const { name, school_id } = data;
        if (!name || !school_id) {
            throw new AppError('Class name and school_id are required', StatusCodes.BAD_REQUEST);
        }

        // Validate school exists
        await this.schoolRepository.get(school_id);

        return await this.classRepository.create(data);
    }

    async getClass(id) {
        return await this.classRepository.get(id, {
            include: [
                { association: 'school', attributes: ['id', 'name', 'email'] },
                {
                    association: 'teachers',
                    attributes: ['id', 'name', 'email', 'mobile_number'],
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

    async getAllClasses(query = {}) {
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
                association: 'subjects',
                attributes: ['id', 'name'],
                through: { attributes: [] }
            }
        ];

        // Return all classes without pagination (useful for dropdowns filtered by school)
        if (query.all === 'true') {
            const classes = await this.classRepository.getAll({
                where,
                include,
                order: [['name', 'ASC']],
                distinct: true
            });
            return {
                totalRecords: classes.length,
                totalPages: 1,
                currentPage: 1,
                limit: classes.length,
                rows: classes
            };
        }

        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const limit = Math.max(1, parseInt(query.limit, 10) || 10);
        const offset = (page - 1) * limit;

        const { count, rows } = await this.classRepository.findAndCountAll({
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

    async updateClass(id, data) {
        if (data.school_id) {
            await this.schoolRepository.get(data.school_id);
        }
        return await this.classRepository.update(id, data);
    }

    async deleteClass(id) {
        return await this.classRepository.destroy(id);
    }

    async assignTeacher(classId, teacherId) {
        const cls = await this.classRepository.get(classId);
        const teacher = await this.teacherRepository.get(teacherId);

        if (cls.school_id !== teacher.school_id) {
            throw new AppError(
                'Teacher and Class must belong to the same school',
                StatusCodes.BAD_REQUEST
            );
        }

        const { assignment, created } = await this.teacherClassRepository.assign(teacherId, classId);
        return {
            assigned: true,
            isNew: created,
            classId,
            teacherId
        };
    }

    async removeTeacher(classId, teacherId) {
        await this.classRepository.get(classId);
        await this.teacherRepository.get(teacherId);

        const response = await this.teacherClassRepository.unassign(teacherId, classId);
        if (!response) {
            throw new AppError('Assignment not found to remove', StatusCodes.NOT_FOUND);
        }
        return { unassigned: true, classId, teacherId };
    }

    async assignSubject(classId, subjectId) {
        const cls = await this.classRepository.get(classId);
        const subject = await this.subjectRepository.get(subjectId);

        if (cls.school_id !== subject.school_id) {
            throw new AppError(
                'Subject and Class must belong to the same school',
                StatusCodes.BAD_REQUEST
            );
        }

        const { assignment, created } = await this.classSubjectRepository.assign(classId, subjectId);
        return {
            assigned: true,
            isNew: created,
            classId,
            subjectId
        };
    }

    async removeSubject(classId, subjectId) {
        await this.classRepository.get(classId);
        await this.subjectRepository.get(subjectId);

        const response = await this.classSubjectRepository.unassign(classId, subjectId);
        if (!response) {
            throw new AppError('Assignment not found to remove', StatusCodes.NOT_FOUND);
        }
        return { unassigned: true, classId, subjectId };
    }
}

module.exports = ClassService;

