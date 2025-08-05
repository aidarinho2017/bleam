import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Play, Square } from 'lucide-react';
import { WhatsAppSession } from '@/lib/bot-platforms';
import { QRCodeCanvas } from 'qrcode.react';

interface WhatsAppBotSectionProps {
  whatsappSessions: WhatsAppSession[];
  loading: boolean;
  whatsappRunning: boolean;
  setWhatsappRunning: (running: boolean) => void;
  qrCode: string;
  setQrCode: (qr: string) => void;
  onCreateWhatsApp: () => Promise<void>;
  onToggleBot: (type: 'telegram' | 'whatsapp', action: 'start' | 'stop') => Promise<void>;
}

export const WhatsAppBotSection = ({
  whatsappSessions,
  loading,
  whatsappRunning,
  setWhatsappRunning,
  qrCode,
  setQrCode,
  onCreateWhatsApp,
  onToggleBot
}: WhatsAppBotSectionProps) => {
  return (
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
          onClick={onCreateWhatsApp}
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
                await onToggleBot('whatsapp', checked ? 'start' : 'stop');
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
              <QRCodeCanvas
                value={qrCode}
                size={100}
                style={{ height: 'auto', maxWidth: '300', width: '300px' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Open WhatsApp on your phone and scan this QR code to connect your account
            </p>
          </div>
        )}
      </div>

      {/* Connected WhatsApp Sessions */}
      {Array.isArray(whatsappSessions) && whatsappSessions.length > 0 && (
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
                      onClick={() => onToggleBot('whatsapp', 'start')}
                      className="btn-primary"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleBot('whatsapp', 'stop')}
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