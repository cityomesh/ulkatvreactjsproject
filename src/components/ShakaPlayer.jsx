import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const ShakaPlayer = ({ url, drmToken, isEncrypted }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        // 1. Install polyfills for browser compatibility
        shaka.polyfill.installAll();

        const initPlayer = async () => {
            if (!videoRef.current || !url) return;

            // 2. Destroy old instance if exists (Prevents Error 7000)
            if (playerRef.current) {
                try {
                    await playerRef.current.destroy();
                } catch (e) {
                    console.error("Cleanup error:", e);
                }
            }

            // 3. Create and attach player
            const player = new shaka.Player();
            playerRef.current = player;
            await player.attach(videoRef.current);

            // 4. DRM Configuration (v4.16+ compliant)
            if (isEncrypted) {
                player.configure({
                    drm: {
                        servers: {
                            'com.widevine.alpha': 'https://license-global.pallycon.com/ri/licenseManager.do',
                            'com.microsoft.playready': 'https://license-global.pallycon.com/ri/licenseManager.do'
                        },
                        advanced: {
                            'com.widevine.alpha': {
                                // Arrays required for newer Shaka versions
                                'videoRobustness': ['SW_SECURE_CRYPTO'],
                                'audioRobustness': ['SW_SECURE_CRYPTO']
                            },
                            'com.microsoft.playready': {
                                'videoRobustness': ['sw']
                            }
                        }
                    }
                });

                // 5. Add Auth Token to License Header
                player.getNetworkingEngine().registerRequestFilter((type, request) => {
                    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                        request.headers['pallycon-customdata-v2'] = drmToken;
                    }
                });
            }

            // 6. Error Listener
            player.addEventListener('error', (event) => {
                const error = event.detail;
                console.error('Shaka Error:', error.code, error.message);
            });

            // 7. Load stream
            try {
                await player.load(url);
                console.log('Stream loaded successfully!');
            } catch (error) {
                if (error.code === 6001) {
                    console.error("DRM Error 6001: Ensure you are on HTTPS.");
                } else {
                    console.error('Load Error:', error.code, error);
                }
            }
        };

        // Check if browser is capable
        if (shaka.Player.isBrowserSupported()) {
            initPlayer();
        } else {
            console.error('Browser does not support Shaka Player.');
        }

        // 8. Final Cleanup on unmount
        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [url, drmToken, isEncrypted]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            controls={false} // Custom TV UI handle chestundi
            style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#000',
                objectFit: 'contain' 
            }}
        />
    );
};

export default ShakaPlayer;