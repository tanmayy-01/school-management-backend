const { StatusCodes } = require('http-status-codes');
const { AuthService } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const authService = new AuthService();

const signup = async (req, res) => {
    try {
        const response = await authService.signup({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile_number: req.body.mobile_number,
            role_name: req.body.role_name || 'admin'
        });
        return res
            .status(StatusCodes.CREATED)
            .json(successResponse('Successfully registered user', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const signin = async (req, res) => {
    try {
        const response = await authService.signin({
            email: req.body.email,
            password: req.body.password
        });
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully authenticated', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

const me = async (req, res) => {
    try {
        const response = await authService.getProfile(req.user.id);
        return res
            .status(StatusCodes.OK)
            .json(successResponse('Successfully retrieved profile', response));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse(error.message, error.explanation || error));
    }
};

module.exports = {
    signup,
    signin,
    me
};

