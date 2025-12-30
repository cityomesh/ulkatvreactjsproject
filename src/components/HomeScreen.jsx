
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';

// const API_HOST = 'http://202.62.66.121:8080';
// const CHANNELS_ENDPOINT = '/apiv2/channels/list';

// const LANGUAGES = [
//     { name: "Telugu", id: 14 }, { name: "English", id: 15 }, { name: "Hindi", id: 13 },
//     { name: "Gujarati", id: 12 }, { name: "Kannada", id: 16 }, { name: "Tamil", id: 16 },
//     { name: "Malayalam", id: 25 }, { name: "Marathi", id: 17 }, { name: "Bengali", id: 18 },
//     { name: "Punjabi", id: 10 }, { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 20 }, { name: "Assamese", id: 19 }
// ];

// const CATEGORIES = ["Entertainment", "Infotainment", "Spiritual", "Sports", "News", "Movies", "Music", "Kids", "LifeStyle", "Comedy", "Shopping", "LocalChannles", "ComedyMovies"];

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

//     const token = accessToken || localStorage.getItem('ulka_token');

//     useEffect(() => {
//         if (accessToken) {
//             localStorage.setItem('ulka_token', accessToken);
//         }
//     }, [accessToken]);

//     useEffect(() => {
//         const fetchChannels = async () => {
//             if (!token) return;
//             try {
//                 const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: token });
//                 if (response.data.status_code === 200) {
//                     const data = response.data.response_object;
//                     setAllChannels(data);
//                     setFilteredChannels(data.filter(ch => ch.subgenre_id === 14));
//                 }
//             } catch (err) { console.error("API Error:", err); }
//         };
//         fetchChannels();
//     }, [token]);

//     useEffect(() => {
//         const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
//         if (targetRef.current && targetRef.current.children[focusedIdx]) {
//             targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }, [focusedIdx, activeSection]);

//     // ఛానెల్ మారినప్పుడు పాత వీడియో ఆగిపోవాలి (Optional: if you want auto-stop)
//     useEffect(() => {
//         if (activeSection === 'channels') {
//             setPlayingUrl(''); 
//         }
//     }, [focusedIdx]);

//     const handleKeyDown = useCallback((e) => {
//         if (e.key === 'Backspace' || e.key === 'Escape') {
//             e.preventDefault();
//             window.location.href = '/exit';
//             return;
//         }

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
//             if (e.key === 'Enter') {
//                 setPlayingUrl(filteredChannels[focusedIdx]?.stream_url);
//             }
//         }
//     }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang]);

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleKeyDown]);

//     // ప్రస్తుతం ఫోకస్‌లో ఉన్న ఛానెల్ డేటా
//     const currentHover = (activeSection === 'channels') ? filteredChannels[focusedIdx] : (filteredChannels[0] || {});

//     const headerBaseStyle = {
//         backgroundColor: '#FFFAE0', color: '#000', height: '60px',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: '24px', fontWeight: '900', borderRadius: '4px', boxSizing: 'border-box'
//     };

//     const styles = {
//         container: {
//             width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff',
//             display: 'flex', padding: '25px', boxSizing: 'border-box', overflow: 'hidden', 
//             fontFamily: 'Arial, sans-serif', gap: '15px'
//         },
//         leftLayout: { display: 'flex', gap: '10px', height: '100%' },
//         column: { display: 'flex', flexDirection: 'column', backgroundColor: '#050505', gap: '10px', height: '100%' },
//         scrollArea: { flex: 1, overflowY: 'auto', padding: '5px', scrollBehavior: 'smooth' },
//         sidebarItem: (isFocused, isSelected) => ({
//             padding: '10px 10px', marginBottom: '13px', borderRadius: '4px', textAlign: 'center',
//             border: isFocused ? '3px solid #f00' : '1px solid #222',
//             backgroundColor: isSelected ? '#4e4c4c' : 'transparent',
//             color: isFocused ? '#f00' : '#fff', fontSize: '20px', fontWeight: 'bold'
//         }),
//     //     channelBox: (isFocused) => ({
//     //         height: '100px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
//     //         transition: 'all 0.2s ease', transform: isFocused ? 'scale(1.05)' : 'scale(1)',
//     //         borderRadius: '4px',
//     //         //  border: isFocused ? '3px solid #f00' : '1px solid transparent'
//     //     }),
//     //     rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', marginLeft: '8px' }
//     // };


