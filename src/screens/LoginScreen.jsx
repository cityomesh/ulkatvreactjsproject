// src/screens/LoginScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { loginUser } from '../components/api';
import CreateProfileScreen from './CreateProfileScreen';
import HomeScreen from './HomeScreen';
import Icon from '../components/Icon';
import GlobalInputStyles from '../components/GlobalInputStyles';
import CustomKeyboard from '../components/CustomKeyboard';
import ProfileScreen from './ProfileScreen';
import {
    BG_IMAGE_1,
    BG_IMAGE_2,
    AVATAR_DEFAULT,
    AVATAR_LIST,
    SYMBOL_LAYOUT,
    KEYBOARD_LAYOUT,
    COLOR_FOCUS,
    COLOR_HEADER,
    COLOR_4K
} from '../constants';

const LoginScreen = ({ startAtProfiles = false }) => {
    // --- State Management ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeInput, setActiveInput] = useState('');
    const [isCaps, setIsCaps] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);
    const [focusedId, setFocusedId] = useState('slot-1'); 
    const layout = isSymbol ? SYMBOL_LAYOUT : KEYBOARD_LAYOUT;
    const [focusKey, setFocusKey] = useState('username'); 
    const [kbPos, setKbPos] = useState({ row: 0, col: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(startAtProfiles);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isCreatingProfile, setIsCreatingProfile] = useState(false); 
    
    const [isViewingHome, setIsViewingHome] = useState(false); 
    const [selectedProfile, setSelectedProfile] = useState(''); 

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); 
    const [keyboardTarget, setKeyboardTarget] = useState(''); 
    const keyboardRef = useRef(null); 
    const [profiles, setProfiles] = useState([]); 
    const [bgIndex, setBgIndex] = useState(0);
    const backgrounds = [BG_IMAGE_1, BG_IMAGE_2];
    const DUMMY_MAC_ADDRESS = "00:00:00:00:00:00";
    const DUMMY_FIREBASE_TOKEN = "web_dummy_firebase_token";
    const DUMMY_FIRMWARE_VERSION = "1.0.0_web";
    const DUMMY_APP_ID = "1";
    const DUMMY_IP = "127.0.0.1";

    useEffect(() => {
    const savedUsername = localStorage.getItem('ulka_username');
    const savedPassword = localStorage.getItem('ulka_password');

    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
    }, []);
    

    const profileSlots = [];
        profileSlots.push({ id: 'slot-1', name: username, image: AVATAR_DEFAULT });
        profiles.slice(0, 3).forEach((p, idx) => {
            profileSlots.push({ ...p, id: `slot-${idx + 2}`, image: p.image || AVATAR_LIST[idx] });
        });
        if (profileSlots.length < 4) {
            profileSlots.push({ id: 'slot-add', name: 'Add Profile', isAddButton: true });
        }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isViewingHome) return;

            if (isLoggedIn && !isCreatingProfile) {
                const profileSlotsCount = profiles.length + 1;
                const addProfileExists = profileSlotsCount < 4;
                const totalItems = addProfileExists ? profileSlotsCount + 1 : profileSlotsCount;
                const currentIndex = profileSlots.findIndex(slot => slot.id === focusedId);

                switch (e.key) {
                    case 'ArrowLeft':
                        if (currentIndex > 0) {
                            setFocusedId(profileSlots[currentIndex - 1].id);
                        }
                        break;
                    case 'ArrowRight':
                        if (currentIndex < profileSlots.length - 1) {
                            setFocusedId(profileSlots[currentIndex + 1].id);
                        }
                        break;            
                }
                return; 
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (focusKey === 'password') setFocusKey('username');
                    else if (focusKey === 'login_btn') setFocusKey('password');
                    else if (focusKey === 'keyboard') {
                        if (kbPos.row > 0) {
                            setKbPos(p => ({ ...p, row: p.row - 1 }));
                        } else {
                            setIsKeyboardVisible(false);
                            setFocusKey('login_btn');
                        }
                    }
                    break;

                case 'ArrowDown':
                    if (focusKey === 'username') setFocusKey('password');
                    else if (focusKey === 'password') setFocusKey('login_btn');
                    else if (focusKey === 'login_btn') {
                        setFocusKey('keyboard');
                        setIsKeyboardVisible(true);
                        setKbPos({ row: 0, col: 4 });
                    } 
                    else if (focusKey === 'keyboard') {
                        setKbPos(p => ({
                            ...p,
                            row: Math.min(p.row + 1, layout.length - 1),
                            col: Math.min(p.col, layout[Math.min(p.row + 1, layout.length - 1)].length - 1)
                        }));
                    }
                    break;

                case 'ArrowLeft':
                    if (focusKey === 'keyboard') {
                        setKbPos(p => ({ ...p, col: Math.max(0, p.col - 1) }));
                    }
                    break;

                case 'ArrowRight':
                    if (focusKey === 'keyboard') {
                        setKbPos(p => ({
                            ...p,
                            col: Math.min(p.col + 1, layout[kbPos.row].length - 1)
                        }));
                    }
                    break;

                case 'Enter':
                    handleRemoteEnter();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusKey, kbPos, isKeyboardVisible, isLoggedIn, isViewingHome, focusedId, profiles, isCreatingProfile]);


    const handleRemoteEnter = () => {
    if (focusKey === 'username' || focusKey === 'password') {
        setKeyboardTarget(focusKey);
        setIsKeyboardVisible(true);
        setFocusKey('keyboard');
        return;
    }

    if (focusKey === 'login_btn') {
        handleLogin();
        return;
    }

    if (focusKey === 'keyboard') {
        const key = layout[kbPos.row][kbPos.col];

        if (key === 'CAPS') {
        setIsCaps(p => !p);
        return;
        }

        if (key === '@#$') {
        setIsSymbol(true);
        setKbPos({ row: 0, col: 0 });
        return;
        }

        if (key === 'ABC') {
        setIsSymbol(false);
        setKbPos({ row: 0, col: 0 });
        return;
        }

        if (key === 'BACK') {
        handleKeyboardKeyPress('backspace');
        return;
        }
        if (key === 'ENTER') {

        // 🔹 Username complete
        if (keyboardTarget === 'username') {
            setIsKeyboardVisible(false);   // ✅ keyboard close
            setKeyboardTarget('');
            setFocusKey('password');       // ✅ focus password
            return;
        }

        // 🔹 Password complete
        if (keyboardTarget === 'password') {
            setIsKeyboardVisible(false);   // ✅ keyboard close
            setKeyboardTarget('');
            setFocusKey('login_btn');      // ✅ focus sign in
            return;
        }
        }

        if (key === 'SPACE') {
        handleKeyboardKeyPress(' ');
        return;
        }

        handleKeyboardKeyPress(isCaps ? key.toUpperCase() : key.toLowerCase());
    }
    };

    const handleKeyboardKeyPress = (input) => {
        if (!keyboardTarget) return;
        if (input === 'backspace') {
            if (keyboardTarget === 'username') {
                setUsername((prev) => prev.slice(0, -1));
            } else if (keyboardTarget === 'password') {
                setPassword((prev) => prev.slice(0, -1));
            }
            return;
        }
        if (keyboardTarget === 'username') {
            setUsername((prev) => prev + input);
        } else if (keyboardTarget === 'password') {
            setPassword((prev) => prev + input);
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, 8000);
        
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async () => {
        setIsKeyboardVisible(false);
        setKeyboardTarget('');

        if (username === 'omi' && password === '123') {
            const dummyToken = "DUMMY_TOKEN_OMI";
            localStorage.setItem('ulka_username', username);
            localStorage.setItem('ulka_password', password);
            localStorage.setItem('ulka_token', dummyToken);
            setAccessToken("DUMMY_TOKEN_OMI");
            setIsLoggedIn(true);
            setUsername('omi');
            setProfiles([
                { id: 'p2', name: 'Rajini', image: AVATAR_LIST[0] },
                { id: 'p3', name: 'Vamsi', image: AVATAR_LIST[1] },
            ]);
            setLoading(false);
            return;
        }

        if (loading) return;
        setApiError('');
        setLoading(true);

        try {
            const response = await loginUser(username, password, DUMMY_APP_ID);

            if (response?.status_code === 200 && response.response_object?.[0]?.access_token) {
                const token = response.response_object[0].access_token;
                
                localStorage.setItem('ulka_username', username); 
                localStorage.setItem('ulka_password', password);
                localStorage.setItem('ulka_token', token);
                setAccessToken(token);
                setIsLoggedIn(true); 
                setProfiles([]); 
            } else {
                setApiError(response?.error_description || 'Login failed.');
            }
        } catch (error) {
            setApiError('Network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('ulka_token');
        localStorage.removeItem('ulka_username');
        localStorage.removeItem('ulka_password');
        setIsLoggedIn(false);
        setAccessToken('');
        setProfiles([]);
        setUsername('');
        setPassword('');
    };

    const handleCreateProfile = () => {
        setIsCreatingProfile(true);
    };

    const handleProfileCreated = (newProfile) => {
        setProfiles(prev => [...prev, { ...newProfile, id: `p${prev.length + 2}` }]);
        setIsCreatingProfile(false);
    };

    const handleSelectProfile = (profileName, token) => {
        setSelectedProfile(profileName);
        setIsViewingHome(true);
        if (token) setAccessToken(token);
    };

    if (isViewingHome) {
        return <HomeScreen selectedProfile={selectedProfile} accessToken={accessToken} />;
    }

    if (isCreatingProfile) {
        return <CreateProfileScreen onProfileCreated={handleProfileCreated} />;
    }

    if (isLoggedIn) {
        return (
            <ProfileScreen
                accessToken={accessToken}
                profiles={profiles}
                onCreateProfile={handleCreateProfile}
                onSelectProfile={handleSelectProfile}
                onLogout={handleLogout}
            />
        );
    }

    // Render Login Form
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#000'
        }}>
            <GlobalInputStyles />

            <div style={{
                width: '30%',
                minWidth: '360px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                backgroundColor: 'rgba(0,0,0,0.92)'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        color: COLOR_HEADER,
                        fontWeight: 900,
                        letterSpacing: '2px',
                        lineHeight: 1.5,
                        fontSize: '28px',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        marginBottom: '10%'
                    }}>
                        <div>THE FUTURE OF</div>
                        <div>ENTERTAINMENT</div>
                        <div>IS HERE ↓</div>
                    </div>
                    {apiError && <p style={{ color: '#E87C03', fontSize: '14px', margin: 0, textAlign: 'center' }}>{apiError}</p>}
                    <div style={{ position: 'relative', width: '90%' }}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '90%',
                                padding: '14px 16px',
                                backgroundColor: '#161a1f',
                                border: `3px solid ${focusKey === 'username' ? COLOR_FOCUS : 'rgba(255,255,255,0.15)'}`,
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />    
                    </div>
                    <div style={{ position: 'relative', width: '90%' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '90%',
                                padding: '14px 16px',
                                backgroundColor: '#161a1f',
                                border: `3px solid ${focusKey === 'password' ? COLOR_FOCUS : 'rgba(255,255,255,0.15)'}`,
                                borderRadius: '10px',
                                color: 'white',
                                fontSize: '16px'
                            }}
                        />
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} />
                        </button>
                    </div>
                    <button
                        onClick={handleLogin}
                        style={{
                            width: '90%',
                            padding: '14px',
                            backgroundColor: '#E50914',
                            border: `2px solid ${focusKey === 'login_btn' ? 'white' : 'transparent'}`,
                            borderRadius: '10px',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '16px'
                        }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <a href="#" style={{ color: COLOR_4K, textDecoration: 'underline', fontSize: '18px' }}>Privacy Policy</a>
                        <div style={{ color: COLOR_4K, fontWeight: 700, fontSize: '24px' }}>4K Ultra HD Streaming</div>
                    </div>
                </div>
            </div>

            <div style={{
                width: '70%',
                position: 'relative',
                backgroundImage: `url(${backgrounds[bgIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.35)'
                }}></div>
            </div>

            {isKeyboardVisible && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 100
                }}>
                    <CustomKeyboard
                        layout={layout}
                        isCaps={isCaps}
                        focusedPos={kbPos}
                        isKeyboardFocused={focusKey === 'keyboard'}
                    />
                </div>
            )}
        </div>
    );
};

export default LoginScreen;
