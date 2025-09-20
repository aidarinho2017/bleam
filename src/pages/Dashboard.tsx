import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, LogOut, BarChart3, Settings, Brain, Users } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { API_ENDPOINTS } from '@/config/api';
import { botPlatformsAPI, TelegramBot, WhatsAppSession } from '@/lib/bot-platforms';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { TelegramBotSection } from '@/components/dashboard/TelegramBotSection';
import { WhatsAppBotSection } from '@/components/dashboard/WhatsAppBotSection';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import LanguageSelector from '@/components/ui/language-selector';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [username, setUsername] = useState('');

    // Bot management state
    const [telegramBots, setTelegramBots] = useState<TelegramBot[]>([]);
    const [whatsappSessions, setWhatsAppSessions] = useState<WhatsAppSession[]>([]);
    const [telegramRunning, setTelegramRunning] = useState(false);
    const [telegramToken, setTelegramToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [whatsappRunning, setWhatsappRunning] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');
    const [qrTick, setQrTick] = useState(0);
    const [waStatus, setWaStatus] = useState<'CONNECTED' | 'DISCONNECTED' | ''>('');
    const stompClientRef = useRef<Client | null>(null);

    // AI model selection state
    const [aiModel, setAiModel] = useState<'GEMINI' | 'GPT' | ''>('');
    const [aiSaving, setAiSaving] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        if (!authAPI.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // For now, we'll extract username from token or use placeholder
        // In a real app, you'd decode the JWT or make an API call
        setUsername('User');

        // Restore persisted Telegram token
        const storedTgToken = localStorage.getItem('tg_token');
        if (storedTgToken) {
            setTelegramToken(storedTgToken);
        }
        // QR code is not persisted; it updates frequently via WebSocket

        // Load data from backend
        loadBots();
        loadCurrentAiModel();
        loadPlatformStatuses();

        // Initialize WebSocket connection
        initializeWebSocket();

        // Cleanup WebSocket on unmount
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [navigate]);

    // Persist WhatsApp running state across reloads
    useEffect(() => {
        try {
            localStorage.setItem('wa_running', String(whatsappRunning));
        } catch {}
    }, [whatsappRunning]);

    useEffect(() => {
        try {
            localStorage.setItem('tg_running', String(telegramRunning));
        } catch {}
    }, [telegramRunning]);

    // Persist Telegram token across reloads
    useEffect(() => {
        try {
            if (telegramToken) {
                localStorage.setItem('tg_token', telegramToken);
            }
        } catch {}
    }, [telegramToken]);


    const initializeWebSocket = () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const baseUrl = API_ENDPOINTS.WEBSOCKET;

        // If the app runs over HTTPS but the WS URL is HTTP (insecure), skip to avoid browser SecurityError.
        // This keeps localhost (HTTP) working while preventing errors on hosted HTTPS previews.
        if (window.location.protocol === 'https:' && baseUrl.startsWith('http://')) {
            console.warn('Skipping insecure SockJS connection from HTTPS page. Run locally (http://localhost) to test.');
            return;
        }

        // Pass token in query for backends expecting it at handshake time
        const socketUrl = `${baseUrl}?access_token=${encodeURIComponent(token)}`;
        const socket = new SockJS(socketUrl);

        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/user/queue/qr', (message) => {
                    const qr = message.body;
                    console.log('Received QR code:', qr);
                    setQrCode(qr);
                    setQrTick((prev) => prev + 1);
                });
                // WhatsApp bot status updates
                stompClient.subscribe('/user/queue/wa-status', (message) => {
                    const status = (message.body || '').toUpperCase();
                    console.log('WhatsApp status:', status);
                    if (status === 'CONNECTED' || status === 'DISCONNECTED') {
                        // @ts-ignore
                        setWaStatus(status);
                    }
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

            // Ensure we always set arrays, even if API returns null/undefined
            setTelegramBots(Array.isArray(telegramData) ? telegramData : []);
            setWhatsAppSessions(Array.isArray(whatsappData) ? whatsappData : []);
        } catch (error) {
            console.error('Failed to load bots:', error);
            // Reset to empty arrays on error
            setTelegramBots([]);
            setWhatsAppSessions([]);
        }
    };

    const loadCurrentAiModel = async () => {
        try {
            const currentModel = await botPlatformsAPI.getAiModel();
            setAiModel(currentModel);
        } catch (error) {
            console.error('Failed to load current AI model:', error);
        }
    };

    const loadPlatformStatuses = async () => {
        try {
            const [telegramStatus, whatsappStatus] = await Promise.all([
                botPlatformsAPI.getPlatformStatus('TELEGRAM'),
                botPlatformsAPI.getPlatformStatus('WHATSAPP')
            ]);

            setTelegramRunning(telegramStatus === 'ACTIVE');
            setWhatsappRunning(whatsappStatus === 'ACTIVE');
        } catch (error) {
            console.error('Failed to load platform statuses:', error);
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        toast({
            title: t('logoutSuccessTitle'),
            description: t('logoutSuccessDescription'),
        });
        navigate('/');
    };


    const handleToggleBot = async (type: 'TELEGRAM' | 'whatsapp', action: 'start' | 'stop') => {
        try {
            const platformType = type === 'whatsapp' ? 'WHATSAPP' : type;
            if (action === 'start') {
                let data = undefined;
                if (type === 'TELEGRAM') {
                    if (!telegramToken.trim()) {
                        toast({
                            title: t('error'),
                            description: t('enterTelegramToken'),
                            variant: 'destructive'
                        });
                        return;
                    }
                    data = { apiToken: telegramToken };
                }
                await botPlatformsAPI.startBot(platformType, data);
            } else {
                await botPlatformsAPI.stopBot(platformType);
            }

            // Only initialize WebSocket for WhatsApp if start was successful
            if (type === 'whatsapp' && action === 'start') {
                initializeWebSocket();
            }

            toast({
                title: t('success'),
                description: t('botActionSuccess')
            });

            loadBots();
        } catch (error: any) {
            // Reset bot state on any error
            if (type === 'TELEGRAM') {
                setTelegramRunning(false);
            } else if (type === 'whatsapp') {
                setWhatsappRunning(false);
                setQrCode(''); // Clear QR code on error
            }

            // Handle specific error messages
            let errorMessage = error.message || 'An error occurred';

            if (errorMessage.includes('Connection prematurely closed') || errorMessage.includes('Server error')) {
                if (type === 'TELEGRAM') {
                    errorMessage = t('invalidTelegramToken');
                } else {
                    errorMessage = t('failedToStartBot');
                }
            }

            toast({
                title: t('error'),
                description: errorMessage,
                variant: 'destructive'
            });
        }
    };

    // Handle AI model selection
    const handleSelectAiModel = async (value: 'GEMINI' | 'GPT') => {
        setAiSaving(true);
        try {
            await botPlatformsAPI.selectAiModel(value);
            setAiModel(value);
            localStorage.setItem('ai_model_type', value);
            toast({ title: t('aiModelUpdated'), description: t('selectedModel') });
        } catch (error: any) {
            toast({ title: t('error'), description: error.message, variant: 'destructive' });
        } finally {
            setAiSaving(false);
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
                                <h1 className="text-xl font-bold text-foreground">{t('dashboardTitle')}</h1>
                                <p className="text-sm text-muted-foreground">{t('welcomeUser')}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <LanguageSelector />
                            <ThemeToggle />
                            <Button onClick={handleLogout} variant="outline" className="btn-secondary">
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('logout')}
                            </Button>
                        </div>
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
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t('quickActions')}</h2>
                            <div className="space-y-3">
                                <Link to="/bot-knowledge">
                                    <Button variant="outline" className="w-full btn-secondary justify-start">
                                        <Brain className="w-4 h-4 mr-2" />
                                        {t('manageBotKnowledge')}
                                    </Button>
                                </Link>
                                <Link to="/session-viewer">
                                    <Button variant="outline" className="w-full btn-secondary justify-start">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        {t('viewAnalytics')}
                                    </Button>
                                </Link>
                                <Link to="/contacts">
                                    <Button variant="outline" className="w-full btn-secondary justify-start">
                                        <Users className="w-4 h-4 mr-2" />
                                        {t('contactsCrm')}
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full btn-secondary justify-start">
                                    <Settings className="w-4 h-4 mr-2" />
                                    {t('settings')}
                                </Button>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="card-glass p-6 mt-6">
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">{t('aiModel')}</label>
                                <Select value={aiModel} onValueChange={(v) => handleSelectAiModel(v as 'GEMINI' | 'GPT')} disabled={aiSaving}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t('selectModel')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{t('models')}</SelectLabel>
                                            <SelectItem value="GEMINI">{t('gemini')}</SelectItem>
                                            <SelectItem value="GPT">{t('gpt')}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Bot Management */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Telegram Section */}
                        <TelegramBotSection
                            telegramBots={telegramBots}
                            telegramRunning={telegramRunning}
                            setTelegramRunning={setTelegramRunning}
                            onToggleBot={handleToggleBot}
                            telegramToken={telegramToken}
                            setTelegramToken={setTelegramToken}
                        />

                        {/* WhatsApp Section */}
                        <WhatsAppBotSection
                            whatsappSessions={whatsappSessions}
                            loading={loading}
                            whatsappRunning={whatsappRunning}
                            setWhatsappRunning={setWhatsappRunning}
                            qrCode={qrCode}
                            qrTick={qrTick}
                            setQrCode={setQrCode}
                            onToggleBot={handleToggleBot}
                            waStatus={waStatus}
                        />
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Dashboard;