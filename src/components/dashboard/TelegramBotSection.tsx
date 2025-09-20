import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bot, Send, Play, Square } from 'lucide-react';
import { TelegramBot } from '@/lib/bot-platforms';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface TelegramBotSectionProps {
  telegramBots: TelegramBot[];
  telegramRunning: boolean;
  setTelegramRunning: (running: boolean) => void;
  onToggleBot: (type: 'TELEGRAM' | 'whatsapp', action: 'start' | 'stop') => Promise<void>;
  telegramToken: string;
  setTelegramToken: (value: string) => void;
}

export const TelegramBotSection = ({
  telegramBots,
  telegramRunning,
  setTelegramRunning,
  onToggleBot,
  telegramToken,
  setTelegramToken,
}: TelegramBotSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="card-glass p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-blue-500/20 mr-3">
          <Send className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{t('telegramBots')}</h2>
      </div>

      <div className="bg-card/30 rounded-lg p-4 ">
        <div className="space-y-2">
          <Label htmlFor="telegram-token">{t('telegramBotToken')}</Label>
          <Input
              id="telegram-token"
              placeholder={t('enterBotToken')}
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              disabled={telegramRunning}
              className="font-mono text-sm"
              style={{ fontSize: '13px', letterSpacing: '0.025em' }}
          />
          {telegramRunning && (
            <p className="text-xs text-muted-foreground">
              {t('tokenCannotChange')}
            </p>
          )}
        </div>
      </div>


      {/* Telegram Bot Control */}
      <div className="bg-card/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground">{t('botStatus')}</span>
            <Switch
              checked={telegramRunning}
              onCheckedChange={async (checked) => {
                setTelegramRunning(checked);
                await onToggleBot('TELEGRAM', checked ? 'start' : 'stop');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
