//ExitScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO_ULKA = "ulkatv.png";

const ExitScreen = () => {
    const [selectedButton, setSelectedButton] = useState('change'); 
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const loggedInUser = localStorage.getItem('ulka_username') || "User"; 
    
    const navigate = useNavigate();

    const images = [
        "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=2070", 
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedButton(prev => prev === 'change' ? 'exit' : 'change');
            setShowConfirmation(false);
        } else if (e.key === 'Enter') {
            if (selectedButton === 'change') {
                navigate('/profiles'); 
            } else if (selectedButton === 'exit') {
                if (!showConfirmation) {
                    setShowConfirmation(true);
                } else {
                    // Logout logic
                    localStorage.removeItem('ulka_token');
                    navigate('/login');
                }
            }
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            if (showConfirmation) {
                setShowConfirmation(false);
            } else {
                navigate('/home'); 
            }
        }
    }, [selectedButton, showConfirmation, navigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    const styles = {
        container: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' },
        leftPanel: { width: '75%', height: '100%', position: 'relative' },
        sliderImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 1s ease' },
        rightPanel: { 
            width: '25%', 
            backgroundColor: '#000',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '0 40px',
            gap: '20px' 
        },
        userGreeting: {
            color: '#00D1FF',
            fontSize: '22px',
            fontWeight: 'bold',
            marginBottom: '-10px',
            textTransform: 'uppercase'
        },
        title: { 
            color: '#fff', 
            fontSize: '42px', 
            fontWeight: '900', 
            textAlign: 'center',
            margin: '0 0 10px 0',
            letterSpacing: '1px'
        },
        buttonContainer: {
            width: '85%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px', 
            alignItems: 'center',
        },
        button: (focused) => ({
            width: '100%',
            height: '75px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px', 
            border: focused ? '4px solid #ff3b3b' : '2px solid rgba(255,255,255,0.2)',
            backgroundColor: focused ? 'rgba(255,50,50,0.15)' : 'transparent',
            color: '#fff', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            transition: 'all 0.1s ease',
            transform: focused ? 'scale(1.05)' : 'scale(1)',
        }),
        confirmBox: { 
            marginTop: '10px', 
            backgroundColor: 'rgba(231, 76, 60, 0.2)', 
            color: '#ff7675', 
            padding: '12px', 
            borderRadius: '8px', 
            width: '100%', 
            textAlign: 'center', 
            border: '1px solid #e74c3c',
            fontSize: '15px',
            fontWeight: 'bold'
        },
        logo: { 
            width: '100%', 
            maxWidth: '300px',
            height: 'auto', 
            objectFit: 'contain',
            marginTop: '20px',
            opacity: '0.9'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <img src={images[imageIndex]} style={styles.sliderImg} alt="Promo" />
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.userGreeting}>Goodbye, {loggedInUser}!</div>
                
                <h2 style={styles.title}>Exit Ulka?</h2>

                <div style={styles.buttonContainer}>
                    <div style={styles.button(selectedButton === 'change')}>
                        CHANGE PROFILE
                    </div>

                    <div style={{ width: '100%' }}>
                        <div style={styles.button(selectedButton === 'exit')}>
                            EXIT ULKA
                        </div>
                        
                        {showConfirmation && (
                            <div style={styles.confirmBox}>
                                Are you sure? <br/> Press ENTER to Logout
                            </div>
                        )}
                    </div>
                </div>

                <img src={LOGO_ULKA} alt="Ulka Logo" style={styles.logo} />
            </div>
        </div>
    );
};

export default ExitScreen;
