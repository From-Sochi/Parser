// import { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// // Убедитесь, что установили xlsx-style: npm install xlsx-style
// import { withAuth } from '../components/withAuth';
// import {
//     Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//     Typography, Box, Container, Pagination, Stack, Chip, Card, CardContent, CardActions,
//     IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel
// } from '@mui/material';
// import { Download, ArrowBack, ArrowForward, Refresh, Sort } from '@mui/icons-material';

// function Results() {
//     const [data, setData] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortField, setSortField] = useState('id');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const itemsPerPage = 5;

//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = () => {
//         const savedData = localStorage.getItem('parsedData');
//         if (savedData) {
//             setData(JSON.parse(savedData));
//         }
//     };

//     // Функция сортировки данных
//     const sortedData = [...data].sort((a, b) => {
//         let valueA = a[sortField];
//         let valueB = b[sortField];

//         if (typeof valueA === 'string') valueA = valueA.toLowerCase();
//         if (typeof valueB === 'string') valueB = valueB.toLowerCase();

//         if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
//         if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
//         return 0;
//     });

//     const exportToExcel = () => {
//         // Создаем новую книгу
//         const workbook = XLSX.utils.book_new();

//         // Создаем данные для экспорта
//         const excelData = [
//             ['ID', 'Name', 'Email', 'City', 'Phone'], // Заголовки
//             ...sortedData.map(item => [
//                 item.id,
//                 item.name,
//                 item.email,
//                 item.city,
//                 item.phone
//             ])
//         ];

//         // Создаем worksheet
//         const worksheet = XLSX.utils.aoa_to_sheet(excelData);

//         // Устанавливаем ширину колонок
//         const columnWidths = [
//             { wch: 10 }, // ID
//             { wch: 20 }, // Name
//             { wch: 30 }, // Email
//             { wch: 15 }, // City
//             { wch: 15 }  // Phone
//         ];
//         worksheet['!cols'] = columnWidths;

//         // Добавляем автофильтр
//         worksheet['!autofilter'] = {
//             ref: XLSX.utils.encode_range({
//                 s: { r: 0, c: 0 },
//                 e: { r: 0, c: 4 }
//             })
//         };

//         // Добавляем заморозку первой строки
//         worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' };

//         // Добавляем лист в книгу
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');

//         // Сохраняем файл
//         XLSX.writeFile(workbook, 'users_data.xlsx');
//     };

//     const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//     const currentData = sortedData.slice(
//         (currentPage - 1) * itemsPerPage,
//         currentPage * itemsPerPage
//     );

//     const handlePageChange = (event, value) => {
//         setCurrentPage(value);
//     };

//     const handleSortFieldChange = (event) => {
//         setSortField(event.target.value);
//         setCurrentPage(1);
//     };

//     const handleSortOrderChange = (event) => {
//         setSortOrder(event.target.value);
//         setCurrentPage(1);
//     };

//     return (
//         <Box sx={{
//             background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//             minHeight: '100vh',
//             py: 4
//         }}>
//             <Container maxWidth="lg">
//                 <Card elevation={3}>
//                     <CardContent>
//                         {/* Заголовок и кнопки */}
//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                             <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
//                                 Results
//                             </Typography>

//                             <Stack direction="row" spacing={2}>
//                                 <Tooltip title="Refresh data">
//                                     <IconButton color="primary" onClick={loadData}>
//                                         <Refresh />
//                                     </IconButton>
//                                 </Tooltip>

//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     startIcon={<Download />}
//                                     onClick={exportToExcel}
//                                     sx={{
//                                         borderRadius: 2,
//                                         px: 3,
//                                         py: 1,
//                                         fontWeight: 'bold'
//                                     }}
//                                 >
//                                     Выгрузить в Excel
//                                 </Button>
//                             </Stack>
//                         </Box>

//                         {/* Сортировка */}
//                         <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Sort color="primary" />
//                                 <Typography variant="body1" fontWeight="500">
//                                     Отсортировать по:
//                                 </Typography>
//                             </Box>

