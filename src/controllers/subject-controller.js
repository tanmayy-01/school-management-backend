const { StatusCodes } = require('http-status-codes');
const { SubjectService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const subjectService = new SubjectService();

const create = async (req, res) => {
    try {
        const response = await subjectService.createSubject({
            name: req.body.name,
            school_id: req.body.school_id
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully created subject', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const get = async (req, res) => {
    try {
        const response = await subjectService.getSubject(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched subject details', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getAll = async (req, res) => {
    try {
        const response = await subjectService.getAllSubjects(req.query);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched subjects', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const update = async (req, res) => {
    try {
        const response = await subjectService.updateSubject(req.params.id, req.body);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully updated subject', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const destroy = async (req, res) => {
    try {
        const response = await subjectService.deleteSubject(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully deleted subject', response));
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
    destroy
};

