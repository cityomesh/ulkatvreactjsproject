// import React, { useEffect, useRef } from 'react';
// import shaka from 'shaka-player';

// const ShakaPlayer = ({ url, drmToken, isEncrypted }) => {
//     const videoRef = useRef(null);
//     const playerRef = useRef(null);

//     useEffect(() => {
//         // 1. Install polyfills for browser compatibility
//         shaka.polyfill.installAll();

//         const initPlayer = async () => {
//             if (!videoRef.current || !url) return;

//             // 2. Clean up existing player instance
//             if (playerRef.current) {
//                 try {
//                     await playerRef.current.destroy();
//                 } catch (e) {
//                     console.error("Error destroying old player", e);
//                 }
//             }

//             // 3. Create new player
//             const player = new shaka.Player();
//             playerRef.current = player;
            
//             // 4. Attach to video element
//             await player.attach(videoRef.current);

//             // 5. DRM Configuration (Only if channel is encrypted)
//             if (isEncrypted) {
//                 player.configure({
//                     drm: {
//                         servers: {
//                             'com.widevine.alpha': 'https://license-global.pallycon.com/ri/licenseManager.do',
//                             'com.microsoft.playready': 'https://license-global.pallycon.com/ri/licenseManager.do'
//                         },
//                         advanced: {
//                             'com.widevine.alpha': {
//                                 'videoRobustness': 'SW_SECURE_CRYPTO',
//                                 'audioRobustness': 'SW_SECURE_CRYPTO'
//                             },
//                             'com.microsoft.playready': {
//                                 'videoRobustness': 'sw'
//                             }
//                         }
//                     }
//                 });

//                 // 6. Filter to add the Pallycon Token to License Requests
//                 player.getNetworkingEngine().registerRequestFilter((type, request) => {
//                     if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
//                         // This header key is specific to Pallycon DRM
//                         request.headers['pallycon-customdata-v2'] = drmToken;
//                         console.log("DRM License Request with Token sent.");
//                     }
//                 });
//             }

//             // 7. Error Listener
//             player.addEventListener('error', (event) => {
//                 const error = event.detail;
//                 console.error('Shaka Error - Code:', error.code, 'Category:', error.category, 'Message:', error.message);
                
//                 if (error.code === 6001) {
//                     console.warn("DRM Error 6001: This usually means you are not on HTTPS or the browser blocks DRM.");
//                 }
//             });

//             // 8. Load the stream
//             try {
//                 await player.load(url);
//                 console.log('Success: Stream loaded and playing!');
//             } catch (error) {
//                 console.error('Load Error:', error.code, error);
//             }
//         };

//         if (shaka.Player.isBrowserSupported()) {
//             initPlayer();
//         } else {
//             console.error('Browser not supported for Shaka Player');
//         }

//         // Cleanup on unmount
//         return () => {
//             if (playerRef.current) {
//                 playerRef.current.destroy();
//                 playerRef.current = null;
//             }
//         };
//     }, [url, drmToken, isEncrypted]);

//     return (
//         <video
//             ref={videoRef}
//             autoPlay
//             controls={false} // TV UI kabatti controls false pettali
//             style={{ 
//                 width: '100%', 
//                 height: '100%', 
//                 backgroundColor: '#000', 
//                 objectFit: 'contain' 
//             }}
//         />
//     );
// };

// export default ShakaPlayer;

import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const ShakaPlayer = ({ url, drmToken, isEncrypted }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        shaka.polyfill.installAll();

        const initPlayer = async () => {
            if (!videoRef.current || !url) return;

            // Destroy old instance to avoid Error 7000 (Load Interrupted)
            if (playerRef.current) {
                await playerRef.current.destroy();
            }

            const player = new shaka.Player();
            playerRef.current = player;
            await player.attach(videoRef.current);

            if (isEncrypted) {
                player.configure({
                    drm: {
                        servers: {
                            'com.widevine.alpha': 'https://license-global.pallycon.com/ri/licenseManager.do',
                            'com.microsoft.playready': 'https://license-global.pallycon.com/ri/licenseManager.do'
                        },
                        advanced: {
                            'com.widevine.alpha': {
                                'videoRobustness': ['SW_SECURE_CRYPTO'],
                                'audioRobustness': ['SW_SECURE_CRYPTO']
                            }
                        }
                    }
                });

                player.getNetworkingEngine().registerRequestFilter((type, request) => {
                    if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                        request.headers['pallycon-customdata-v2'] = drmToken;
                    }
                });
            }

            try {
                await player.load(url);
                console.log("SUCCESS: Playing stream!");
            } catch (error) {
                if (error.code === 6001) {
                    console.error("DRM Error 6001: Connection is NOT secure. Localhost use cheyyandi or Chrome flags enable cheyyandi.");
                } else {
                    console.error('Shaka Load Error:', error.code, error);
                }
            }
        };

        initPlayer();

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [url, drmToken, isEncrypted]);

    return (
        <video
            ref={videoRef}
            autoPlay
            style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
        />
    );
};

export default ShakaPlayer;