//                             <FormControl size="small" sx={{ minWidth: 120 }}>
//                                 <InputLabel>Field</InputLabel>
//                                 <Select
//                                     value={sortField}
//                                     label="Field"
//                                     onChange={handleSortFieldChange}
//                                 >
//                                     <MenuItem value="id">ID</MenuItem>
//                                     <MenuItem value="name">Name</MenuItem>
//                                     <MenuItem value="email">Email</MenuItem>
//                                     <MenuItem value="city">City</MenuItem>
//                                     <MenuItem value="phone">Phone</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <FormControl size="small" sx={{ minWidth: 120 }}>
//                                 <InputLabel>Order</InputLabel>
//                                 <Select
//                                     value={sortOrder}
//                                     label="Order"
//                                     onChange={handleSortOrderChange}
//                                 >
//                                     <MenuItem value="asc">По возрастанию</MenuItem>
//                                     <MenuItem value="desc">По убыванию</MenuItem>
//                                 </Select>
//                             </FormControl>

//                             <Chip
//                                 label={`Всего результатов: ${data.length}`}
//                                 color="primary"
//                                 variant="outlined"
//                                 sx={{ fontWeight: '500' }}
//                             />
//                             <Chip
//                                 label={`Страница ${currentPage} из ${totalPages}`}
//                                 color="secondary"
//                                 variant="outlined"
//                                 sx={{ fontWeight: '500' }}
//                             />
//                         </Box>

//                         {/* Таблица */}
//                         <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//                             <Table sx={{ minWidth: 650 }}>
//                                 <TableHead>
//                                     <TableRow sx={{ bgcolor: 'primary.main' }}>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>City</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Phone</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {currentData.map((item, index) => (
//                                         <TableRow
//                                             key={item.id}
//                                             sx={{
//                                                 '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
//                                                 '&:hover': { bgcolor: 'action.selected' },
//                                                 transition: 'background-color 0.2s'
//                                             }}
//                                         >
//                                             <TableCell sx={{ fontWeight: 'medium' }}>{item.id}</TableCell>
//                                             <TableCell sx={{ color: 'text.primary', fontWeight: '500' }}>{item.name}</TableCell>
//                                             <TableCell sx={{ color: 'primary.main' }}>{item.email}</TableCell>
//                                             <TableCell>{item.city}</TableCell>
//                                             <TableCell sx={{ fontFamily: 'monospace' }}>{item.phone}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

//                         {/* Пагинация */}
//                         {sortedData.length > 0 && (
//                             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//                                 <Stack direction="row" spacing={2} alignItems="center">
//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         startIcon={<ArrowBack />}
//                                         disabled={currentPage === 1}
//                                         onClick={() => setCurrentPage(p => p - 1)}
//                                         sx={{ borderRadius: 2 }}
//                                     >
//                                         Предыдущая
//                                     </Button>

//                                     <Pagination
//                                         count={totalPages}
//                                         page={currentPage}
//                                         onChange={handlePageChange}
//                                         color="primary"
//                                         shape="rounded"
//                                         showFirstButton
//                                         showLastButton
//                                     />

//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         endIcon={<ArrowForward />}
//                                         disabled={currentPage === totalPages}
//                                         onClick={() => setCurrentPage(p => p + 1)}
//                                         sx={{ borderRadius: 2 }}
//                                     >
//                                         Следующая
//                                     </Button>
//                                 </Stack>
//                             </Box>
//                         )}

//                         {/* Сообщение если данных нет */}
//                         {data.length === 0 && (
//                             <Box sx={{ textAlign: 'center', py: 8 }}>
//                                 <Typography variant="h6" color="text.secondary">
//                                     No data available. Please upload a file first.
//                                 </Typography>
//                             </Box>
//                         )}
//                     </CardContent>

//                     <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
//                         <Typography variant="body2" color="text.secondary">

//                             Данные загружены из локального хранилища • Сортировка по: {sortField}
//                         </Typography>
//                     </CardActions>
//                 </Card>
//             </Container>
//         </Box>
//     );
// }

// export default withAuth(Results);




import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { withAuth } from '../components/withAuth';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, Container, Pagination, Stack, Chip, Card, CardContent, CardActions,
    IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Download, ArrowBack, ArrowForward, Refresh, Sort, Link as LinkIcon } from '@mui/icons-material';

