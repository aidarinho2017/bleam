import { ArrowLeft, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Session } from '@/lib/sessions';

interface SessionListProps {
  sessions: Session[];
  platformType: string;
  onSessionClick: (sessionId: string) => void;
  onBack: () => void;
}

export const SessionList = ({ sessions, platformType, onSessionClick, onBack }: SessionListProps) => {
  const formatLastMessage = (timestamp?: string) => {
    if (!timestamp) return 'No messages';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Platforms
        </Button>
        <h2 className="text-2xl font-bold text-foreground">{platformType} Sessions</h2>
      </div>

      {sessions.length === 0 ? (
        <div className="card-glass p-8 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Sessions Found</h3>
          <p className="text-muted-foreground">No active sessions for this platform yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              onClick={() => onSessionClick(session.sessionId)}
              className="card-glass p-4 cursor-pointer transition-all hover:scale-[1.02] hover:bg-card/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {session.nickname || `Session ${session.sessionId.slice(0, 8)}...`}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Last message: {formatLastMessage(session.lastMessageAt)}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={session.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};