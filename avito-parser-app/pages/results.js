import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { withAuth } from '../components/withAuth';
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container, Pagination, Stack, Chip, Card, CardContent, CardActions, IconButton, Tooltip
} from '@mui/material';
import { Download, ArrowBack, ArrowForward, Refresh } from '@mui/icons-material';

function Results() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const savedData = localStorage.getItem('parsedData');
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');
        XLSX.writeFile(workbook, 'users_data.xlsx');
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card elevation={3}>
                <CardContent>
                    {/* Заголовок и кнопки */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
                            Results
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Tooltip title="Refresh data">
                                <IconButton color="primary" onClick={loadData}>
                                    <Refresh />
                                </IconButton>
                            </Tooltip>

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<Download />}
                                onClick={exportToExcel}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1
                                }}
                            >
                                Export to Excel
                            </Button>
                        </Stack>
                    </Box>

                    {/* Информация о данных */}
                    <Box sx={{ mb: 2 }}>
                        <Chip
                            label={`Total records: ${data.length}`}
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                        <Chip
                            label={`Page ${currentPage} of ${totalPages}`}
                            color="secondary"
                            variant="outlined"
                        />
                    </Box>

                    {/* Таблица */}
                    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Name</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>City</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Phone</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentData.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                                            '&:hover': { bgcolor: 'action.selected' },
                                            transition: 'background-color 0.2s'
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 'medium' }}>{item.id}</TableCell>
                                        <TableCell sx={{ color: 'text.primary', fontWeight: '500' }}>{item.name}</TableCell>
                                        <TableCell sx={{ color: 'primary.main' }}>{item.email}</TableCell>
                                        <TableCell>{item.city}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{item.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Пагинация */}
                    {data.length > 0 && (
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
                                    Previous
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
                                    Next
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {/* Сообщение если данных нет */}
                    {data.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography variant="h6" color="text.secondary">
                                No data available. Please upload a file first.
                            </Typography>
                        </Box>
                    )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Data loaded from local storage
                    </Typography>
                </CardActions>
            </Card>
        </Container>
    );
}

export default withAuth(Results);