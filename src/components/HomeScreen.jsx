// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// const API_HOST = 'http://202.62.66.121:8080';
// const CHANNELS_ENDPOINT = '/apiv2/channels/list';

// const LANGUAGES = [
//     { name: "Telugu", id: 14 }, { name: "English", id: 15 }, { name: "Hindi", id: 13 },
//     { name: "Gujarati", id: 12 }, { name: "Kannada", id: 16 }, { name: "Tamil", id: 16 },
//     { name: "Malayalam", id: 25 }, { name: "Marathi", id: 17 }, { name: "Bengali", id: 18 },
//     { name: "Punjabi", id: 10 }, { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 27 }
// ];

// const CATEGORIES = ["Entertainment", "Infotainment", "Spiritual", "Sports", "News", "Movies", "Music", "Kids", "LifeStyle", "Comedy", "Shopping", "Local"];

// const HomeScreen = ({ accessToken }) => {
//     const [allChannels, setAllChannels] = useState([]);
//     const [filteredChannels, setFilteredChannels] = useState([]);
//     const [activeSection, setActiveSection] = useState('categories');
//     const [focusedIdx, setFocusedIdx] = useState(0);
//     const [selectedCat, setSelectedCat] = useState(0);
//     const [selectedLang, setSelectedLang] = useState(0);
//     const [playingUrl, setPlayingUrl] = useState('');

//     const catRef = useRef(null);
//     const langRef = useRef(null);
//     const chanRef = useRef(null);

//     useEffect(() => {
//         const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
//         if (targetRef.current && targetRef.current.children[focusedIdx]) {
//             targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }, [focusedIdx, activeSection]);

//     useEffect(() => {
//         const fetchChannels = async () => {
//             try {
//                 const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: accessToken });
//                 if (response.data.status_code === 200) {
//                     const data = response.data.response_object;
//                     setAllChannels(data);
//                     setFilteredChannels(data.filter(ch => ch.subgenre_id === 14));
//                 }
//             } catch (err) { console.error("API Error"); }
//         };
//         fetchChannels();
//     }, [accessToken]);

//     const handleKeyDown = useCallback((e) => {
//         if (activeSection === 'categories') {
//             if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, CATEGORIES.length - 1));
//             if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
//             if (e.key === 'ArrowRight') { setActiveSection('languages'); setFocusedIdx(0); }
//             if (e.key === 'Enter') setSelectedCat(focusedIdx);
//         } 
//         else if (activeSection === 'languages') {
//             if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, LANGUAGES.length - 1));
//             if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
//             if (e.key === 'ArrowLeft') { setActiveSection('categories'); setFocusedIdx(selectedCat); }
//             if (e.key === 'ArrowRight') { setActiveSection('channels'); setFocusedIdx(0); }
//             if (e.key === 'Enter') {
//                 setSelectedLang(focusedIdx);
//                 setFilteredChannels(allChannels.filter(ch => ch.subgenre_id === LANGUAGES[focusedIdx].id));
//             }
//         }
//         else if (activeSection === 'channels') {
//             if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, filteredChannels.length - 1));
//             if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
//             if (e.key === 'ArrowLeft') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
//             if (e.key === 'Enter') setPlayingUrl(filteredChannels[focusedIdx]?.stream_url);
//         }
//     }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang]);

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleKeyDown]);

//     const currentHover = (activeSection === 'channels') ? filteredChannels[focusedIdx] : (filteredChannels[0] || {});

//     const styles = {
//         container: {
//             width: '1850px', height: '900px', backgroundColor: '#000', color: '#fff',
//             display: 'flex', padding: '15px', boxSizing: 'border-box', overflow: 'hidden', margin: '0 auto', fontFamily: 'Arial, sans-serif'
//         },
//         column: { display: 'flex', flexDirection: 'column', border: '2px solid #333', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#050505' },
//         header: {
//             backgroundColor: '#FFFAE0', color: '#000', height: '60px', minHeight: '60px',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: '24px', fontWeight: '900', borderBottom: '2px solid #333'
//         },
//         scrollArea: { flex: 1, overflowY: 'auto', padding: '15px', scrollBehavior: 'smooth' },
//         sidebarItem: (isFocused, isSelected) => ({
//             padding: '18px 10px', marginBottom: '10px', borderRadius: '10px', textAlign: 'center',
//             border: isFocused ? '4px solid #f00' : '1px solid #222',
//             backgroundColor: isSelected ? '#1a1a1a' : 'transparent',
//             color: isFocused ? '#f00' : '#fff', fontSize: '22px', fontWeight: 'bold'
//         }),
//         // కొత్త ఛానెల్ హైలైట్ స్టైల్ ఇక్కడ ఉంది
//         channelBox: (isFocused) => ({
//             height: '113px', 
//             marginBottom: '20px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             transition: 'all 0.3s ease',
//             transform: isFocused ? 'scale(1.1)' : 'scale(1)',
//             zIndex: isFocused ? 10 : 1,
//         }),
//         rightPanel: { flex: 1, marginLeft: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }
//     };

