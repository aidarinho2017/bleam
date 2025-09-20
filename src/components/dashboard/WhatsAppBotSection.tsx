import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Play, Square } from 'lucide-react';
import { WhatsAppSession } from '@/lib/bot-platforms';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
      <div className="card-glass p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg bg-green-500/20 mr-3">
            <MessageSquare className="w-5 h-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t('whatsappBots')}</h2>
        </div>

        {/* WhatsApp Connection */}
        <div className="bg-card/30 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">{t('qrNotShown')}</h3>

          {/* Bot Status Switch - Always visible */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">{t('botStatus')}</span>
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

          {/* WhatsApp Status Display */}
          {whatsappRunning && (
              <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                {waStatus === 'CONNECTED' ? (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-foreground mb-3">{t('whatsappStatus')}</h4>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-600 font-medium">{t('connected')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('whatsappConnected')}
                      </p>
                    </div>
                ) : qrCode ? (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">{t('scanQrCode')}</h4>
                      <div className="flex justify-center">
                        <QRCodeCanvas
                            key={`${qrTick}-${qrCode}`}
                            value={qrCode}
                            size={100}
                            style={{ height: 'auto', maxWidth: '300px', width: '300px' }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {t('openWhatsapp')}
                      </p>
                    </div>
                ) : (
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-foreground mb-3">{t('connecting')}</h4>
                      <p className="text-xs text-muted-foreground">
                        {t('waitingQr')}
                      </p>
                    </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
};