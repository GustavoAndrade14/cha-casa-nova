// components/OnlineTracker.tsx
'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function OnlineTracker() {
    const channelRef = useRef<any>(null);

    useEffect(() => {
        let isSubscribed = true;

        const initPresence = async () => {
            try {
                const sessionId = crypto.randomUUID();

                // Criar o canal
                const channel = supabase.channel('site-visitors', {
                    config: {
                        presence: {
                            key: sessionId,
                        },
                    },
                });

                channelRef.current = channel;

                // Inscrever no canal
                channel.subscribe((status) => {
                    console.log('Status do canal:', status);

                    if (status === 'SUBSCRIBED' && isSubscribed) {
                        // Registrar presença
                        channel.track({
                            online_at: new Date().toISOString(),
                            user_agent: navigator.userAgent,
                            url: window.location.pathname,
                        }).catch((err) => {
                            console.error('Erro ao trackear presença:', err);
                        });
                    }
                });

            } catch (error) {
                console.error('Erro ao conectar ao Supabase:', error);
            }
        };

        initPresence();

        // Cleanup
        return () => {
            isSubscribed = false;
            if (channelRef.current) {
                channelRef.current.untrack();
                channelRef.current.unsubscribe();
            }
        };
    }, []);

    // Este componente não renderiza nada visual
    return null;
}