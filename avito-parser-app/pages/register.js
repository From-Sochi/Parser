import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const onSubmit = async (data) => {
        try {
            // Проверяем совпадение паролей
            if (data.password !== data.confirmPassword) {
                alert('Passwords do not match');
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
            alert('Registration failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Full Name"
                />
                {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}

                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                        }
                    })}
                    placeholder="Email"
                />
                {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

                <input
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                    })}
                    type="password"
                    placeholder="Password"
                />
                {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}

                <input
                    {...register('confirmPassword', {
                        required: 'Please confirm your password'
                    })}
                    type="password"
                    placeholder="Confirm Password"
                />
                {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}

                <button type="submit">Register</button>
            </form>

            <p style={{ marginTop: '20px' }}>
                Already have an account? <Link href="/login">Login here</Link>
            </p>
        </div>
    );
}