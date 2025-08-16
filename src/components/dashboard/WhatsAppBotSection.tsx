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
  qrTick: number;
  setQrCode: (qr: string) => void;
  onToggleBot: (type: 'TELEGRAM' | 'whatsapp', action: 'start' | 'stop') => Promise<void>;
  waStatus: 'CONNECTED' | 'DISCONNECTED' | '';
}

export const WhatsAppBotSection = ({
                                     whatsappSessions,
                                     loading,
                                     whatsappRunning,
                                     setWhatsappRunning,
                                     qrCode,
                                     qrTick,
                                     setQrCode,
                                     onToggleBot,
                                     waStatus
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
          <h3 className="text-sm font-medium text-foreground mb-3">If QR is not shown, wait for 20-30 seconds</h3>

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
            </div>
          </div>

          {/* QR Code Display - Show when bot is running and QR is available */}
          {whatsappRunning && qrCode && (
              <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                <h4 className="text-sm font-medium text-foreground mb-3">Scan QR Code to Connect WhatsApp</h4>
                <div className="flex justify-center">
                  <QRCodeCanvas
                      key={`${qrTick}-${qrCode}`}
                      value={qrCode}
                      size={100}
                      style={{ height: 'auto', maxWidth: '300px', width: '300px' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Open WhatsApp on your phone and scan this QR code to connect your account
                </p>
              </div>
          )}
        </div>
      </div>
  );
};