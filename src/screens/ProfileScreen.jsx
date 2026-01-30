import React, { useState, useEffect } from 'react';
import {
    LOGO_ULKA,
    AVATAR_DEFAULT,
    AVATAR_LIST,
    COLOR_BLACK,
    COLOR_DARK_GREY,
    COLOR_FOCUS,
    COLOR_WHITE,
    BG_IMAGE_1,
    BG_IMAGE_2
} from '../constants';

const ProfileScreen = ({ accessToken, onCreateProfile, profiles, onSelectProfile, onLogout }) => {
    const storedUsername = localStorage.getItem('ulka_username') || "User";
    
    const MAX_PROFILES = 4;
    const profileSlots = [];
    
    const [bgIndex, setBgIndex] = useState(0);
    const backgrounds = [BG_IMAGE_1, BG_IMAGE_2];

    profileSlots.push({ 
        id: 'slot-1', 
        name: storedUsername,
        image: AVATAR_DEFAULT, 
        isFixed: true 
    });

    profiles.slice(0, MAX_PROFILES - 1).forEach((p, idx) => {
        profileSlots.push({ 
            ...p, 
            id: `slot-${idx + 2}`,
            image: p.image || AVATAR_LIST[idx] || AVATAR_DEFAULT 
        });
    });
    
    const isAddSlotAvailable = profileSlots.length < MAX_PROFILES;
    if (isAddSlotAvailable) {
        profileSlots.push({ 
            id: 'slot-add', 
            name: 'Add Profile', 
            isAddButton: true 
        });
    }

    const [focusedId, setFocusedId] = useState(profileSlots[0]?.id || null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const currentIndex = profileSlots.findIndex(slot => slot.id === focusedId);

            if (e.key === 'ArrowRight') {
                if (currentIndex < profileSlots.length - 1) {
                    setFocusedId(profileSlots[currentIndex + 1].id);
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    setFocusedId(profileSlots[currentIndex - 1].id);
                }
            } else if (e.key === 'ArrowDown') {
                setFocusedId('logout-btn');
            } else if (e.key === 'ArrowUp') {
                if (focusedId === 'logout-btn') {
                    setFocusedId(profileSlots[0].id);
                }
            } else if (e.key === 'Enter') {
                if (focusedId === 'logout-btn') {
                    onLogout();
                } else {
                    const activeSlot = profileSlots.find(s => s.id === focusedId);
                    if (activeSlot) handleProfileClick(activeSlot.name);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedId, profileSlots, onLogout]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleProfileClick = (profileName) => {
        if (profileName === 'Add Profile') {
            onCreateProfile();
        } else {
            localStorage.setItem('ulka_username', profileName); 
            

            const existingToken = localStorage.getItem('ulka_token');
            if (existingToken) {
                onSelectProfile(profileName, existingToken);
            } else {
                onSelectProfile(profileName);
            }
        }
    };

    const styles = {
        profileView: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: COLOR_BLACK,
            padding: '50px',
        },
        cardTitle: {
            fontSize: '40px',
            fontWeight: 700,
            color: COLOR_WHITE,
            marginBottom: '40px',
        },
        profileButtonsContainer: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '50px', 
            marginBottom: '20px',
            justifyContent: 'center',
            maxWidth: '380px', 
        },
        profileWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '120px', 
        },
        profileButton: {
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            backgroundColor: COLOR_DARK_GREY,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '4px solid transparent',
            cursor: 'pointer',
            marginBottom: '10px',
            transition: 'border-color 250ms, transform 250ms',
        },
        addProfileButton: {
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            backgroundColor: '#333', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '4px solid transparent',
            cursor: 'pointer',
            marginBottom: '10px',
            transition: 'border-color 250ms, transform 250ms',
        },
        focused: {
            borderColor: COLOR_FOCUS,
            transform: 'scale(1.1)',
        },
        imageIcon: {
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        addIconText: {
            color: COLOR_WHITE, 
            fontSize: '60px',
        },
        profileButtonText: {
            color: COLOR_WHITE,
            fontSize: '20px',
            fontWeight: 500,
            textAlign: 'center',
        },
        logoInCard: {
            width: '400px',
        },
    };
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#000'
        }}>
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
                    gap: '16px'
                }}>
                    <h1 style={styles.cardTitle}>Who's Watching?</h1>
                    
                    <div style={styles.profileButtonsContainer}>
                        {profileSlots.map((profileSlot) => {
                            const isFocused = focusedId === profileSlot.id;
                            
                            return (
                                <div key={profileSlot.id} style={styles.profileWrapper}>
                                    <button
                                        onClick={() => handleProfileClick(profileSlot.name)} 
                                        onFocus={() => setFocusedId(profileSlot.id)}
                                        style={{
                                            ... (profileSlot.isAddButton ? styles.addProfileButton : styles.profileButton),
                                            ...(isFocused ? styles.focused : {})
                                        }}
                                    >
                                        {profileSlot.isAddButton ? (
                                            <span style={styles.addIconText}>+</span>
                                        ) : (
                                            <img src={profileSlot.image} alt={profileSlot.name} style={styles.imageIcon} />
                                        )}
                                    </button>
                                    <p style={styles.profileButtonText}>{profileSlot.name}</p>
                                </div>
                            );
                        })}
                    </div>
                    
                    <img src={LOGO_ULKA} alt="Ulka TV" style={styles.logoInCard} />
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
        </div>
    );
    };

export default ProfileScreen;
