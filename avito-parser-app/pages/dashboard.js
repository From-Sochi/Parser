import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { withAuth } from '../components/withAuth'; // ← ИМПОРТ HOC

function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleParse = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/parse', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('parsedData', JSON.stringify(response.data));
            router.push('/results');
        } catch (error) {
            alert('Parse failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleParse} disabled={isLoading}>
                {isLoading ? 'Parsing...' : 'Start Parsing'}
            </button>
        </div>
    );
}

export default withAuth(Dashboard); // ← ОБЕРТКА В HOC