import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { withAuth } from '../components/withAuth';
import IndexedDBStorage from '../lib/IndexedDBStorage';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, Box, CircularProgress, Container, Pagination, Stack, Chip, Card, CardContent, CardActions,
    IconButton, Tooltip, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Download, ArrowBack, ArrowForward, Refresh, Sort, Link as LinkIcon } from '@mui/icons-material';
import BackButton from '../components/BackButton';

function Results() {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sourceUrl, setSourceUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 5;

    // КОСТЫЛЬ- Убрал марджин у body
    useEffect(() => {
        document.body.style.padding = '0';
        document.body.style.margin = '0';

        return () => {
            document.body.style.padding = '';
            document.body.style.margin = '';
        };
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const dbStorage = new IndexedDBStorage();
            await dbStorage.init();

            // Получаем данные из IndexedDB
            const parsedData = await dbStorage.getData('current');
            const savedUrl = await dbStorage.getData('sourceUrl');

            if (parsedData) {
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
        } catch (error) {
            console.error('Error loading data from IndexedDB:', error);
        } finally {
            setIsLoading(false);
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
            py: 4,
            paddingTop: 10,
        }}>
            <BackButton />
            <Container maxWidth="lg">
                <Card elevation={3}>
                    <CardContent>
                        {/* Заголовок и кнопки */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
                                    Results
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
                                    <IconButton color="primary" onClick={loadData} disabled={isLoading}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<Download />}
                                    onClick={exportToExcel}
                                    disabled={data.length === 0 || isLoading}
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

                        {/* Индикатор загрузки */}
                        {isLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <CircularProgress />
                            </Box>
                        )}

                        {!isLoading && (
                            <>
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
                            </>
                        )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Данные загружены {new Date().toLocaleString()} • Сортировка по: {sortField}
                        </Typography>
                    </CardActions>
                </Card>
            </Container>
        </Box>
    );
}

export default withAuth(Results);