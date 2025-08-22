import { verifyToken } from '../../lib/auth';

// Простая "база данных" в памяти
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

export default function handler(req, res) {
    // Проверка авторизации
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Возвращаем список пользователей (без паролей)
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        res.json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}