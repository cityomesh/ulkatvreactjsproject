//Homescreen.page work ayyindhi free channles
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ShakaPlayer from './ShakaPlayer';
import { getPallyTokenFromNetwork } from './api.js';
import { data } from 'react-router-dom';

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
    const [allChannels, setAllChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [activeSection, setActiveSection] = useState('categories');
    const [focusedIdx, setFocusedIdx] = useState(0);
    const [focusedChannel, setFocusedChannel] = useState(0);
    const [selectedCat, setSelectedCat] = useState(0); 
    const [selectedLang, setSelectedLang] = useState(0); 
    
    const [playingUrl, setPlayingUrl] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const catRef = useRef(null);
    const langRef = useRef(null);
    const chanRef = useRef(null);
    const [drmTokenUpdate, setDrmTokenUpdate] = useState('')
    const updateFilteredList = useCallback((channels, cIdx, lIdx) => {
        if (!channels || channels.length === 0) return;
        const cId = CATEGORIES[cIdx].id;
        const lId = LANGUAGES[lIdx].id;
        const filtered = channels.filter(ch => ch.subgenre_id === cId && ch.genre_id === lId);
        setFilteredChannels(filtered);
    }, []);

    useEffect(() => {
        const fetchChannels = async () => {
            const currentToken = accessToken || localStorage.getItem('ulka_token');
            if (!currentToken) return;
            try {
                const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: currentToken });
                if (response.data.status_code === 200) {
                    const data = response.data.response_object;
                    setAllChannels(data);
                    updateFilteredList(data, 0, 0);
                }
            } catch (err) { console.error("API Error:", err); }
        };
        fetchChannels();
    }, [accessToken, updateFilteredList]);

    useEffect(() => {
        const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
        if (targetRef.current && targetRef.current.children[focusedIdx]) {
            targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [focusedIdx, activeSection]);
    useEffect(()=>{

    },[focusedChannel])
    const handleKeyDown = useCallback((e) => {
        if (isFullScreen) {
            if (e.key === 'Backspace' || e.key === 'Escape') {
                e.preventDefault();
                setIsFullScreen(false);
            }
            return;
        }

        if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            window.location.href = '/exit';
            return;
        }

        if (activeSection === 'categories') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, CATEGORIES.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowRight') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
            if (e.key === 'Enter') {
                
                setSelectedCat(focusedIdx);
                updateFilteredList(allChannels, focusedIdx, selectedLang);
            }
        } 
        else if (activeSection === 'languages') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, LANGUAGES.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowLeft') { setActiveSection('categories'); setFocusedIdx(selectedCat); }
            if (e.key === 'ArrowRight') { setActiveSection('channels'); setFocusedIdx(0); }
            if (e.key === 'Enter') {
                setSelectedLang(focusedIdx);
                updateFilteredList(allChannels, selectedCat, focusedIdx);
            }
        }
        else if (activeSection === 'channels') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, filteredChannels.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowLeft') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
            if (e.key === 'ArrowRight') { setActiveSection('player'); }
            if (e.key === 'Enter') {
                if (filteredChannels[focusedIdx]) {
                    console.log(filteredChannels[focusedIdx].encryption_url)
                    getPallyTokenFromNetwork(filteredChannels[focusedIdx].encryption_url)
                    .then((res)=>{
                        console.log(res.response_object[0].base64Token)
                        setDrmTokenUpdate(res.response_object[0].base64Token)
                    })
                    setPlayingUrl(filteredChannels[focusedIdx].stream_url);
                    setActiveSection('player');
                }
            }
        }
        else if (activeSection === 'player') {
            if (e.key === 'ArrowLeft') { setActiveSection('channels'); setFocusedIdx(0); }
            if (e.key === 'Enter' && playingUrl) {
                setIsFullScreen(true);
            }
        }
    }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang, updateFilteredList, isFullScreen, playingUrl]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const currentHover = (activeSection === 'channels' || activeSection === 'player') ? (filteredChannels[focusedIdx] || filteredChannels[0]) : (filteredChannels[0] || {});

    const headerBaseStyle = {
        backgroundColor: '#FFFAE0', color: '#000', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', fontWeight: '900', borderRadius: '4px', boxSizing: 'border-box'
    };

    const styles = {
        container: { width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', padding: '25px', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'Arial, sans-serif', gap: '15px' },
        leftLayout: { display: 'flex', gap: '10px', height: '100%' },
        column: { display: 'flex', flexDirection: 'column', backgroundColor: '#050505', gap: '10px', height: '100%' },
        scrollArea: { flex: 1, overflowY: 'auto', padding: '5px', scrollBehavior: 'smooth' },
        sidebarItem: (isFocused, isSelected) => ({
            padding: '10px 10px', marginBottom: '13px', borderRadius: '4px', textAlign: 'center',
            border: isFocused ? '3px solid #f00' : '1px solid #222',
            backgroundColor: isSelected ? '#4e4c4c' : 'transparent',
            color: isFocused ? '#f00' : '#fff', fontSize: '20px', fontWeight: 'bold'
        }),
        channelBox: (isFocused) => ({
            height: '100px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '4px',
            transform: isFocused ? 'scale(1.25)' : 'scale(1)',
            zIndex: isFocused ? 10 : 1, transition: 'all 0.1s ease-in-out', overflow: 'hidden'
        }),
        playerWrapper: (isFocused) => ({
            flex: 1, backgroundColor: '#111', borderRadius: '4px', 
            border: isFocused ? '5px solid #00D1FF' : '2px solid #333',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden', position: 'relative', transition: 'border 0.2s ease'
        }),
        rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', marginLeft: '5px' },
        fullScreen: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000' }
    };

    if (isFullScreen && playingUrl) {
        return (
            <div style={styles.fullScreen}>
                <ShakaPlayer url={playingUrl} drmToken={drmTokenUpdate} />
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                ::-webkit-scrollbar { width: 0px; }
            `}</style>

            <div style={styles.leftLayout}>
                <div style={{ ...styles.column, width: '220px' }}>
                    <div style={headerBaseStyle}>Categories</div>
                    <div style={styles.scrollArea} ref={catRef}>
                        {CATEGORIES.map((cat, i) => (
                            <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat.name}</div>
                        ))}
                    </div>
                </div>

                <div style={{ ...styles.column, width: '220px' }}>
                    <div style={headerBaseStyle}>Languages</div>
                    <div style={styles.scrollArea} ref={langRef}>
                        {LANGUAGES.map((lang, i) => (
                            <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>{lang.name}</div>
                        ))}
                    </div>
                </div>

                <div style={{ ...styles.column, width: '200px' }}>
                    <div style={headerBaseStyle}>Channels</div>
                    <div style={styles.scrollArea} ref={chanRef}>
                        {filteredChannels.length > 0 ? filteredChannels.map((ch, i) => (
                            <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)}>
                                <img src={ch.icon_url} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                            </div>
                        )) : (
                            <div style={{color: '#444', textAlign: 'center', marginTop: '20px'}}>No Channels</div>
                        )}
                    </div>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
                    <div style={{ ...headerBaseStyle, width: '100px' }}>{currentHover?.channel_number || '---'}</div>
                    <div style={{ ...headerBaseStyle, flex: 1 }}>{currentHover?.title || 'Select Channel'}</div>
                    <div style={{ ...headerBaseStyle, width: '400px', backgroundColor: '#200', border: '2px solid red', overflow: 'hidden' }}>
                        <div style={{ color: '#FFFAE0', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', animation: 'marquee 15s linear infinite' }}>
                             • Use Arrows to Navigate • Press Ok to Play • Enjoy Ulka TV •
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3].map(n => (
                        <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>Program {n}</div>
                    ))}
                </div>

                <div style={styles.playerWrapper(activeSection === 'player')}>
                    {playingUrl ? (
                        <ShakaPlayer url={playingUrl} drmToken={drmTokenUpdate}/>
                    ) : (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {currentHover?.icon_url ? (
                                <img src={currentHover.icon_url} alt="Preview" style={{ height: '250px', width: 'auto', objectFit: 'contain' }} />
                            ) : (
                                <h2 style={{ fontSize: '45px', color: '#444' }}>PLAYER PREVIEW</h2>
                            )}
                            <p style={{ fontSize: '24px', color: '#00D1FF', fontWeight: 'bold' }}>
                                Press OK to Play {currentHover?.title}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ height: '120px', backgroundColor: '#00D1FF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '45px', fontWeight: '900' }}>
                    ADVERTISEMENT
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
