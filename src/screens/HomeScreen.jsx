//Homescreen.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getChannels } from '../components/api';
import { useNavigate } from 'react-router-dom';
import ShakaPlayer from '../components/ShakaPlayer';
import ShakaPlayerNew from '../components/ShakaPlayerNew';

const API_HOST = 'http://202.62.66.115:8080';
const CHANNELS_ENDPOINT = '/apiv2/channels/list';

const LANGUAGES = [
    { name: "Telugu", id: 3 }, { name: "Hindi", id: 1 }, { name: "English", id: 2 }, 
    { name: "Tamil", id: 4 }, { name: "Kannada", id: 5 }, { name: "Malayalam", id: 6 },
    { name: "Marathi", id: 7 }, { name: "Bengali", id: 8 }, { name: "Gujarati", id: 9 },
    { name: "Punjabi", id: 10 }, { name: "Odia", id: 11 }, { name: "Assamese", id: 25 },
    { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 27 }, { name: "SPORTS", id: 28 }
];

const CATEGORIES = [
    { name: "Entertainment", id: 3 }, { name: "News", id: 1 }, { name: "Movies", id: 4 },
    { name: "Music", id: 5 }, { name: "Spiritual", id: 6 }, { name: "Sports", id: 7 },
    { name: "Shopping", id: 8 }, { name: "LifeStyle", id: 9 }, { name: "Infotainment", id: 10 },
    { name: "Comedy", id: 11 }, { name: "Kids", id: 12 }, { name: "Local Channels", id: 13 }
];