//     channelBox: (isFocused) => ({
//             height: '110px', 
//             marginBottom: '20px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             transition: 'all 0.2s ease',
//             boxSizing: 'border-box',
//             borderRadius: '4px',
//             // backgroundColor: '#111',
//             transform: isFocused ? 'scale(1.18)' : 'scale(1)',
//             zIndex: isFocused ? 10 : 1,
//             transition: 'transform 0.1s ease-in-out, border 0.1s ease-in-out',
//             overflow: 'hidden'
//         }),
//         rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', marginLeft: '5px' }
//     };
//     return (
//         <div style={styles.container}>
//             <style>{`
//                 @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
//                 ::-webkit-scrollbar { width: 0px; }
//                 body { margin: 0; padding: 0; overflow: hidden; background: #000; }
//             `}</style>

//             <div style={styles.leftLayout}>
//                 <div style={{ ...styles.column, width: '220px' }}>
//                     <div style={headerBaseStyle}>Categories</div>
//                     <div style={styles.scrollArea} ref={catRef}>
//                         {CATEGORIES.map((cat, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '220px' }}>
//                     <div style={headerBaseStyle}>Languages</div>
//                     <div style={styles.scrollArea} ref={langRef}>
//                         {LANGUAGES.map((lang, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>{lang.name}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '200px' }}>
//                     <div style={headerBaseStyle}>Channels</div>
//                     <div style={styles.scrollArea} ref={chanRef}>
//                         {filteredChannels.map((ch, i) => (
//                             <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)} channel_number = {ch.channel_number}>
//                                 <img src={ch.icon_url} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div style={styles.rightPanel}>
//                 {/* Info Bar */}
//                 <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
//                     <div style={{ ...headerBaseStyle, width: '100px' }}>{currentHover?.channel_number || '---'}</div>
//                     <div style={{ ...headerBaseStyle, flex: 1 }}>{currentHover?.title || 'Select Channel'}</div>
//                     <div style={{ ...headerBaseStyle, width: '400px', backgroundColor: '#200', border: '2px solid red', overflow: 'hidden' }}>
//                         <div style={{ color: '#FFFAE0', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', animation: 'marquee 15s linear infinite' }}>
//                              • Use Arrows to Navigate • Press Ok to Play • Enjoy Ulka TV •
//                         </div>
//                     </div>
//                 </div>

//                 {/* Program Row */}
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     {[1, 2, 3].map(n => (
//                         <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>Program {n}</div>
//                     ))}
//                 </div>

//                 {/* Main Player Area - Dynamic Content */}
//                 <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
//                     {playingUrl ? (
//                         /* OK నొక్కినప్పుడు వీడియో ప్లే అవుతుంది */
//                         <video src={playingUrl} autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                     ) : (
//                         /* ఛానెల్స్ మీద బ్రౌజ్ చేస్తున్నప్పుడు ఆ ఛానెల్ లోగో కనిపిస్తుంది */
//                         <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
//                             {currentHover?.icon_url ? (
//                                 <img 
//                                     src={currentHover.icon_url} 
//                                     alt="Preview" 
//                                     style={{ height: '250px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 20px rgba(255,0,0,0.3))' }} 
//                                 />
//                             ) : (
//                                 <h2 style={{ fontSize: '45px', color: '#444' }}>PLAYER PREVIEW</h2>
//                             )}
//                             <p style={{ fontSize: '24px', color: '#00D1FF', fontWeight: 'bold' }}>
//                                 Press OK to Play {currentHover?.title}
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Ad Space */}
//                 <div style={{ height: '120px', backgroundColor: '#00D1FF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '45px', fontWeight: '900' }}>
//                     ADVERTISEMENT
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeScreen;




// //Homescreen.jsx
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import ShakaPlayer from './ShakaPlayer';
// const API_HOST = 'http://202.62.66.121:8080';
// const CHANNELS_ENDPOINT = '/apiv2/channels/list';

// const LANGUAGES = [
//     { name: "Telugu", id: 14 }, { name: "English", id: 15 }, { name: "Hindi", id: 13 },
//     { name: "Gujarati", id: 12 }, { name: "Kannada", id: 16 }, { name: "Tamil", id: 16 },
//     { name: "Malayalam", id: 25 }, { name: "Marathi", id: 17 }, { name: "Bengali", id: 18 },
//     { name: "Punjabi", id: 10 }, { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 20 }, { name: "Assamese", id: 19 }
// ];

// const CATEGORIES = ["Entertainment", "Infotainment", "Spiritual", "Sports", "News", "Movies", "Music", "Kids", "LifeStyle", "Comedy", "Shopping", "LocalChannles", "ComedyMovies"];

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

//     const token = accessToken || localStorage.getItem('ulka_token');

//     useEffect(() => {
//         if (accessToken) {
//             localStorage.setItem('ulka_token', accessToken);
//         }
//     }, [accessToken]);

//     useEffect(() => {
//         const fetchChannels = async () => {
//             if (!token) return;
//             try {
//                 const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: token });
//                 if (response.data.status_code === 200) {
//                     const data = response.data.response_object;
//                     setAllChannels(data);
//                     setFilteredChannels(data.filter(ch => ch.subgenre_id === 14));
//                 }
//             } catch (err) { console.error("API Error:", err); }
//         };
//         fetchChannels();
//     }, [token]);

//     useEffect(() => {
//         const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
//         if (targetRef.current && targetRef.current.children[focusedIdx]) {
//             targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//     }, [focusedIdx, activeSection]);

//     useEffect(() => {
//         if (activeSection === 'channels') {
//             setPlayingUrl(''); 
//         }
//     }, [focusedIdx]);

//     const handleKeyDown = useCallback((e) => {
//         if (e.key === 'Backspace' || e.key === 'Escape') {
//             e.preventDefault();
//             window.location.href = '/exit';
//             return;
//         }

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
//             if (e.key === 'Enter') {
//                 setPlayingUrl(filteredChannels[focusedIdx]?.stream_url);
//             }
//         }
//     }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang]);

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleKeyDown]);

