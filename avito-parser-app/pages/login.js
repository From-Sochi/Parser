import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Button from '@mui/material/Button';


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
            alert('Login failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input {...register('email')} placeholder="Email" />
                <input {...register('password')} type="password" placeholder="Password" />
                <Button variant="contained" color="success" type="submit">Login</Button>
            </form>

            <p style={{ marginTop: '20px' }}>
                Don't have an account? <Link href="/register">Register here</Link>
            </p>
        </div>
    );
}