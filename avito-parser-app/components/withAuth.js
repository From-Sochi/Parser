import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
            } else {
                setIsAuthenticated(true);
            }
        }, [router]);

        if (!isAuthenticated) {
            return <div>Loading...</div>; // или спиннер загрузки
        }

        return <Component {...props} />;
    };
}