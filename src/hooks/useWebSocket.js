import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (socketUrl, token, subscriptionPath, callback) => {
    console.log('🚀 ~ useWebSocket ~ token:', token)
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS(socketUrl);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log("WebSocket connected!");
                setIsConnected(true);

                // Subscribe to the specified path
                stompClient.subscribe(subscriptionPath, (msg) => {
                    if (msg.body) {
                        const data = JSON.parse(msg.body);
                        console.log('🚀 ~ stompClient.subscribe ~ data:', data)
                        callback(data);
                    }
                });
            },
            onDisconnect: () => {
                console.log("WebSocket disconnected!");
                setIsConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, []);

    return { isConnected, client };
};