//     const currentHover = (activeSection === 'channels') ? filteredChannels[focusedIdx] : (filteredChannels[0] || {});

//     const headerBaseStyle = {
//         backgroundColor: '#FFFAE0', color: '#000', height: '60px',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: '24px', fontWeight: '900', borderRadius: '4px', boxSizing: 'border-box'
//     };

//     const styles = {
//         container: {
//             width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff',
//             display: 'flex', padding: '25px', boxSizing: 'border-box', overflow: 'hidden', 
//             fontFamily: 'Arial, sans-serif', gap: '15px'
//         },
//         leftLayout: { display: 'flex', gap: '10px', height: '100%' },
//         column: { display: 'flex', flexDirection: 'column', backgroundColor: '#050505', gap: '10px', height: '100%' },
//         scrollArea: { flex: 1, overflowY: 'auto', padding: '5px', scrollBehavior: 'smooth' },
//         sidebarItem: (isFocused, isSelected) => ({
//             padding: '10px 10px', marginBottom: '13px', borderRadius: '4px', textAlign: 'center',
//             border: isFocused ? '3px solid #f00' : '1px solid #222',
//             backgroundColor: isSelected ? '#4e4c4c' : 'transparent',
//             color: isFocused ? '#f00' : '#fff', fontSize: '20px', fontWeight: 'bold'
//         }),
//         channelBox: (isFocused) => ({
//                 height: '100px', 
//                 marginBottom: '20px', 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 justifyContent: 'center',
//                 transition: 'all 0.2s ease',
//                 boxSizing: 'border-box',
//                 borderRadius: '4px',
//                 // backgroundColor: '#111',
//                 transform: isFocused ? 'scale(1.18)' : 'scale(1)',
//                 zIndex: isFocused ? 10 : 1,
//                 transition: 'transform 0.1s ease-in-out, border 0.1s ease-in-out',
//                 overflow: 'hidden'
//             }),
//             rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', marginLeft: '5px' }
//         };
//     return (
//         <div style={styles.container}>
//             <style>{`
//                 @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
//                 ::-webkit-scrollbar { width: 0px; }
//                 body { margin: 0; padding: 0; overflow: hidden; background: #000; }
//             `}</style>

//             <div style={styles.leftLayout}>
//                 <div style={{ ...styles.column, width: '220px' }}>
//                     <div style={headerBaseStyle}>Categories</div>
//                     <div style={styles.scrollArea} ref={catRef}>
//                         {CATEGORIES.map((cat, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '220px' }}>
//                     <div style={headerBaseStyle}>Languages</div>
//                     <div style={styles.scrollArea} ref={langRef}>
//                         {LANGUAGES.map((lang, i) => (
//                             <div key={i} style={styles.sidebarItem(activeSection === 'languages' && focusedIdx === i, selectedLang === i)}>{lang.name}</div>
//                         ))}
//                     </div>
//                 </div>