function Results() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sourceUrl, setSourceUrl] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const savedData = localStorage.getItem('parsedData');
        const savedUrl = localStorage.getItem('sourceUrl');

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData);

            // Динамически определяем колонки
            if (parsedData.length > 0) {
                const allColumns = new Set();
                parsedData.forEach(item => {
                    Object.keys(item).forEach(key => {
                        allColumns.add(key);
                    });
                });
                setColumns(Array.from(allColumns));
            }
        }

        if (savedUrl) {
            setSourceUrl(savedUrl);
        }
    };

    // Функция сортировки данных
    const sortedData = [...data].sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        if (valueA === undefined || valueA === null) valueA = '';
        if (valueB === undefined || valueB === null) valueB = '';

        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Создаем заголовки динамически
        const headers = columns;
        const excelData = [
            headers,
            ...sortedData.map(item =>
                headers.map(header => item[header] !== undefined ? item[header] : '')
            )
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(excelData);

        // Динамически устанавливаем ширину колонок
        const columnWidths = headers.map(header => ({ wch: Math.max(15, header.length * 1.5) }));
        worksheet['!cols'] = columnWidths;

        // Автофильтр
        worksheet['!autofilter'] = {
            ref: XLSX.utils.encode_range({
                s: { r: 0, c: 0 },
                e: { r: 0, c: headers.length - 1 }
            })
        };

        // Заморозка первой строки
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' };

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Parsed Data');
        XLSX.writeFile(workbook, 'parsed_data.xlsx');
    };

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const currentData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSortFieldChange = (event) => {
        setSortField(event.target.value);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
        setCurrentPage(1);
    };

    return (
        <Box sx={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth="lg">
                <Card elevation={3}>
                    <CardContent>
                        {/* Заголовок и кнопки */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
                                    Результаты парсинга
                                </Typography>
                                {sourceUrl && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        <LinkIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        Источник: {sourceUrl}
                                    </Typography>
                                )}
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <Tooltip title="Обновить данные">
                                    <IconButton color="primary" onClick={loadData}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Download />}
                                    onClick={exportToExcel}
                                    disabled={data.length === 0}
                                    sx={{
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Выгрузить в Excel
                                </Button>
                            </Stack>
                        </Box>

                        {/* Сортировка */}
                        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Sort color="primary" />
                                <Typography variant="body1" fontWeight="500">
                                    Отсортировать по:
                                </Typography>
                            </Box>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Поле</InputLabel>
                                <Select
                                    value={sortField}
                                    label="Поле"
                                    onChange={handleSortFieldChange}
                                >
                                    {columns.map(column => (
                                        <MenuItem key={column} value={column}>
                                            {column}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Порядок</InputLabel>
                                <Select
                                    value={sortOrder}
                                    label="Порядок"
                                    onChange={handleSortOrderChange}
                                >
                                    <MenuItem value="asc">По возрастанию</MenuItem>
                                    <MenuItem value="desc">По убыванию</MenuItem>
                                </Select>
                            </FormControl>

                            <Chip
                                label={`Всего записей: ${data.length}`}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: '500' }}
                            />
                            <Chip
                                label={`Колонок: ${columns.length}`}
                                color="secondary"
                                variant="outlined"
                                sx={{ fontWeight: '500' }}
                            />
                            <Chip
                                label={`Страница ${currentPage} из ${totalPages}`}
                                color="info"
                                variant="outlined"
                                sx={{ fontWeight: '500' }}
                            />
                        </Box>

                        {/* Таблица */}
                        {data.length > 0 && (
                            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'auto', maxHeight: 600 }}>
                                <Table stickyHeader sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: 'primary.main' }}>
                                            {columns.map(column => (
                                                <TableCell
                                                    key={column}
                                                    sx={{
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {column}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentData.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                                    '&:hover': { bgcolor: 'action.selected' },
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                {columns.map(column => (
                                                    <TableCell
                                                        key={column}
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        title={item[column] !== undefined ? String(item[column]) : ''}
                                                    >
                                                        {item[column] !== undefined ? String(item[column]) : '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {/* Пагинация */}
                        {sortedData.length > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<ArrowBack />}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Предыдущая
                                    </Button>

                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        shape="rounded"
                                        showFirstButton
                                        showLastButton
                                    />

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        endIcon={<ArrowForward />}
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Следующая
                                    </Button>
                                </Stack>
                            </Box>
                        )}

                        {/* Сообщение если данных нет */}
                        {data.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Нет данных для отображения. Пожалуйста, выполните парсинг сначала.
                                </Typography>
                            </Box>
                        )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Данные загружены {new Date().toLocaleString()} • Сортировка по: {sortField} ({sortOrder})
                        </Typography>
                    </CardActions>
                </Card>
            </Container>
        </Box>
    );
}

export default withAuth(Results);