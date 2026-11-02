const { StatusCodes } = require('http-status-codes');
const { SchoolService, ClassService, SubjectService, TeacherService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const schoolService = new SchoolService();
const classService = new ClassService();
const subjectService = new SubjectService();
const teacherService = new TeacherService();

const create = async (req, res) => {
    try {
        const response = await schoolService.createSchool({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            mobile_number: req.body.mobile_number
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully created school', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const get = async (req, res) => {
    try {
        const response = await schoolService.getSchool(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched school details', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getAll = async (req, res) => {
    try {
        const response = await schoolService.getAllSchools(req.query);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched schools', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const update = async (req, res) => {
    try {
        const response = await schoolService.updateSchool(req.params.id, req.body);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully updated school', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const destroy = async (req, res) => {
    try {
        const response = await schoolService.deleteSchool(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully deleted school', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getClassesBySchool = async (req, res) => {
    try {
        const response = await classService.getAllClasses({
            ...req.query,
            school_id: req.params.id,
            all: req.query.all !== undefined ? req.query.all : 'true'
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched classes for school', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getSubjectsBySchool = async (req, res) => {
    try {
        const response = await subjectService.getAllSubjects({
            ...req.query,
            school_id: req.params.id,
            all: req.query.all !== undefined ? req.query.all : 'true'
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched subjects for school', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getTeachersBySchool = async (req, res) => {
    try {
        const response = await teacherService.getAllTeachers({
            ...req.query,
            school_id: req.params.id,
            all: req.query.all !== undefined ? req.query.all : 'true'
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched teachers for school', response));
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
    getClassesBySchool,
    getSubjectsBySchool,
    getTeachersBySchool
};

