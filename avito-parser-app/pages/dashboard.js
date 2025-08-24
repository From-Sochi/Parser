import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { withAuth } from '../components/withAuth';
import {
    Button,
    Container,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Alert,
    Grid,
    Fade,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    PlayArrow,
    Analytics,
    Speed,
    Security,
    DataArray
} from '@mui/icons-material';

function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleParse = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/parse', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('parsedData', JSON.stringify(response.data));
            router.push('/results');
        } catch (error) {
            setError('Ошибка при парсинге данных. Пожалуйста, попробуйте снова.');
            console.error('Parse error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Высокая скорость',
            description: 'Быстрый парсинг и обработка данных'
        },
        {
            icon: <Analytics sx={{ fontSize: 40, color: 'secondary.main' }} />,
            title: 'Аналитика',
            description: 'Детальная статистика и аналитика данных'
        },
        {
            icon: <Security sx={{ fontSize: 40, color: 'success.main' }} />,
            title: 'Безопасность',
            description: 'Защита данных и конфиденциальность'
        },
        {
            icon: <DataArray sx={{ fontSize: 40, color: 'info.main' }} />,
            title: 'Экспорт',
            description: 'Экспорт в Excel и другие форматы'
        }
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 8,
                px: 2,
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container maxWidth="lg">
                {/* Главная карточка */}
                <Fade in timeout={800}>
                    <Card
                        elevation={8}
                        sx={{
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
                            {/* Заголовок */}
                            <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        backgroundClip: 'text',
                                        textFillColor: 'transparent',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                    }}
                                >
                                    Панель управления
                                </Typography>

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ 
                                        maxWidth: 600, 
                                        mx: 'auto', 
                                        lineHeight: 1.6,
                                        fontSize: { xs: '1rem', sm: '1.1rem' }
                                    }}
                                >
                                    Профессиональная платформа для анализа и обработки данных.
                                    Начните работу с парсингом информации прямо сейчас.
                                </Typography>
                            </Box>

                            {/* Кнопка запуска */}
                            <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    onClick={handleParse}
                                    disabled={isLoading}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
                                    sx={{
                                        borderRadius: 3,
                                        px: { xs: 4, sm: 6 },
                                        py: { xs: 1.5, sm: 2 },
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                        fontWeight: 'bold',
                                        textTransform: 'none',
                                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {isLoading ? 'Идет парсинг...' : 'Начать парсинг'}
                                </Button>

                                {error && (
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mt: 3,
                                            borderRadius: 2,
                                            maxWidth: 400,
                                            mx: 'auto'
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                )}
                            </Box>

                            {/* Особенности */}
                            <Box sx={{ mt: { xs: 6, sm: 8 } }}>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    textAlign="center"
                                    gutterBottom
                                    sx={{ 
                                        fontWeight: '600', 
                                        color: 'primary.main', 
                                        mb: 4,
                                        fontSize: { xs: '1.5rem', sm: '2rem' }
                                    }}
                                >
                                    Возможности платформы
                                </Typography>

                                <Grid 
                                    container 
                                    spacing={3} 
                                    justifyContent="center"
                                >
                                    {features.map((feature, index) => (
                                        <Grid 
                                            item 
                                            xs={12} 
                                            sm={6} 
                                            md={3} 
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 3,
                                                    textAlign: 'center',
                                                    borderRadius: 3,
                                                    width: '100%',
                                                    maxWidth: 280,
                                                    minHeight: 200,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)'
                                                    }
                                                }}
                                            >
                                                <Box>
                                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                                        {feature.icon}
                                                    </Box>
                                                    <Typography
                                                        variant="h6"
                                                        gutterBottom
                                                        sx={{ 
                                                            fontWeight: '600',
                                                            fontSize: { xs: '1rem', sm: '1.1rem' }
                                                        }}
                                                    >
                                                        {feature.title}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ 
                                                        lineHeight: 1.5,
                                                        fontSize: { xs: '0.9rem', sm: '1rem' }
                                                    }}
                                                >
                                                    {feature.description}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </CardContent>

                        {/* Футер */}
                        <CardActions sx={{
                            justifyContent: 'center',
                            py: 3,
                            background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)'
                        }}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ textAlign: 'center' }}
                            >
                                © 2024 DataParser Pro • Ваш надежный партнер в анализе данных
                            </Typography>
                        </CardActions>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
}

export default withAuth(Dashboard);