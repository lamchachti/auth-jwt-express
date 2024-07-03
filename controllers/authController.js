const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { addUser, findUser } = require('../models/user');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const register = async (req, res) => {
    const { username, password } = req.body;
    if (findUser(username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await addUser(username, password);
    res.status(201).json({ message: 'User registered', user: { username: user.username } });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(200).json({ message: 'Logged in', token });
};

const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = {
    register,
    login,
    authenticate
};
