import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Admin = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                navigate('/login');
                return;
            }
            setIsAuthenticated(true);
        };

        checkAuth();
    }, [navigate]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Admin functionality will be implemented here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;