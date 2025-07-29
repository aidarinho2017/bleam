import { MessageSquare, Send } from 'lucide-react';
import { Platform } from '@/lib/sessions';

interface PlatformListProps {
  platforms: Platform[];
  onPlatformClick: (platformType: string) => void;
}

export const PlatformList = ({ platforms, onPlatformClick }: PlatformListProps) => {
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return <MessageSquare className="w-6 h-6 text-green-400" />;
      case 'TELEGRAM':
        return <Send className="w-6 h-6 text-blue-400" />;
      default:
        return <MessageSquare className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getPlatformColor = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return 'bg-green-500/20 hover:bg-green-500/30';
      case 'TELEGRAM':
        return 'bg-blue-500/20 hover:bg-blue-500/30';
      default:
        return 'bg-muted/20 hover:bg-muted/30';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platforms.map((platform) => (
        <div
          key={platform.type}
          onClick={() => onPlatformClick(platform.type)}
          className={`card-glass p-6 cursor-pointer transition-all hover:scale-105 ${getPlatformColor(platform.type)}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-background/20">
              {getPlatformIcon(platform.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">
                {platform.botCount} bot{platform.botCount !== 1 ? 's' : ''} connected
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};