// //ShakaPlayer.jsx
// import React, { useEffect, useRef } from 'react';
// import shaka from 'shaka-player';

// const ShakaPlayer = ({ url, drmToken, isEncrypted }) => {
//     const videoRef = useRef(null);
//     const playerRef = useRef(null);

//     useEffect(() => {
//         shaka.polyfill.installAll();

//         const initPlayer = async () => {
//             if (!videoRef.current || !url) return;

//             if (playerRef.current) {
//                 await playerRef.current.destroy();
//             }

//             const player = new shaka.Player();
//             playerRef.current = player;
//             await player.attach(videoRef.current);

//             if (isEncrypted) {
//                 player.configure({
//                     drm: {
//                         servers: {
//                             'com.widevine.alpha': 'https://license-global.pallycon.com/ri/licenseManager.do',
//                             'com.microsoft.playready': 'https://license-global.pallycon.com/ri/licenseManager.do'
//                         },
//                         advanced: {
//                             'com.widevine.alpha': {
//                                 'videoRobustness': ['SW_SECURE_CRYPTO'],
//                                 'audioRobustness': ['SW_SECURE_CRYPTO']
//                             }
//                         }
//                     }
//                 });

//                 player.getNetworkingEngine().registerRequestFilter((type, request) => {
//                     if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
//                         request.headers['pallycon-customdata-v2'] = drmToken;
//                     }
//                 });
//             }

//             try {
//                 await player.load(url);
//                 console.log("SUCCESS: Playing stream!");
//             } catch (error) {
//                 if (error.code === 6001) {
//                     console.error("DRM Error 6001: Connection is NOT secure. Localhost use.");
//                 } else {
//                     console.error('Shaka Load Error:', error.code, error);
//                 }
//             }
//         };

//         initPlayer();

//         return () => {
//             if (playerRef.current) {
//                 playerRef.current.destroy();
//             }
//         };
//     }, [url, drmToken, isEncrypted]);

//     return (
//         <video
//             ref={videoRef}
//             autoPlay
//             style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
//         />
//     );
// };

// export default ShakaPlayer;



//ShakaPlayer.jsx
import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const ShakaPlayer = ({ url, drmToken, isEncrypted }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        shaka.polyfill.installAll();

        const initPlayer = async () => {
            if (!videoRef.current || !url) return;

            // Destroy existing player instance before creating new one
            if (playerRef.current) {
                await playerRef.current.destroy();
            }

            const player = new shaka.Player();
            playerRef.current = player;
            await player.attach(videoRef.current);

            if (isEncrypted && drmToken) {
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

                // Set Pallycon Token in License Request Header
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
                    console.error("DRM Error 6001: Connection is NOT secure (Use HTTPS).");
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
    }, [url, drmToken, isEncrypted]); // Depend on drmToken to update license when channel changes

    return (
        <video
            ref={videoRef}
            autoPlay
            style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
        />
    );
};

export default ShakaPlayer;