//                 <div style={{ ...styles.column, width: '200px' }}>
//                     <div style={headerBaseStyle}>Channels</div>
//                     <div style={styles.scrollArea} ref={chanRef}>
//                         {filteredChannels.map((ch, i) => (
//                             <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)} channel_number = {ch.channel_number}>
//                                 <img src={ch.icon_url} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div style={styles.rightPanel}>
//                 {/* Info Bar */}
//                 <div style={{ display: 'flex', gap: '10px', height: '60px' }}>
//                     <div style={{ ...headerBaseStyle, width: '100px' }}>{currentHover?.channel_number || '---'}</div>
//                     <div style={{ ...headerBaseStyle, flex: 1 }}>{currentHover?.title || 'Select Channel'}</div>
//                     <div style={{ ...headerBaseStyle, width: '400px', backgroundColor: '#200', border: '2px solid red', overflow: 'hidden' }}>
//                         <div style={{ color: '#FFFAE0', fontSize: '20px', fontWeight: 'bold', whiteSpace: 'nowrap', animation: 'marquee 15s linear infinite' }}>
//                              • Use Arrows to Navigate • Press Ok to Play • Enjoy Ulka TV •
//                         </div>
//                     </div>
//                 </div>

//                 {/* Program Row */}
//                 <div style={{ display: 'flex', gap: '10px' }}>
//                     {[1, 2, 3].map(n => (
//                         <div key={n} style={{ flex: 1, height: '80px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>Program {n}</div>
//                     ))}
//                 </div>

//                 {/* Main Player Area - Dynamic Content */}
//                 <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
//                     {playingUrl ? (
//                         /* Ikkada ShakaPlayer ni call chestunnam */
//                         <ShakaPlayer url={playingUrl} />
//                     ) : (
//                         <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
//                             {currentHover?.icon_url ? (
//                                 <img 
//                                     src={currentHover.icon_url} 
//                                     alt="Preview" 
//                                     style={{ height: '250px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 20px rgba(255,0,0,0.3))' }} 
//                                 />
//                             ) : (
//                                 <h2 style={{ fontSize: '45px', color: '#444' }}>PLAYER PREVIEW</h2>
//                             )}
//                             <p style={{ fontSize: '24px', color: '#00D1FF', fontWeight: 'bold' }}>
//                                 Press OK to Play {currentHover?.title}
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Ad Space */}
//                 <div style={{ height: '120px', backgroundColor: '#00D1FF', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '45px', fontWeight: '900' }}>
//                     ADVERTISEMENT
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomeScreen;


//HomeScreen.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ShakaPlayer from './ShakaPlayer';

const API_HOST = 'http://202.62.66.121:8080';
const CHANNELS_ENDPOINT = '/apiv2/channels/list';

const LANGUAGES = [
    { name: "Telugu", id: 14 }, { name: "English", id: 15 }, { name: "Hindi", id: 13 },
    { name: "Gujarati", id: 12 }, { name: "Kannada", id: 16 }, { name: "Tamil", id: 16 },
    { name: "Malayalam", id: 25 }, { name: "Marathi", id: 17 }, { name: "Bengali", id: 18 },
    { name: "Punjabi", id: 10 }, { name: "Bhojpuri", id: 26 }, { name: "Urdu", id: 20 }, { name: "Assamese", id: 19 }
];

const CATEGORIES = ["Entertainment", "Infotainment", "Spiritual", "Sports", "News", "Movies", "Music", "Kids", "LifeStyle", "Comedy", "Shopping", "LocalChannles", "ComedyMovies"];

