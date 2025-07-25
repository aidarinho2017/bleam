import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, LogOut, Plus, BarChart3, Settings, Users } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // For now, we'll extract username from token or use placeholder
    // In a real app, you'd decode the JWT or make an API call
    setUsername('User');
  }, [navigate]);

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been safely logged out.',
    });
    navigate('/');
  };

  const stats = [
    { label: 'Active Bots', value: '3', icon: Bot },
    { label: 'Messages Today', value: '1,247', icon: BarChart3 },
    { label: 'Conversations', value: '89', icon: Users },
    { label: 'Response Rate', value: '98%', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Bleam Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {username}!</p>
              </div>
            </div>

            <Button onClick={handleLogout} variant="outline" className="btn-secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="card-glass p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card-glass p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full btn-primary justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Bot
                </Button>
                <Button variant="outline" className="w-full btn-secondary justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full btn-secondary justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="lg:col-span-2">
            <div className="card-glass p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Dashboard Coming Soon!
              </h2>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're working hard to bring you the most intuitive bot management 
                experience. Your full dashboard will be available soon with:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-md mx-auto">
                {[
                  'Bot creation wizard',
                  'Real-time analytics',
                  'Conversation management',
                  'Performance insights',
                  'Integration settings',
                  'Team collaboration'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;