const HomeScreen = ({ accessToken }) => {

    const navigate = useNavigate();
    const [allChannels, setAllChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [activeSection, setActiveSection] = useState('categories');
    const [focusedIdx, setFocusedIdx] = useState(0);
    const [selectedCat, setSelectedCat] = useState(0); 
    const [selectedLang, setSelectedLang] = useState(0); 
    const [playingUrl, setPlayingUrl] = useState('');
    const [playingEncUrl, setPlayingEncUrl] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const catRef = useRef(null);
    const langRef = useRef(null);
    const chanRef = useRef(null);

    // Reusable function to play a channel
    const loadChannel = useCallback(async (channel) => {
        console.log("loadChannel: ", channel);
        if (!channel) return;
        setPlayingEncUrl(channel.encryption_url || '');
        setPlayingUrl(channel.stream_url || '');
    }, []);

    const updateFilteredList = useCallback((channels, cIdx, lIdx) => {
        if (!channels || channels.length === 0) return;
        const cId = CATEGORIES[cIdx].id;
        const lId = LANGUAGES[lIdx].id;
        const filtered = channels.filter(ch => ch.subgenre_id === cId && ch.genre_id === lId);
        setFilteredChannels(filtered);
    }, []);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await getChannels(accessToken);
                if (response.status_code === 200) {
                    const data = response.response_object;
                    setAllChannels(data);
                    updateFilteredList(data, 0, 0);
                }
            } catch (err) { console.error("API Error:", err); }
        };
        fetchChannels();
    }, [accessToken, updateFilteredList]);

    useEffect(() => {
        let currentContainer = null;
        if (activeSection === 'categories') currentContainer = catRef.current;
        if (activeSection === 'languages') currentContainer = langRef.current;
        if (activeSection === 'channels') currentContainer = chanRef.current;

        if (currentContainer && currentContainer.children[focusedIdx]) {
            const el = currentContainer.children[focusedIdx];
            const containerHeight = currentContainer.clientHeight;
            const elTop = el.offsetTop;
            const elHeight = el.offsetHeight;
            const scrollTo = elTop - containerHeight / 2 + elHeight / 2;
            currentContainer.scrollTo({ top: scrollTo, behavior: 'smooth' });
        }
    }, [focusedIdx, activeSection]);

    const handleKeyDown = useCallback((e) => {
        const loopIndex = (idx, len) => (idx + len) % len;

        // --- FULL SCREEN NAVIGATION (ZAPPING) ---
        if (isFullScreen) {
            if (e.key === 'Backspace' || e.key === 'Escape') {
                e.preventDefault();
                setIsFullScreen(false);
                return;
            }

            if (filteredChannels.length > 0) {
                let nextIdx = focusedIdx;
                if (e.key === 'ArrowRight') {
                    // Next Channel
                    nextIdx = loopIndex(focusedIdx + 1, filteredChannels.length);
                    setFocusedIdx(nextIdx);
                    loadChannel(filteredChannels[nextIdx]);
                } else if (e.key === 'ArrowLeft') {
                    // Previous Channel
                    nextIdx = loopIndex(focusedIdx - 1, filteredChannels.length);
                    setFocusedIdx(nextIdx);
                    loadChannel(filteredChannels[nextIdx]);
                }
            }
            return;
        }

        // --- BACK BUTTON LOGIC ---
        if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            navigate('/exit');
            return;
        }

        // --- UI NAVIGATION ---
        if (activeSection === 'categories') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => loopIndex(p + 1, CATEGORIES.length));
            if (e.key === 'ArrowUp') setFocusedIdx(p => loopIndex(p - 1, CATEGORIES.length));
            if (e.key === 'ArrowRight') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
            if (e.key === 'Enter') {
                setSelectedCat(focusedIdx);
                updateFilteredList(allChannels, focusedIdx, selectedLang);
            }
        } 
        else if (activeSection === 'languages') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => loopIndex(p + 1, LANGUAGES.length));
            if (e.key === 'ArrowUp') setFocusedIdx(p => loopIndex(p - 1, LANGUAGES.length));
            if (e.key === 'ArrowLeft') { setActiveSection('categories'); setFocusedIdx(selectedCat); }
            if (e.key === 'ArrowRight') { setActiveSection('channels'); setFocusedIdx(0); }
            if (e.key === 'Enter') {
                setSelectedLang(focusedIdx);
                updateFilteredList(allChannels, selectedCat, focusedIdx);
            }
        }
        else if (activeSection === 'channels') {
            const len = filteredChannels.length;
            if (len === 0) return;
            if (e.key === 'ArrowDown') setFocusedIdx(p => loopIndex(p + 1, len));
            if (e.key === 'ArrowUp') setFocusedIdx(p => loopIndex(p - 1, len));
            if (e.key === 'ArrowLeft') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
            if (e.key === 'ArrowRight') { setActiveSection('player'); }
            if (e.key === 'Enter') {
                loadChannel(filteredChannels[focusedIdx]);
            }
        }
        else if (activeSection === 'player') {
            if (e.key === 'ArrowLeft') { setActiveSection('channels'); }
            if (e.key === 'Enter' && playingUrl) setIsFullScreen(true);
        }
    }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang, updateFilteredList, isFullScreen, playingUrl, navigate, loadChannel]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const currentHover = (activeSection === 'channels' || activeSection === 'player') 
        ? (filteredChannels[focusedIdx] || filteredChannels[0]) 
        : (filteredChannels[0] || {});

    // --- STYLES ---
    const headerBaseStyle = {
        backgroundColor: '#FFFAE0', color: '#000', height: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', fontWeight: '900', borderRadius: '4px', textTransform: 'uppercase'
    };

    const styles = {
        screenWrapper: {
            width: '100vw', height: '100vh', backgroundColor: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
        },
        container: { 
            width: '100%', maxWidth: '1920px', height: '100%', maxHeight: '1080px',
            aspectRatio: '16 / 9', backgroundColor: '#000', color: '#fff', 
            display: 'flex', padding: '20px', boxSizing: 'border-box', gap: '15px' 
        },
        sidebarColumn: { display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a', gap: '8px', height: '100%', borderRadius: '8px', border: '1px solid #1a1a1a' },
        scrollArea: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px', scrollbarWidth: 'none' },
        sidebarItem: (isFocused, isSelected) => ({
            padding: '12px 8px', marginBottom: '10px', borderRadius: '6px', textAlign: 'center',
            border: isFocused ? '3px solid #f00' : '2px solid transparent',
            backgroundColor: isSelected ? '#1a1a1a' : 'transparent',
            color: isFocused ? '#f00' : (isSelected ? '#00D1FF' : '#fff'), 
            fontSize: '18px', fontWeight: 'bold'
        }),
        rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' },
        playerWrapper: (isFocused) => ({
            flex: 1, backgroundColor: '#000', borderRadius: '10px', 
            border: isFocused ? '5px solid #00D1FF' : '2px solid #222',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative'
        }),
        fullScreen: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000', zIndex: 9999 }
    };

    if (isFullScreen && playingUrl) {
        return (
            <div style={styles.fullScreen}>
                <ShakaPlayerNew stream_url={playingUrl} encryption_url={playingEncUrl} />
            </div>
        );
    }

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.container}>
                <style>{`
                    ::-webkit-scrollbar { display: none; }
                    @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                `}</style>

                <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
                    <div style={{ ...styles.sidebarColumn, width: '180px' }}>
                        <div style={headerBaseStyle}>Categories</div>
                        <div style={styles.scrollArea} ref={catRef}>
                            {CATEGORIES.map((cat, i) => (
                                <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>
                                    {cat.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...styles.sidebarColumn, width: '180px' }}>
                        <div style={headerBaseStyle}>Languages</div>
                        <div style={styles.scrollArea} ref={langRef}>
                            {LANGUAGES.map((lang, i) => (
                                <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>
                                    {lang.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ ...styles.sidebarColumn, width: '230px' }}>
                        <div style={headerBaseStyle}>Channels</div>
                        <div style={styles.scrollArea} ref={chanRef}>
                        {filteredChannels.map((ch, i) => {
                            const isFocused = activeSection === 'channels' && focusedIdx === i;
                            return (
                                <div key={ch.id} style={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0',
                                    transform: isFocused ? 'scale(1.3)' : 'scale(1)', transition: 'all 0.2s',
                                    marginBottom: '15px'
                                }}>
                                    <img src={ch.icon_url} alt={ch.title} style={{ width: '150px', height: '85px', objectFit: 'contain', border: isFocused ? '3px solid red' : 'none', borderRadius: '8px' }} />
                                    {isFocused && <div style={{ fontSize: '11px', color: '#fff', marginTop: '5px' }}>{ch.channel_number}. {ch.title}</div>}
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>

                <div style={styles.rightPanel}>
                    <div style={{ ...headerBaseStyle, height: '55px', fontSize: '20px' }}>ULKA TV ADVERTISEMENT</div>
                    <div style={styles.playerWrapper(activeSection === 'player')}>
                        {playingUrl ? (
                            <ShakaPlayerNew stream_url={playingUrl} encryption_url={playingEncUrl}/>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                {currentHover?.icon_url && <img src={currentHover.icon_url} alt="" style={{ height: '150px', marginBottom: '15px' }} />}
                                <h2 style={{ fontSize: '22px', color: '#00D1FF' }}>PRESS OK TO WATCH</h2>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3].map(n => (
                            <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#00D1FF', borderRadius: '6px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                                Program {n}
                            </div>
                        ))}
                    </div>
                    <div style={{ height: '50px', backgroundColor: '#111', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: '#fff', fontSize: '18px', animation: 'marquee 20s linear infinite', whiteSpace: 'nowrap' }}>
                            • Use Arrows to Navigate • Press Ok to Play • Enjoy Ulka TV High Definition •
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
