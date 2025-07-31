import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bot, LogOut, BarChart3, Settings, Send, MessageSquare, Play, Square, Brain } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { botPlatformsAPI, TelegramBot, WhatsAppSession } from '@/lib/bot-platforms';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');


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
    loadBots()
    
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
    setConnectionStatus('connecting');
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected to WebSocket:', frame);
        setConnectionStatus('connected');

        stompClient.subscribe('/user/queue/qr', (message) => {
          console.log("Message from backend:", message.body);
          const qrCode = message.body;
          console.log("QR message received:", message.body);
          setQrCode(qrCode);
        });
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected');
        console.log('Disconnected from WebSocket');
      },
      // Add debug logging
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
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
            <div className="card-glass p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
                  <Send className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Telegram Bots</h2>
              </div>

              {/* Telegram Connection Form */}
              <div className="bg-card/30 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">Connect New Telegram Bot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Bot Token"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    className="input-field"
                  />
                  <Input
                    placeholder="Webhook URL"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="input-field"
                  />
                </div>
                <Button 
                  onClick={handleConnectTelegram}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Connecting...' : 'Connect Telegram Bot'}
                </Button>
              </div>

              {/* Connected Telegram Bots */}
              {telegramBots.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Connected Bots</h3>
                  <div className="grid gap-3">
                    {telegramBots.map((bot) => (
                      <div key={bot.id} className="bg-card/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Bot className="w-4 h-4 text-blue-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {bot.name || `Bot ${bot.token?.slice(0, 10) || 'Unknown'}...`}
                            </p>
                            <Badge variant={bot.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                              {bot.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {bot.status === 'INACTIVE' ? (
                            <Button
                              size="sm"
                              onClick={() => handleToggleBot('telegram', 'start')}
                              className="btn-primary"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleBot('telegram', 'stop')}
                              className="btn-secondary"
                            >
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Section */}
            <div className="card-glass p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-green-500/20 mr-3">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">WhatsApp Bots</h2>
              </div>

              {/* WhatsApp Connection */}
              <div className="bg-card/30 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">WhatsApp Bot Management</h3>
                
                {/* Create WhatsApp Bot - Always visible */}
                <Button 
                  onClick={handleCreateWhatsApp}
                  disabled={loading}
                  className="btn-primary mb-4"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {loading ? 'Creating Bot...' : 'Create WhatsApp Bot'}
                </Button>
                
                {/* Bot Status Switch - Always visible */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-foreground">Bot Status</span>
                    <Switch
                      checked={whatsappRunning}
                      onCheckedChange={async (checked) => {
                        setWhatsappRunning(checked);
                        await handleToggleBot('whatsapp', checked ? 'start' : 'stop');
                        // Clear QR code when stopping
                        if (!checked) {
                          setQrCode('');
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {whatsappRunning ? 'Running' : 'Stopped'}
                    </span>
                  </div>
                </div>

                {/* QR Code Display - Show when bot is running and QR is available */}
                {whatsappRunning && qrCode && (
                  <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-foreground mb-3">Scan QR Code to Connect WhatsApp</h4>
                    <div className="flex justify-center">
                      <QRCode 
                        value={qrCode} 
                        size={200}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Open WhatsApp on your phone and scan this QR code to connect your account
                    </p>
                  </div>
                )}
              </div>

              {/* Connected WhatsApp Sessions */}
              {whatsappSessions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Connected Sessions</h3>
                  <div className="grid gap-3">
                    {whatsappSessions.map((session) => (
                      <div key={session.id} className="bg-card/20 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-green-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {session.nickname || `Session ${session.id?.slice(0, 8) || 'Unknown'}...`}
                            </p>
                            <Badge variant={session.status === 'ACTIVE' ? 'default' : 'secondary'} className="text-xs">
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {session.status === 'INACTIVE' ? (
                            <Button
                              size="sm"
                              onClick={() => handleToggleBot('whatsapp', 'start')}
                              className="btn-primary"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleBot('whatsapp', 'stop')}
                              className="btn-secondary"
                            >
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;