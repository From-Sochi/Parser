import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // В продакшене используйте переменные окружения

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}