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
    Link as MuiLink,
    Alert
} from '@mui/material';

export default function Register() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const router = useRouter();
    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            // Проверяем совпадение паролей
            if (data.password !== data.confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            const response = await axios.post('/api/auth/register', {
                email: data.email,
                password: data.password,
                name: data.name
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (error) {
            alert('Ошибка регистрации: ' + (error.response?.data?.error || error.message));
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
                        Создать аккаунт
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            {...register('name', { required: 'Имя обязательно' })}
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Полное имя"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('email', {
                                required: 'Email обязателен',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Некорректный email адрес'
                                }
                            })}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('password', {
                                required: 'Пароль обязателен',
                                minLength: {
                                    value: 6,
                                    message: 'Пароль должен содержать минимум 6 символов'
                                }
                            })}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Пароль"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            {...register('confirmPassword', {
                                required: 'Подтвердите пароль',
                                validate: value => value === password || 'Пароли не совпадают'
                            })}
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Подтверждение пароля"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            variant="outlined"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
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
                            Зарегистрироваться
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2">
                                Уже есть аккаунт?{' '}
                                <MuiLink
                                    component={Link}
                                    href="/login"
                                    sx={{
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Войдите здесь
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}