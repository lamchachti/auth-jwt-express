const express = require('express');
const { register, login, authenticate } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ruta protegida como ejemplo
router.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.username}` });
});

module.exports = router;
