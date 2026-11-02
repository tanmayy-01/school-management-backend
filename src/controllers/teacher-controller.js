const { StatusCodes } = require('http-status-codes');
const { TeacherService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const teacherService = new TeacherService();

const create = async (req, res) => {
    try {
        const response = await teacherService.createTeacher({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            mobile_number: req.body.mobile_number,
            school_id: req.body.school_id
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully created teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const get = async (req, res) => {
    try {
        const response = await teacherService.getTeacher(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched teacher details', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getAll = async (req, res) => {
    try {
        const response = await teacherService.getAllTeachers(req.query);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched teachers', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const update = async (req, res) => {
    try {
        const response = await teacherService.updateTeacher(req.params.id, req.body);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully updated teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const destroy = async (req, res) => {
    try {
        const response = await teacherService.deleteTeacher(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully deleted teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const assignSubject = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const subjectId = req.body.subject_id;
        const response = await teacherService.assignSubject(teacherId, subjectId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully assigned subject to teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const removeSubject = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const subjectId = req.params.subjectId || req.body.subject_id;
        const response = await teacherService.removeSubject(teacherId, subjectId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully removed subject from teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const assignClass = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const classId = req.body.class_id;
        const response = await teacherService.assignClass(teacherId, classId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully assigned class to teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const removeClass = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const classId = req.params.classId || req.body.class_id;
        const response = await teacherService.removeClass(teacherId, classId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully removed class from teacher', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

module.exports = {
    create,
    get,
    getAll,
    update,
    destroy,
    assignSubject,
    removeSubject,
    assignClass,
    removeClass
};

