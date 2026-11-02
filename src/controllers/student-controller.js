const { StatusCodes } = require('http-status-codes');
const { StudentService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const studentService = new StudentService();

const create = async (req, res) => {
    try {
        const response = await studentService.createStudent({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            mobile_number: req.body.mobile_number,
            school_id: req.body.school_id,
            class_id: req.body.class_id
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully created student', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const get = async (req, res) => {
    try {
        const response = await studentService.getStudent(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched student details', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const getAll = async (req, res) => {
    try {
        const response = await studentService.getAllStudents(req.query);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully fetched students', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const update = async (req, res) => {
    try {
        const response = await studentService.updateStudent(req.params.id, req.body);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully updated student', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const destroy = async (req, res) => {
    try {
        const response = await studentService.deleteStudent(req.params.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully deleted student', response));
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