const HomeScreen = ({ accessToken }) => {
    const [allChannels, setAllChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [activeSection, setActiveSection] = useState('categories');
    const [focusedIdx, setFocusedIdx] = useState(0);
    const [selectedCat, setSelectedCat] = useState(0);
    const [selectedLang, setSelectedLang] = useState(0);
    
    // Player States for DRM
    const [playingUrl, setPlayingUrl] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);

    const catRef = useRef(null);
    const langRef = useRef(null);
    const chanRef = useRef(null);

    const token = accessToken || localStorage.getItem('ulka_token');
    
    // Static DRM Token provided by you
    const DRM_LICENSE_TOKEN = "RwWs0gKaDObQHY7Bzf4qxqBGZU/d1rWUduSfPWs8FQ2lAzwoeaKany39GaFmh7I2/kWvqCTFPH6LaBegKvZpFK01qUcoU3k3YwLoWncRhll++9KlwXo3fxiV6agqhH50+wCUMcU/8wrJ1B/wlVEk5+ZehAzREH8NWLUNjYxX2OaLDHoap4+RDftnBV6wR2G24mcKHStWvD0UmxJp5HF6+t5qEXoLs65HtakYANWit/g=";

    useEffect(() => {
        if (accessToken) {
            localStorage.setItem('ulka_token', accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchChannels = async () => {
            if (!token) return;
            try {
                const response = await axios.post(`${API_HOST}${CHANNELS_ENDPOINT}`, { auth: token });
                if (response.data.status_code === 200) {
                    const data = response.data.response_object;
                    setAllChannels(data);
                    setFilteredChannels(data.filter(ch => ch.subgenre_id === 14));
                }
            } catch (err) { console.error("API Error:", err); }
        };
        fetchChannels();
    }, [token]);

    useEffect(() => {
        const targetRef = activeSection === 'categories' ? catRef : activeSection === 'languages' ? langRef : chanRef;
        if (targetRef.current && targetRef.current.children[focusedIdx]) {
            targetRef.current.children[focusedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [focusedIdx, activeSection]);

    // Navigation logic updated for Enter key and DRM selection
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Backspace' || e.key === 'Escape') {
            e.preventDefault();
            window.location.href = '/exit';
            return;
        }

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
            // HomeScreen.jsx lo navigation logic daggara
            if (e.key === 'Enter') {
                const selectedChannel = filteredChannels[focusedIdx];
                if (selectedChannel) {
                    // Direct IP badhalu proxy prefix use cheyandi
                    const originalUrl = selectedChannel.stream_url; 
                    const proxiedUrl = originalUrl.replace('http://10.10.148.25:8081', '/stream-proxy');
                    
                    console.log("Playing via Proxy:", proxiedUrl);
                    setPlayingUrl(proxiedUrl);
                    setIsEncrypted(selectedChannel.encryption === 1);
                }
            }
        }
    }, [activeSection, focusedIdx, filteredChannels, allChannels, selectedCat, selectedLang]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const currentHover = (activeSection === 'channels') ? filteredChannels[focusedIdx] : (filteredChannels[0] || {});

    const headerBaseStyle = {
        backgroundColor: '#FFFAE0', color: '#000', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', fontWeight: '900', borderRadius: '4px', boxSizing: 'border-box'
    };

    const styles = {
        container: {
            width: '100vw', height: '100vh', backgroundColor: '#000', color: '#fff',
            display: 'flex', padding: '25px', boxSizing: 'border-box', overflow: 'hidden', 
            fontFamily: 'Arial, sans-serif', gap: '15px'
        },
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
                height: '100px', 
                marginBottom: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                borderRadius: '4px',
                // backgroundColor: '#111',
                transform: isFocused ? 'scale(1.18)' : 'scale(1)',
                zIndex: isFocused ? 10 : 1,
                transition: 'transform 0.1s ease-in-out, border 0.1s ease-in-out',
                overflow: 'hidden'
            }),
            rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', marginLeft: '5px' }
        };

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                ::-webkit-scrollbar { width: 0px; }
                body { margin: 0; padding: 0; overflow: hidden; background: #000; }
            `}</style>

            <div style={styles.leftLayout}>
                <div style={{ ...styles.column, width: '220px' }}>
                    <div style={headerBaseStyle}>Categories</div>
                    <div style={styles.scrollArea} ref={catRef}>
                        {CATEGORIES.map((cat, i) => (
                            <div key={i} style={styles.sidebarItem(activeSection === 'categories' && focusedIdx === i, selectedCat === i)}>{cat}</div>
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
                        {filteredChannels.map((ch, i) => (
                            <div key={ch.id} style={styles.channelBox(activeSection === 'channels' && focusedIdx === i)}>
                                <img src={ch.icon_url} alt="" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                            </div>
                        ))}
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

                <div style={{ flex: 1, backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {playingUrl ? (
                        <ShakaPlayer 
                            url={playingUrl} 
                            isEncrypted={isEncrypted} 
                            drmToken={DRM_LICENSE_TOKEN} 
                        />
                    ) : (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {currentHover?.icon_url ? (
                                <img 
                                    src={currentHover.icon_url} 
                                    alt="Preview" 
                                    style={{ height: '250px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 20px rgba(255,0,0,0.3))' }} 
                                />
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
