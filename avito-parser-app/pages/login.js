import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import {
    Box,
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Link as MuiLink
} from '@mui/material';

export default function Login() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('/api/auth/login', data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (error) {
            alert('Ошибка входа: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Вход в систему
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            {...register('email')}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('password')}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 2,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                }
                            }}
                        >
                            Войти
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2">
                                Нет аккаунта?{' '}
                                <MuiLink
                                    component={Link}
                                    href="/register"
                                    sx={{
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Зарегистрируйтесь здесь
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}