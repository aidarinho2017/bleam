import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
}

const AdminUsers = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/login');
            return;
        }
        setIsAuthenticated(true);
        fetchUsers(token);
    }, [navigate]);

    const fetchUsers = async (token: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const changeRole = async (userId: number) => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/changeRole/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to change role');
            }

            const message = await response.text();
            alert(message);

            // Refresh users after role change
            fetchUsers(token);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (!isAuthenticated) return null;
    if (loading) return <p className="p-6">Loading users...</p>;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Admin Panel – Manage User Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            <div className="space-y-4">
                                {users.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between border p-3 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <p className="text-xs">Role: <span className="font-semibold">{user.role}</span></p>
                                        </div>
                                        <Button onClick={() => changeRole(user.id)}>
                                            Change Role
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminUsers;
