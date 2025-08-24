// import { verifyToken } from '../../lib/auth';
// import axios from 'axios';

// export default async function handler(req, res) {
//     // Проверка авторизации
//     const token = req.headers.authorization?.replace('Bearer ', '');
//     const decoded = verifyToken(token);

//     if (!decoded) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     try {
//         // Вместо парсинга Avito получаем тестовые данные
//         const response = await axios.get('https://jsonplaceholder.typicode.com/users');

//         // Преобразуем данные в нужный формат
//         const parsedData = response.data.map(user => ({
//             id: user.id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//             street: user.address.street,
//             city: user.address.city,
//             zipcode: user.address.zipcode,
//             phone: user.phone,
//             company: user.company.name,
//             date: new Date().toLocaleDateString(),
//             time: new Date().toLocaleTimeString()
//         }));

//         res.json(parsedData);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch data' });
//     }
// }



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
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Валидация URL
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // Получаем данные с указанного URL
        const response = await axios.get(url, {
            timeout: 10000, // 10 секунд таймаут
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Проверяем, что данные являются массивом
        if (!Array.isArray(response.data)) {
            return res.status(400).json({ error: 'Response data is not an array' });
        }

        // Динамически формируем данные
        const parsedData = response.data.map((item, index) => {
            const result = {
                id: item.id !== undefined ? item.id : index + 1,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };

            // Динамически добавляем все поля из объекта
            Object.keys(item).forEach(key => {
                // Пропускаем уже добавленные поля
                if (key !== 'id') {
                    // Если значение - объект, преобразуем в строку
                    if (typeof item[key] === 'object' && item[key] !== null) {
                        result[key] = JSON.stringify(item[key]);
                    } else {
                        result[key] = item[key];
                    }
                }
            });

            return result;
        });

        res.json(parsedData);
    } catch (error) {
        console.error('Parse error:', error.message);
        
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ error: 'Request timeout' });
        }
        
        if (error.response) {
            return res.status(error.response.status).json({ 
                error: `Server responded with status ${error.response.status}` 
            });
        }
        
        res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
    }
}