import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, LogOut, BarChart3, Settings, Brain } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { botPlatformsAPI, TelegramBot, WhatsAppSession } from '@/lib/bot-platforms';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TelegramBotSection } from '@/components/dashboard/TelegramBotSection';
import { WhatsAppBotSection } from '@/components/dashboard/WhatsAppBotSection';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');

  // Bot management state
  const [telegramBots, setTelegramBots] = useState<TelegramBot[]>([]);
  const [whatsappSessions, setWhatsAppSessions] = useState<WhatsAppSession[]>([]);
  const [telegramToken, setTelegramToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsappCreated, setWhatsappCreated] = useState(false);
  const [whatsappRunning, setWhatsappRunning] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // For now, we'll extract username from token or use placeholder
    // In a real app, you'd decode the JWT or make an API call
    setUsername('User');

    // Load connected bots
    loadBots();

    // Initialize WebSocket connection
    initializeWebSocket();

    // Cleanup WebSocket on unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [navigate]);

  const initializeWebSocket = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const socketUrl = `http://localhost:8080/ws?access_token=${encodeURIComponent(token)}`;
    const socket = new SockJS(socketUrl);

    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/user/queue/qr', (message) => {
          const qrCode = message.body;
          console.log('Received QR code:', qrCode);
          setQrCode(qrCode);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('[WS DEBUG]:', str),
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const loadBots = async () => {
    try {
      const [telegramData, whatsappData] = await Promise.all([
        botPlatformsAPI.getTelegramBots(),
        botPlatformsAPI.getWhatsAppSessions()
      ]);
      setTelegramBots(telegramData);
      setWhatsAppSessions(whatsappData);
    } catch (error) {
      console.error('Failed to load bots:', error);
    }
  };

  const handleCreateWhatsApp = async () => {
    setLoading(true);
    try {
      await botPlatformsAPI.connectWhatsApp();

      toast({
        title: 'WhatsApp Bot Created',
        description: 'WhatsApp bot has been created successfully!'
      });

      setWhatsappCreated(true);
      loadBots();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been safely logged out.',
    });
    navigate('/');
  };

  const handleConnectTelegram = async () => {
    if (!telegramToken || !webhookUrl) {
      toast({
        title: 'Error',
        description: 'Please fill in both Bot Token and Webhook URL',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await botPlatformsAPI.connectTelegram({
        apiToken: telegramToken,
        webhookUrl: webhookUrl
      });

      toast({
        title: 'Success',
        description: 'Telegram bot connected successfully!'
      });

      setTelegramToken('');
      setWebhookUrl('');
      loadBots();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  const handleToggleBot = async (type: 'telegram' | 'whatsapp', action: 'start' | 'stop') => {
    try {
      const platformType = type === 'whatsapp' ? 'WHATSAPP' : type;
      if (action === 'start') {
        await botPlatformsAPI.startBot(platformType);
      } else {
        await botPlatformsAPI.stopBot(platformType);
      }
      if (type === 'whatsapp') {
        initializeWebSocket();
      }

      toast({
        title: 'Success',
        description: `${type} bot ${action}ed successfully!`
      });

      loadBots();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

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

        {/* Main Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card-glass p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/bot-knowledge">
                  <Button className="w-full btn-primary justify-start">
                    <Brain className="w-4 h-4 mr-2" />
                    Manage Bot Knowledge
                  </Button>
                </Link>
                <Link to="/session-viewer">
                  <Button variant="outline" className="w-full btn-secondary justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Button variant="outline" className="w-full btn-secondary justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Bot Management */}
          <div className="lg:col-span-2 space-y-8">
            {/* Telegram Section */}
            <TelegramBotSection
              telegramBots={telegramBots}
              telegramToken={telegramToken}
              setTelegramToken={setTelegramToken}
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              loading={loading}
              onConnectTelegram={handleConnectTelegram}
              onToggleBot={handleToggleBot}
            />

            {/* WhatsApp Section */}
            <WhatsAppBotSection
              whatsappSessions={whatsappSessions}
              loading={loading}
              whatsappRunning={whatsappRunning}
              setWhatsappRunning={setWhatsappRunning}
              qrCode={qrCode}
              setQrCode={setQrCode}
              onCreateWhatsApp={handleCreateWhatsApp}
              onToggleBot={handleToggleBot}
            />
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;