import { generateToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

const users = []; // Та же "база данных"

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        // Возвращаем пользователя без пароля
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}