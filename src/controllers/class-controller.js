const { StatusCodes } = require('http-status-codes');
const { ClassService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const classService = new ClassService();

const create = async (req, res) => {
    try {
        const response = await classService.createClass({
            name: req.body.name,
            school_id: req.body.school_id
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully created class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const get = async (req, res) => {
    try {
        const response = await classService.getClass(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched class details', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getAll = async (req, res) => {
    try {
        const response = await classService.getAllClasses(req.query);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched classes', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const update = async (req, res) => {
    try {
        const response = await classService.updateClass(req.params.id, req.body);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully updated class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const destroy = async (req, res) => {
    try {
        const response = await classService.deleteClass(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully deleted class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const assignTeacher = async (req, res) => {
    try {
        const classId = req.params.id;
        const teacherId = req.body.teacher_id;
        const response = await classService.assignTeacher(classId, teacherId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully assigned teacher to class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const removeTeacher = async (req, res) => {
    try {
        const classId = req.params.id;
        const teacherId = req.params.teacherId || req.body.teacher_id;
        const response = await classService.removeTeacher(classId, teacherId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully removed teacher from class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const assignSubject = async (req, res) => {
    try {
        const classId = req.params.id;
        const subjectId = req.body.subject_id;
        const response = await classService.assignSubject(classId, subjectId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully assigned subject to class', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const removeSubject = async (req, res) => {
    try {
        const classId = req.params.id;
        const subjectId = req.params.subjectId || req.body.subject_id;
        const response = await classService.removeSubject(classId, subjectId);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully removed subject from class', response));
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
    assignTeacher,
    removeTeacher,
    assignSubject,
    removeSubject
};

