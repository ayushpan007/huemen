const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const token = generateToken({
            userId: user._id,
            role: user.role,
        });

        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    register,
    login,
};
