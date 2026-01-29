//ShakaPlayerNew.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import shaka from 'shaka-player';
import { getPallyTokenFromNetwork } from './api.js';

const ShakaPlayerNew = ({ stream_url, encryption_url }) => {
    
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const filterFnRef = useRef(null);
    const errorListenerRef = useRef(null);
    const hideTimerRef = useRef(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState('');

    const showError = useCallback((msg) => {
        setOverlayMessage(String(msg || 'Playback error'));
        setOverlayVisible(true);
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }
        hideTimerRef.current = setTimeout(() => {
            setOverlayVisible(false);
            setOverlayMessage('');
        }, 10000);
    }, []);

    const Overlay = ({ visible, message }) => (
        visible ? (
            <div style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(110, 6, 6, 0.95)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                maxWidth: '280px',
                pointerEvents: 'none'
            }}>
                {message}
            </div>
        ) : null
    );

    const basicMessageForCode = (code) => {
        if (code === 6001) return 'Connection not secure';
        return 'Playback error';
    };

    useEffect(() => {
        shaka.polyfill.installAll();

        const initPlayer = async () => {
            if (!videoRef.current || !stream_url) return;

            // Destroy existing player instance before creating new one
            if (playerRef.current) {
                try {
                    const netPrev = playerRef.current.getNetworkingEngine();
                    if (netPrev) {
                        netPrev.clearAllRequestFilters();
                        netPrev.clearAllResponseFilters();
                    }
                    if (errorListenerRef.current) {
                        playerRef.current.removeEventListener('error', errorListenerRef.current);
                        errorListenerRef.current = null;
                    }
                } catch {}
                await playerRef.current.destroy();
            }

            const player = new shaka.Player(videoRef.current);
            playerRef.current = player;

            player.configure('streaming.bufferingGoal', 15);
            player.configure('streaming.rebufferingGoal', 0.01);
            player.configure('streaming.retryParameters.timeout', 30000);
            player.configure('streaming.retryParameters.stallTimeout', 5000);
            player.configure('streaming.retryParameters.connectionTimeout', 10000);
            player.configure('streaming.retryParameters.maxAttempts', 2);
            player.configure('streaming.retryParameters.baseDelay', 1000);
            player.configure('streaming.retryParameters.backoffFactor', 2);
            player.configure('streaming.retryParameters.fuzzFactor', 0.5);
            player.configure('streaming.lowLatencyMode', false);
            player.configure('streaming.bufferBehind', 30);
            player.configure('streaming.evictionGoal', 1);
            player.configure('streaming.stallEnabled', true);
            player.configure('streaming.stallThreshold', 1.5);
            player.configure('streaming.stallSkip', 0.1);
            player.configure('streaming.updateIntervalSeconds', 0.5);
            player.configure('streaming.clearDecodingCache', true);
            player.configure('manifest.dash.autoCorrectDrift', true);
            player.configure('manifest.retryParameters.baseDelay', 100);
            player.configure('drm.retryParameters.baseDelay', 100);
            player.configure('drm.preferredKeySystems', ['com.widevine.alpha']);

            let licenseToken = '';
            if (encryption_url) {
                try {
                    const res = await getPallyTokenFromNetwork(encryption_url);
                    const base64Token = res?.response_object?.[0]?.base64Token || '';
                    const decoded = base64Token ? atob(base64Token) : '';
                    try {
                        const parsed = decoded ? JSON.parse(decoded) : null;
                        licenseToken = parsed?.token || decoded || '';
                    } catch {
                        licenseToken = decoded || base64Token || '';
                    }
                } catch (e) {
                    const code = e && e.code ? e.code : null;
                    const msg = code ? `Error ${code}: DRM error` : 'DRM error';
                    showError(msg);
                }
            }

            if (licenseToken) {
                console.log("license token exists:", licenseToken);
                player.configure('drm.servers', {
                    'com.widevine.alpha': 'https://license.pallycon.com/ri/licenseManager.do'
                });
                player.configure('drm.defaultAudioRobustnessForWidevine', 'SW_SECURE_CRYPTO');
                player.configure('drm.defaultVideoRobustnessForWidevine', 'SW_SECURE_DECODE');

                const net = player.getNetworkingEngine();
                if (net) {
                    filterFnRef.current = (type, request) => {
                        if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                            request.headers['pallycon-customdata-v2'] = licenseToken;
                        }
                    };
                    net.registerRequestFilter(filterFnRef.current);
                }
            }

            errorListenerRef.current = (evt) => {
                const code = evt && evt.detail && evt.detail.code ? evt.detail.code : null;
                const msg = code ? `Error ${code}: ${basicMessageForCode(code)}` : 'Playback error';
                showError(msg);
            };
            player.addEventListener('error', errorListenerRef.current);

            try {
                await player.load(stream_url);
                console.log("SUCCESS: Playing stream!");
            } catch (error) {
                const code = error && error.code ? error.code : null;
                const msg = code ? `Error ${code}: ${basicMessageForCode(code)}` : 'Load error';
                showError(msg);
            }
        };

        initPlayer();

        return () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
            if (playerRef.current) {
                try {
                    const net = playerRef.current.getNetworkingEngine();
                    if (net) {
                        if (filterFnRef.current) {
                            net.unregisterRequestFilter(filterFnRef.current);
                            filterFnRef.current = null;
                        }
                        net.clearAllResponseFilters();
                    }
                    if (errorListenerRef.current) {
                        playerRef.current.removeEventListener('error', errorListenerRef.current);
                        errorListenerRef.current = null;
                    }
                } catch {}
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [stream_url, encryption_url]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video
                ref={videoRef}
                autoPlay
                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
            />
            <Overlay visible={overlayVisible} message={overlayMessage} />
        </div>
    );
};

export default ShakaPlayerNew;
