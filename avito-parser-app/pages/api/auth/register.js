import { generateToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

// "База данных" в памяти (в реальном проекте используйте MongoDB, PostgreSQL и т.д.)
const users = [];

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, name } = req.body;

    try {
        // Проверяем, существует ли пользователь
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = {
            id: Date.now(),
            email,
            password: hashedPassword,
            name,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        // Генерируем JWT токен
        const token = generateToken({
            userId: newUser.id,
            email: newUser.email
        });

        // Возвращаем ответ (без пароля)
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}