//     return (
//         <div style={styles.container}>
//             <style>{`
//                 @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
//                 ::-webkit-scrollbar { width: 0px; }
//             `}</style>

//             <div style={{ display: 'flex', gap: '15px' }}>
//                 <div style={{ ...styles.column, width: '230px' }}>
//                     <div style={styles.header}>Categories</div>
//                     <div style={styles.scrollArea} ref={catRef}>
//                         {CATEGORIES.map((cat, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '230px' }}>
//                     <div style={styles.header}>Languages</div>
//                     <div style={styles.scrollArea} ref={langRef}>
//                         {LANGUAGES.map((lang, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>{lang.name}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '210px', backgroundColor: 'transparent', border: 'none' }}>
//                     <div style={{...styles.header, borderRadius: '12px 12px 0 0'}}>Channels</div>
//                     <div style={{...styles.scrollArea, backgroundColor: '#050505'}} ref={chanRef}>
//                         {filteredChannels.map((ch, i) => (
//                             <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)}>
//                                 <img src={ch.icon_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div style={styles.rightPanel}>
//                 <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
//                     <div style={{ backgroundColor: '#FFFAE0', color: '#000', width: '130px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>
//                         {currentHover?.channel_number || '---'}
//                     </div>
//                     <div style={{ backgroundColor: '#FFFAE0', color: '#000', flex: 1, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>
//                         {currentHover?.title || 'Select Channel'}
//                     </div>
//                     <div style={{ width: '400px', backgroundColor: '#200', borderRadius: '10px', border: '2px solid red', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
//                         <div style={{ color: '#FFFAE0', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', animation: 'marquee 12s linear infinite' }}>
//                              Click on right side to open channels • Select a channel and press Enter to play • 
//                         </div>
//                     </div>
//                 </div>

//                 <div style={{ display: 'flex', gap: '15px' }}>
//                     {[1, 2, 3].map(n => (
//                         <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#bbb', borderRadius: '10px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold' }}>Program {n}</div>
//                     ))}
//                 </div>

//                 <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '15px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
//                     {playingUrl ? (
//                         <video src={playingUrl} autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                     ) : (
//                         <div style={{ textAlign: 'center', color: '#444' }}>
//                             <h2 style={{ fontSize: '40px' }}>PLAYER PREVIEW</h2>
//                             <p style={{ fontSize: '24px', color: '#00D1FF' }}>Press ENTER to Play Selected Channel</p>
//                         </div>
//                     )}
//                 </div>

//                 <div style={{ height: '120px', backgroundColor: '#00D1FF', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '45px', fontWeight: '900' }}>
//                     ADVERTISEMENT
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeScreen;



import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_HOST = 'http://202.62.66.121:8080';
const CHANNELS_ENDPOINT = '/apiv2/channels/list';

const LANGUAGES = [
    { name: "Telugu", id: 14 }, { name: "English", id: 15 }, { name: "Hindi", id: 13 },
    { name: "Gujarati", id: 12 }, { name: "Kannada", id: 16 }, { name: "Tamil", id: 16 },
    { name: "Malayalam", id: 25 }, { name: "Marathi", id: 17 }, { name: "Bengali", id: 18 },
    { name: "Punjabi", id: 10 }, { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 27 }
];

const CATEGORIES = ["Entertainment", "Infotainment", "Spiritual", "Sports", "News", "Movies", "Music", "Kids", "LifeStyle", "Comedy", "Shopping", "LocalChannles"];

