// //ДИНАМИЧЕСКИЙ ИМПОРТ
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
//         const { url } = req.body;

//         if (!url) {
//             return res.status(400).json({ error: 'URL is required' });
//         }

//         // Валидация URL
//         try {
//             const parsedUrl = new URL(url);
//             // Дополнительная проверка на допустимые протоколы
//             if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
//                 return res.status(400).json({ error: 'Only HTTP and HTTPS protocols are allowed' });
//             }
//         } catch (error) {
//             return res.status(400).json({ error: 'Invalid URL' });
//         }

//         // Получаем данные с указанного URL
//         const response = await axios.get(url, {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//                 'Accept': 'application/json'
//             },
//             validateStatus: function (status) {
//                 return status >= 200 && status < 300; // Разрешаем только успешные статусы
//             }
//         });

//         let responseData = response.data;

//         // Обрабатываем разные форматы ответа
//         // 1. Если ответ - массив, используем как есть
//         // 2. Если ответ - объект, ищем в нем массив данных
//         if (!Array.isArray(responseData)) {
//             // Пытаемся найти массив в объекте
//             const arrayKeys = Object.keys(responseData).filter(key =>
//                 Array.isArray(responseData[key])
//             );

//             if (arrayKeys.length === 1) {
//                 // Если нашли ровно один массив - используем его
//                 responseData = responseData[arrayKeys[0]];
//             } else if (arrayKeys.length > 1) {
//                 // Если несколько массивов - возвращаем ошибку
//                 return res.status(400).json({
//                     error: 'Response contains multiple arrays. Please specify which one to use.'
//                 });
//             } else {
//                 // Если массивов нет - создаем массив из одного элемента
//                 responseData = [responseData];
//             }
//         }

//         // Динамически формируем данные
//         const parsedData = responseData.map((item, index) => {
//             const result = {
//                 id: item.id !== undefined ? item.id : index + 1,
//                 date: new Date().toLocaleDateString(),
//                 time: new Date().toLocaleTimeString()
//             };

//             // Рекурсивная функция для извлечения всех полей
//             const extractFields = (obj, prefix = '') => {
//                 Object.keys(obj).forEach(key => {
//                     const fullKey = prefix ? `${prefix}_${key}` : key;
//                     const value = obj[key];

//                     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//                         // Если значение - объект, рекурсивно извлекаем его поля
//                         extractFields(value, fullKey);
//                     } else if (Array.isArray(value)) {
//                         // Если значение - массив, преобразуем в строку
//                         result[fullKey] = JSON.stringify(value);
//                     } else {
//                         // Простые значения
//                         result[fullKey] = value;
//                     }
//                 });
//             };

//             extractFields(item);
//             return result;
//         });

//         res.json(parsedData);
//     } catch (error) {
//         console.error('Parse error:', error.message);

//         if (error.code === 'ECONNABORTED') {
//             return res.status(408).json({ error: 'Request timeout' });
//         }

//         if (error.response) {
//             return res.status(error.response.status).json({
//                 error: `Server responded with status ${error.response.status}: ${error.response.statusText}`
//             });
//         }

//         res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
//     }
// }






//ДИНАМИЧЕСКИЙ ИМПОРТ
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

        console.log('Parsing URL:', url);

        // Валидация URL
        try {
            const parsedUrl = new URL(url);
            // Дополнительная проверка на допустимые протоколы
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                return res.status(400).json({ error: 'Only HTTP and HTTPS protocols are allowed' });
            }
        } catch (error) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // Получаем данные с указанного URL
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            validateStatus: function (status) {
                return status >= 200 && status < 300; // Разрешаем только успешные статусы
            }
        });

        console.log('Response status:', response.status);
        console.log('Response content type:', response.headers['content-type']);

        let responseData = response.data;

        // Проверяем, что данные действительно JSON
        if (typeof responseData !== 'object' || responseData === null) {
            console.error('Invalid response data type:', typeof responseData);
            return res.status(400).json({ error: 'Response is not valid JSON' });
        }

        // Обрабатываем разные форматы ответа
        // 1. Если ответ - массив, используем как есть
        // 2. Если ответ - объект, ищем в нем массив данных
        if (!Array.isArray(responseData)) {
            // Пытаемся найти массив в объекте
            const arrayKeys = Object.keys(responseData).filter(key =>
                Array.isArray(responseData[key])
            );

            if (arrayKeys.length === 1) {
                // Если нашли ровно один массив - используем его
                responseData = responseData[arrayKeys[0]];
                console.log('Using array from key:', arrayKeys[0]);
            } else if (arrayKeys.length > 1) {
                // Если несколько массивов - возвращаем ошибку
                console.log('Multiple arrays found:', arrayKeys);
                return res.status(400).json({
                    error: 'Response contains multiple arrays. Please specify which one to use.'
                });
            } else {
                // Если массивов нет - создаем массив из одного элемента
                console.log('No arrays found, converting object to array');
                responseData = [responseData];
            }
        }

        console.log('Final data array length:', responseData.length);

        // Динамически формируем данные
        const parsedData = responseData.map((item, index) => {
            const result = {
                id: item.id !== undefined ? item.id : index + 1,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };

            // Рекурсивная функция для извлечения всех полей
            const extractFields = (obj, prefix = '') => {
                Object.keys(obj).forEach(key => {
                    const fullKey = prefix ? `${prefix}_${key}` : key;
                    const value = obj[key];

                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        // Если значение - объект, рекурсивно извлекаем его поля
                        extractFields(value, fullKey);
                    } else if (Array.isArray(value)) {
                        // Если значение - массив, преобразуем в строку
                        result[fullKey] = JSON.stringify(value);
                    } else {
                        // Простые значения
                        result[fullKey] = value;
                    }
                });
            };

            extractFields(item);
            return result;
        });

        console.log('Successfully parsed', parsedData.length, 'items');
        res.json(parsedData);
    } catch (error) {
        console.error('Parse error:', error.message);
        console.error('Error stack:', error.stack);

        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ error: 'Request timeout' });
        }

        if (error.response) {
            console.error('Response error:', error.response.status, error.response.data);
            return res.status(error.response.status).json({
                error: `Server responded with status ${error.response.status}: ${error.response.statusText}`
            });
        }

        res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
    }
}