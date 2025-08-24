import { useRouter } from 'next/router';
import { IconButton, Tooltip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function BackButton() {
    const router = useRouter();

    const handleGoBack = () => {
        // Если мы на dashboard, всегда переходим на register
        if (router.pathname === '/dashboard') {
            router.push('/register');
        } else {
            // Для других страниц используем стандартное поведение
            router.back();
        }
    };

    return (
        <Tooltip title="Назад к регистрации">
            <IconButton
                onClick={handleGoBack}
                sx={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    zIndex: 1000,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
            >
                <ArrowBack />
            </IconButton>
        </Tooltip>
    );
}