const HomeScreen = ({ accessToken }) => {
    const [allChannels, setAllChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [activeSection, setActiveSection] = useState('categories');
    const [focusedIdx, setFocusedIdx] = useState(0);
    const [selectedCat, setSelectedCat] = useState(0);
    const [selectedLang, setSelectedLang] = useState(0);
    const [playingUrl, setPlayingUrl] = useState('');

    const catRef = useRef(null);
    const langRef = useRef(null);
    const chanRef = useRef(null);

    useEffect(() => {
        const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
        if (targetRef.current && targetRef.current.children[focusedIdx]) {
            targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [focusedIdx, activeSection]);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: accessToken });
                if (response.data.status_code === 200) {
                    const data = response.data.response_object;
                    setAllChannels(data);
                    setFilteredChannels(data.filter(ch => ch.subgenre_id === 14));
                }
            } catch (err) { console.error("API Error"); }
        };
        fetchChannels();
    }, [accessToken]);

    const handleKeyDown = useCallback((e) => {
        if (activeSection === 'categories') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, CATEGORIES.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowRight') { setActiveSection('languages'); setFocusedIdx(0); }
            if (e.key === 'Enter') setSelectedCat(focusedIdx);
        } 
        else if (activeSection === 'languages') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, LANGUAGES.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowLeft') { setActiveSection('categories'); setFocusedIdx(selectedCat); }
            if (e.key === 'ArrowRight') { setActiveSection('channels'); setFocusedIdx(0); }
            if (e.key === 'Enter') {
                setSelectedLang(focusedIdx);
                setFilteredChannels(allChannels.filter(ch => ch.subgenre_id === LANGUAGES[focusedIdx].id));
            }
        }
        else if (activeSection === 'channels') {
            if (e.key === 'ArrowDown') setFocusedIdx(p => Math.min(p + 1, filteredChannels.length - 1));
            if (e.key === 'ArrowUp') setFocusedIdx(p => Math.max(p - 1, 0));
            if (e.key === 'ArrowLeft') { setActiveSection('languages'); setFocusedIdx(selectedLang); }
            if (e.key === 'Enter') setPlayingUrl(filteredChannels[focusedIdx]?.stream_url);
        }
    }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const currentHover = (activeSection === 'channels') ? filteredChannels[focusedIdx] : (filteredChannels[0] || {});

    const styles = {
        container: {
            width: '1850px', height: '900px', backgroundColor: '#000', color: '#fff',
            display: 'flex', padding: '15px', boxSizing: 'border-box', overflow: 'hidden', margin: '0 auto', fontFamily: 'Arial, sans-serif'
        },
        column: { display: 'flex', flexDirection: 'column',  overflow: 'hidden', backgroundColor: '#050505' },
        header: {
            backgroundColor: '#FFFAE0', color: '#000', height: '60px', minHeight: '60px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: '900', borderBottom: '2px solid #333'
        },
        scrollArea: { flex: 1, overflowY: 'auto', padding: '15px', scrollBehavior: 'smooth' },
        sidebarItem: (isFocused, isSelected) => ({
            padding: '10px 10px', marginBottom: '10px', borderRadius: '10px', textAlign: 'center',
            border: isFocused ? '4px solid #f00' : '1px solid #222',
            backgroundColor: isSelected ? '#1a1a1a' : 'transparent',
            color: isFocused ? '#f00' : '#fff', fontSize: '22px', fontWeight: 'bold'
        }),
        // కొత్త ఛానెల్ హైలైట్ స్టైల్ ఇక్కడ ఉంది
        channelBox: (isFocused) => ({
            height: '113px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: isFocused ? 'scale(1.1)' : 'scale(1)',
            zIndex: isFocused ? 10 : 1,
        }),
        rightPanel: { flex: 1, marginLeft: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }
    };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                ::-webkit-scrollbar { width: 0px; }
            `}</style>

            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ ...styles.column, width: '230px' }}>
                    <div style={styles.header}>Categories</div>
                    <div style={styles.scrollArea} ref={catRef}>
                        {CATEGORIES.map((cat, i) => (
                            <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat}</div>
                        ))}
                    </div>
                </div>

                <div style={{ ...styles.column, width: '230px' }}>
                    <div style={styles.header}>Languages</div>
                    <div style={styles.scrollArea} ref={langRef}>
                        {LANGUAGES.map((lang, i) => (
                            <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>{lang.name}</div>
                        ))}
                    </div>
                </div>

                <div style={{ ...styles.column, width: '210px', backgroundColor: 'transparent', border: 'none' }}>
                    <div style={{...styles.header, borderRadius: '12px 12px 0 0'}}>Channels</div>
                    <div style={{...styles.scrollArea, backgroundColor: '#050505'}} ref={chanRef}>
                        {filteredChannels.map((ch, i) => (
                            <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)}>
                                <img src={ch.icon_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
                    <div style={{ backgroundColor: '#FFFAE0', color: '#000', width: '130px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>
                        {currentHover?.channel_number || '---'}
                    </div>
                    <div style={{ backgroundColor: '#FFFAE0', color: '#000', flex: 1, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '26px' }}>
                        {currentHover?.title || 'Select Channel'}
                    </div>
                    <div style={{ width: '400px', backgroundColor: '#200', borderRadius: '10px', border: '2px solid red', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: '#FFFAE0', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', animation: 'marquee 12s linear infinite' }}>
                             Click on right side to open channels • Select a channel and press Enter to play • 
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    {[1, 2, 3].map(n => (
                        <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#bbb', borderRadius: '10px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold' }}>Program {n}</div>
                    ))}
                </div>

                <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '15px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {playingUrl ? (
                        <video src={playingUrl} autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <div style={{ textAlign: 'center', color: '#444' }}>
                            <h2 style={{ fontSize: '40px' }}>PLAYER PREVIEW</h2>
                            <p style={{ fontSize: '24px', color: '#00D1FF' }}>Press ENTER to Play Selected Channel</p>
                        </div>
                    )}
                </div>

                <div style={{ height: '120px', backgroundColor: '#00D1FF', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '45px', fontWeight: '900' }}>
                    ADVERTISEMENT
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;