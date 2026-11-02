const { StatusCodes } = require('http-status-codes');
const { UserRepository, RoleRepository } = require('../repositories');
const { AppError, hashPassword, comparePassword, generateToken } = require('../utils');

class AuthService {
    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
    }

    async signup(data) {
        const { name, email, password, mobile_number, role_name = 'admin' } = data;

        if (!name || !email || !password) {
            throw new AppError('Name, email and password are required', StatusCodes.BAD_REQUEST);
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('User with this email already exists', StatusCodes.CONFLICT);
        }

        let role = await this.roleRepository.getRoleByName(role_name);
        if (!role) {
            role = await this.roleRepository.create({ role_name });
        }

        const hashedPassword = await hashPassword(password);
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            mobile_number,
            role_id: role.id
        });

        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: role.role_name
        };
        const token = generateToken(tokenPayload);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile_number: user.mobile_number,
                role: role.role_name
            },
            token
        };
    }

    async signin({ email, password }) {
        if (!email || !password) {
            throw new AppError('Email and password are required', StatusCodes.BAD_REQUEST);
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
        }

        const isPasswordMatch = await comparePassword(password, user.password);
        if (!isPasswordMatch) {
            throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
        }

        const roleName = user.role ? user.role.role_name : 'admin';
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: roleName
        };
        const token = generateToken(tokenPayload);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile_number: user.mobile_number,
                role: roleName
            },
            token
        };
    }

    async getProfile(userId) {
        const user = await this.userRepository.get(userId, {
            attributes: ['id', 'name', 'email', 'mobile_number', 'role_id', 'createdAt'],
            include: [
                {
                    association: 'role',
                    attributes: ['id', 'role_name']
                }
            ]
        });
        return user;
    }
}

module.exports = AuthService;

