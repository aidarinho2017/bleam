import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bot, LogOut, Plus, BarChart3, Settings, Users, Send, MessageSquare, QrCode, Play, Square, Brain } from 'lucide-react';
import QRCode from 'react-qr-code';
import { authAPI } from '@/lib/auth';
import { botPlatformsAPI, TelegramBot, WhatsAppSession } from '@/lib/bot-platforms';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  
  // Bot management state
  const [telegramBots, setTelegramBots] = useState<TelegramBot[]>([]);
  const [whatsappSessions, setWhatsAppSessions] = useState<WhatsAppSession[]>([]);
  const [telegramToken, setTelegramToken] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

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
    
    // Setup WebSocket connection for QR codes
    setupWebSocket();
    
    // Cleanup WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [navigate]);

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

  const setupWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws/qr');
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected for QR codes');
      };
      
      ws.onmessage = (event) => {
        try {
          const qrData = JSON.parse(event.data);
          if (qrData.qrCode) {
            setQrCode(qrData.qrCode);
            setShowQrModal(true);
            toast({
              title: 'QR Code Generated',
              description: 'Scan with WhatsApp to connect your bot'
            });
          }
        } catch (error) {
          console.error('Error parsing QR data:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Failed to setup WebSocket:', error);
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

  const handleConnectWhatsApp = async () => {
    setLoading(true);
    try {
      await botPlatformsAPI.connectWhatsApp();
      
      toast({
        title: 'WhatsApp Bot Created',
        description: 'Generating QR code... Please wait.'
      });
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
      if (action === 'start') {
        await botPlatformsAPI.startBot(type);
      } else {
        await botPlatformsAPI.stopBot(type);
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
                              {bot.name || `Bot ${bot.token.slice(0, 10)}...`}
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
                <h3 className="text-sm font-medium text-foreground mb-3">Connect New WhatsApp Bot</h3>
                <Button 
                  onClick={handleConnectWhatsApp}
                  disabled={loading}
                  className="btn-primary mb-4"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  {loading ? 'Generating QR...' : 'Generate QR Code'}
                </Button>

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
                              {session.nickname || `Session ${session.id.slice(0, 8)}...`}
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

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="card-glass max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center">Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCode && (
              <div className="p-4 bg-white rounded-lg glow-effect">
                <QRCode value={qrCode} size={200} />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              Open WhatsApp on your phone and scan this QR code to connect your bot
            </p>
            <Button 
              onClick={() => setShowQrModal(false)}
              variant="outline"
              className="btn-secondary"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;