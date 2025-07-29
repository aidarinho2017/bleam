import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';
import { authAPI } from '@/lib/auth';
import { sessionsAPI, Platform, Session, Message } from '@/lib/sessions';
import { PlatformList } from '@/components/sessions/PlatformList';
import { SessionList } from '@/components/sessions/SessionList';
import { MessageViewer } from '@/components/sessions/MessageViewer';
import { useToast } from '@/hooks/use-toast';

type ViewState = 'platforms' | 'sessions' | 'messages';

const SessionViewer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [viewState, setViewState] = useState<ViewState>('platforms');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadPlatforms();
  }, [navigate]);

  const loadPlatforms = async () => {
    setLoading(true);
    try {
      const data = await sessionsAPI.getPlatforms();
      setPlatforms(data);
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

  const loadSessions = async (platformType: string) => {
    setLoading(true);
    try {
      const data = await sessionsAPI.getSessions(platformType);
      setSessions(data);
      setSelectedPlatform(platformType);
      setViewState('sessions');
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

  const loadMessages = async (sessionId: string) => {
    setLoading(true);
    try {
      const data = await sessionsAPI.getMessages(sessionId);
      setMessages(data);
      setSelectedSession(sessionId);
      setViewState('messages');
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

  const handleBackToPlatforms = () => {
    setViewState('platforms');
    setSessions([]);
    setSelectedPlatform('');
  };

  const handleBackToSessions = () => {
    setViewState('sessions');
    setMessages([]);
    setSelectedSession('');
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
                <h1 className="text-xl font-bold text-foreground">Session Analytics</h1>
                <p className="text-sm text-muted-foreground">View bot conversations and messages</p>
              </div>
            </div>

            <Button onClick={() => navigate('/dashboard')} variant="outline" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading...</p>
          </div>
        )}

        {!loading && viewState === 'platforms' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Select Platform</h2>
            <PlatformList platforms={platforms} onPlatformClick={loadSessions} />
          </div>
        )}

        {!loading && viewState === 'sessions' && (
          <SessionList
            sessions={sessions}
            platformType={selectedPlatform}
            onSessionClick={loadMessages}
            onBack={handleBackToPlatforms}
          />
        )}

        {!loading && viewState === 'messages' && (
          <MessageViewer
            messages={messages}
            sessionId={selectedSession}
            onBack={handleBackToSessions}
          />
        )}
      </main>
    </div>
  );
};

export default SessionViewer;