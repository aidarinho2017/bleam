import { ArrowLeft, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/lib/sessions';

interface MessageViewerProps {
  messages: Message[];
  sessionId: number | null;
  onBack: () => void;
}

export const MessageViewer = ({ messages, sessionId, onBack }: MessageViewerProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sessions
        </Button>
        <h2 className="text-2xl font-bold text-foreground">Session {sessionId}</h2>
      </div>

      <div className="card-glass p-6 max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Messages</h3>
            <p className="text-muted-foreground">This session doesn't have any messages yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'BOT' ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  message.sender === 'BOT' 
                    ? 'bg-primary/20' 
                    : 'bg-accent/20'
                }`}>
                  {message.sender === 'BOT' ? (
                    <Bot className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div className={`max-w-[70%] ${
                  message.sender === 'BOT' ? 'text-left' : 'text-right'
                }`}>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'BOT'
                      ? 'bg-card/30 text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};