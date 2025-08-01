import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Play, Square } from 'lucide-react';
import { TelegramBot } from '@/lib/bot-platforms';

interface TelegramBotSectionProps {
  telegramBots: TelegramBot[];
  telegramToken: string;
  setTelegramToken: (token: string) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  loading: boolean;
  onConnectTelegram: () => Promise<void>;
  onToggleBot: (type: 'telegram' | 'whatsapp', action: 'start' | 'stop') => Promise<void>;
}

export const TelegramBotSection = ({
  telegramBots,
  telegramToken,
  setTelegramToken,
  webhookUrl,
  setWebhookUrl,
  loading,
  onConnectTelegram,
  onToggleBot
}: TelegramBotSectionProps) => {
  return (
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
          onClick={onConnectTelegram}
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
                      onClick={() => onToggleBot('telegram', 'start')}
                      className="btn-primary"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleBot('telegram', 'stop')}
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
  );
};