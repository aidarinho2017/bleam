import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const QrTestPage = () => {
    const navigate = useNavigate();
    const [qrCode, setQrCode] = useState<string>('');
    const stompClientRef = useRef<Client | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/login');
            return;
        }

        setQrCode('');
        initializeWebSocket(token);

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [navigate]);

    const initializeWebSocket = (token: string) => {
        setConnectionStatus('connecting');

        const socketUrl = `http://localhost:8080/ws?access_token=${encodeURIComponent(token)}`;
        const socket = new SockJS(socketUrl);

        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnectionStatus('connected');

                stompClient.subscribe('/user/queue/qr', (message) => {
                    setQrCode(message.body);
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
            },
            onDisconnect: () => {
                setConnectionStatus('disconnected');
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('[WS DEBUG]:', str),
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    };

    return (
        <div className="p-4">
            <h2 className="mb-4">WebSocket QR Code Test</h2>
            <p>Status: <strong>{connectionStatus}</strong></p>

            {qrCode ? (
                <div className="mt-6 p-4 bg-background rounded-lg border border-border max-w-xs mx-auto">
                    <h4 className="text-sm font-medium text-foreground mb-3 text-center">Scan QR Code to Connect WhatsApp</h4>
                    <div className="flex justify-center">
                        <QRCodeCanvas
                            value={qrCode}
                            size={100} // Should match container size
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Open WhatsApp on your phone and scan this QR code to connect your account
                    </p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground mt-2 text-center">QR-код ещё не получен...</p>
            )}
        </div>
    );
};

export default QrTestPage;