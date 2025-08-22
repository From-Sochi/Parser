import { verifyToken } from '../../lib/auth';
import axios from 'axios';

export default async function handler(req, res) {
    // Проверка авторизации
    const token = req.headers.authorization?.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Вместо парсинга Avito получаем тестовые данные
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');

        // Преобразуем данные в нужный формат
        const parsedData = response.data.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            street: user.address.street,
            city: user.address.city,
            zipcode: user.address.zipcode,
            phone: user.phone,
            company: user.company.name,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        }));

        res.json(parsedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}