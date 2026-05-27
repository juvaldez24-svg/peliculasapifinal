const jwt = require('jsonwebtoken');

const authService = {
    login: async (username, password) => {
        const USER_VALIDO = 'shield';
        const PASSWORD_VALIDO = 'avengers2026';

        if (username !== USER_VALIDO || password !== PASSWORD_VALIDO) {
            throw new Error('Usuario o contraseña incorrectos.');
        }

        const payload = {
            user: username,
            role: 'ADMIN'
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'avengers_jwt_secret', 
            { expiresIn: '2h' }
        );

        return token;
    }
};

module.exports = authService;