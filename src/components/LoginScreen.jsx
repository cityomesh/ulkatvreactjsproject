// // src/components/LoginScreen.jsx - (Updated for HomeScreen integration and INLINE CustomKeyboard)

// import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios'; 
// import CreateProfileScreen from './CreateProfileScreen'; 
// import HomeScreen from './HomeScreen'; // <<< కొత్త కాంపోనెంట్ దిగుమతి

// const LOGO_ULKA = "ulkatv.png";
// const ICON_DOWN_ARROW = "DownArrow.png";
// const BG_IMAGE_1 = "LoginIMG1.webp"; 
// const BG_IMAGE_2 = "allnames.webp"; 
// const AVATAR_DEFAULT = "Avatar16.png"; 
// const AVATAR_LIST = ["Avatar15.png", "Avatar14.png", "Avatar13.png"];
// const COLOR_PRIMARY = '#E50914'; 
// const COLOR_FOCUS = '#e1001eff';   
// const COLOR_HEADER = '#e6dc53ff';
// const COLOR_4K = '#FFB800';      
// const COLOR_WHITE = '#ffffff'; 
// const COLOR_BLACK = '#020202ff';
// const COLOR_DARK_GREY = '#1a1a1a'; 

// // (Icon and GlobalInputStyles components unchanged)
// const Icon = ({ name, size = 20, color = COLOR_WHITE }) => {
//     const icons = {
//         'eye-off-outline': '👁️‍🗨️', 
//         'eye-outline': '👁️',       
//         'chevron-down': '▼'
//     };
//     return (
//         <span style={{ fontSize: size, color }}>{icons[name] || '❔'}</span>
//     );
// };
// const GlobalInputStyles = () => (
//     <style>
//         {`
//             ::selection {
//                 background: ${COLOR_FOCUS}; 
//                 color: ${COLOR_WHITE};
//             }
//             input:-webkit-autofill,
//             input:-webkit-autofill:hover, 
//             input:-webkit-autofill:focus, 
//             input:-webkit-autofill:active {
//                 -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important; 
//                 -webkit-text-fill-color: ${COLOR_WHITE} !important; 
//                 transition: background-color 5000s ease-in-out 0s; 
//             }
//         `}
//     </style>
// );

// const SYMBOL_LAYOUT = [
//   ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
//   ['-', '_', '+', '=', '{', '}', '[', ']'],
//   [';', ':', '"', "'", '<', '>', '?'],
//   ['ABC', 'BACK'],
//   ['SPACE', 'ENTER']
// ];


// const KEYBOARD_LAYOUT = [
//   ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
//   ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
//   ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
//   ['CAPS', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK'],
//   ['@#$', '.', 'SPACE', 'ENTER'],
// ];

// const CustomKeyboard = ({ layout, isCaps, focusedPos, isKeyboardFocused }) => {
//   return (
//     <div style={{
//       width: '900px',
//       padding: '20px',
//       backgroundColor: 'rgba(20,20,20,0.95)',
//       borderRadius: '15px',
//       border: '1px solid #333'
//     }}>
//       {layout.map((row, rIdx) => (
//         <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
//           {row.map((key, cIdx) => {
//             const focused =
//               isKeyboardFocused &&
//               focusedPos.row === rIdx &&
//               focusedPos.col === cIdx;

//             return (
//               <div
//                 key={key}
//                 style={{
//                   flex: key === 'SPACE' ? 4 : key === 'ENTER' || key === 'CAPS' ? 1.5 : 1,
//                   height: '50px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backgroundColor: focused ? COLOR_FOCUS : '#333',
//                   color: COLOR_WHITE,
//                   borderRadius: '8px',
//                   fontWeight: 'bold',
//                   fontSize: '18px',
//                   border: focused ? '3px solid white' : '1px solid transparent',
//                   transform: focused ? 'scale(1.1)' : 'scale(1)',
//                   transition: 'all 0.1s'
//                 }}
//               >
//                 {key === 'BACK'
//                   ? '⌫'
//                   : key.length === 1
//                     ? (isCaps ? key.toUpperCase() : key.toLowerCase())
//                     : key}
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };


// // =======================================================
// // *** ProfileScreen COMPONENT (Unchanged) ***
// // =======================================================

// const ProfileScreen = ({ username: loggedInUsername, accessToken, onLogout, onCreateProfile, profiles, onSelectProfile }) => {
// // ... (ProfileScreen Code remains the same) ...

//     const MAX_PROFILES = 4;
    
//     const profileSlots = [];
    
//     profileSlots.push({ 
//         id: 'slot-1', 
//         name: loggedInUsername, 
//         image: AVATAR_DEFAULT, 
//         isFixed: true 
//     });
    
//     // 2. అదనపు ప్రొఫైల్స్ (3 వరకు)
//     profiles.slice(0, MAX_PROFILES - 1).forEach((p, idx) => {
//         profileSlots.push({ 
//             ...p, 
//             id: `slot-${idx + 2}`,
//             image: p.image || AVATAR_LIST[idx] || AVATAR_DEFAULT 
//         });
//     });
    
//     // 3. ఖాళీ స్లాట్ ఉంటే 'Add Profile' బటన్
//     const isAddSlotAvailable = profileSlots.length < MAX_PROFILES;
    
//     if (isAddSlotAvailable) {
//         profileSlots.push({ 
//             id: 'slot-add', 
//             name: 'Add Profile', 
//             isAddButton: true 
//         });
//     }

//     const [focusedId, setFocusedId] = useState(profileSlots[0]?.id || null);

//     // *** లాజిక్ మార్పు: ఈ ఫంక్షన్ ఇప్పుడు ప్రొఫైల్ పేరును పేరెంట్ కు పంపుతుంది ***
//     const handleProfileClick = (profileName) => {
//         if (profileName === 'Add Profile') {
//             onCreateProfile();
//         } else {
//             // ఎంపిక చేసిన ప్రొఫైల్‌తో హోమ్ స్క్రీన్‌కు వెళ్లడానికి కాల్ చేయండి
//             onSelectProfile(profileName); 
//         }
//     };


//     // Style Definitions for Profile Screen (Unchanged)
//     const styles = {
//         profileView: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: '100vh',
//             backgroundColor: COLOR_BLACK,
//             padding: '50px',
//             width: '100%',
//             position: 'relative',
//             zIndex: 5,
//         },
//         cardTitle: {
//             fontSize: '40px',
//             fontWeight: 700,
//             color: COLOR_WHITE,
//             marginBottom: '40px',
//         },
//         profileButtonsContainer: {
//             display: 'flex',
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             gap: '50px', 
//             marginBottom: '20px',
//             justifyContent: 'center',
//             maxWidth: '380px', 
//         },
//         profileWrapper: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             width: '120px', 
//         },
//         profileButton: {
//             width: '120px',
//             height: '120px',
//             borderRadius: '60px',
//             backgroundColor: COLOR_DARK_GREY,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             border: '4px solid transparent',
//             cursor: 'pointer',
//             marginBottom: '10px',
//             transition: 'border-color 250ms, transform 250ms',
//         },
//         addProfileButton: {
//             width: '120px',
//             height: '120px',
//             borderRadius: '60px',
//             backgroundColor: '#333', 
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             border: '4px solid transparent',
//             cursor: 'pointer',
//             marginBottom: '10px',
//             transition: 'border-color 250ms, transform 250ms',
//         },
//         focused: {
//             borderColor: COLOR_FOCUS,
//             transform: 'scale(1.1)',
//         },
//         imageIcon: {
//             width: '100%',
//             height: '100%',
//             borderRadius: '50%',
//             objectFit: 'cover',
//         },
//         addIconText: {
//             color: COLOR_WHITE, 
//             fontSize: '60px',
//         },
//         profileButtonText: {
//             color: COLOR_WHITE,
//             fontSize: '20px',
//             fontWeight: 500,
//             textAlign: 'center',
//         },
//         logoInCard: {
//             width: '400px',
//             opacity: 0.5,
//         },
//         logoutButton: {
//              marginTop: '40px', 
//              padding: '10px 20px', 
//              backgroundColor: COLOR_PRIMARY, 
//              color: COLOR_WHITE, 
//              border: 'none', 
//              borderRadius: '5px', 
//              cursor: 'pointer',
//              fontSize: '16px'
//         }
//     };
    
//     return (
//         <div style={styles.profileView}>
//              <h1 style={styles.cardTitle}>Who's Watching?</h1>
             
//             <div style={styles.profileButtonsContainer}>
//                 {profileSlots.map((profileSlot) => {
//                     const isFocused = focusedId === profileSlot.id;
                    
//                     if (profileSlot.isAddButton) {
//                         // Add Profile బటన్
//                         return (
//                             <div key={profileSlot.id} style={styles.profileWrapper}>
//                                 <button
//                                     onClick={() => handleProfileClick('Add Profile')} // <<< అప్‌డేటెడ్
//                                     onFocus={() => setFocusedId(profileSlot.id)}
//                                     onBlur={() => setFocusedId(null)}
//                                     style={{
//                                         ...styles.addProfileButton,
//                                         ...(isFocused ? styles.focused : {})
//                                     }}
//                                 >
//                                     <span style={styles.addIconText}>+</span> 
//                                 </button>
//                                 <p style={styles.profileButtonText}>Add Profile</p>
//                             </div>
//                         );
//                     } else {
//                         // యూజర్ ప్రొఫైల్
//                         return (
//                              <div key={profileSlot.id} style={styles.profileWrapper}>
//                                 <button
//                                     onClick={() => handleProfileClick(profileSlot.name)} // <<< అప్‌డేటెడ్
//                                     onFocus={() => setFocusedId(profileSlot.id)}
//                                     onBlur={() => setFocusedId(null)}
//                                     style={{
//                                         ...styles.profileButton,
//                                         ...(isFocused ? styles.focused : {})
//                                     }}
//                                 >
//                                     <img src={profileSlot.image} alt={profileSlot.name} style={styles.imageIcon} />
//                                 </button>
//                                 <p style={styles.profileButtonText}>{profileSlot.name}</p>
//                             </div>
//                         );
//                     }
//                 })}
//             </div>
            
//             <img src={LOGO_ULKA} alt="Ulka TV" style={styles.logoInCard} />
            
//             <button onClick={onLogout} style={styles.logoutButton}>
//                 Logout / Switch Account
//             </button>
//         </div>
//     );
// };


// // =======================================================
// // *** LoginScreen COMPONENT (Updated with Keyboard Logic) ***
// // =======================================================
// const LoginScreen = () => {
//     // --- State Management ---
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [activeInput, setActiveInput] = useState(''); // '' కి మార్చబడింది
//     const [isCaps, setIsCaps] = useState(false);
//     const [isSymbol, setIsSymbol] = useState(false);

//     const layout = isSymbol ? SYMBOL_LAYOUT : KEYBOARD_LAYOUT;
//     const [focusKey, setFocusKey] = useState('username'); 
//     const [kbPos, setKbPos] = useState({ row: 0, col: 0 });

//     // API & Navigation State
//     const [loading, setLoading] = useState(false);
//     const [apiError, setApiError] = useState('');
//     const [accessToken, setAccessToken] = useState('');
//     const [isLoggedIn, setIsLoggedIn] = useState(false); 
//     const [isCreatingProfile, setIsCreatingProfile] = useState(false); 
    
//     // *** కొత్త స్టేట్‌లు ***
//     const [isViewingHome, setIsViewingHome] = useState(false); 
//     const [selectedProfile, setSelectedProfile] = useState(''); 

//     // *** కీబోర్డ్ స్టేట్‌లు ***
//     const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // కీబోర్డ్ చూపించడానికి
//     const [keyboardTarget, setKeyboardTarget] = useState(''); // ఏ ఇన్‌పుట్‌కు కీబోర్డ్ టార్గెట్
//     const keyboardRef = useRef(null); // CustomKeyboard యొక్క పద్ధతులను యాక్సెస్ చేయడానికి


//     // Profile State (Maximum 3 additional profiles)
//     const [profiles, setProfiles] = useState([]); 

//     // Background State
//     const [bgIndex, setBgIndex] = useState(0);
//     const backgrounds = [BG_IMAGE_1, BG_IMAGE_2];
    
//     // (DUMMY API VALUES unchanged)
//     const DUMMY_MAC_ADDRESS = "00:00:00:00:00:00";
//     const DUMMY_FIREBASE_TOKEN = "web_dummy_firebase_token";
//     const DUMMY_FIRMWARE_VERSION = "1.0.0_web";
//     const DUMMY_APP_ID = "1";
//     const DUMMY_IP = "127.0.0.1";

//     useEffect(() => {
//         const handleKeyDown = (e) => {

//             // Home or Profile screens లో ignore
//             if (isViewingHome || isLoggedIn && !isKeyboardVisible) return;

//             switch (e.key) {

//                 case 'ArrowUp':
//                     if (focusKey === 'password') setFocusKey('username');
//                     else if (focusKey === 'login_btn') setFocusKey('password');
//                     else if (focusKey === 'keyboard') {
//                         if (kbPos.row > 0) {
//                             setKbPos(p => ({ ...p, row: p.row - 1 }));
//                         } else {
//                             setIsKeyboardVisible(false);
//                             setFocusKey('login_btn');
//                         }
//                     }
//                     break;

//                 case 'ArrowDown':
//                     if (focusKey === 'username') setFocusKey('password');
//                     else if (focusKey === 'password') setFocusKey('login_btn');
//                     else if (focusKey === 'login_btn') {
//                         setFocusKey('keyboard');
//                         setIsKeyboardVisible(true);
//                         setKbPos({ row: 0, col: 4 });
//                     } 
//                     else if (focusKey === 'keyboard') {
//                         setKbPos(p => ({
//                             ...p,
//                             row: Math.min(p.row + 1, KEYBOARD_LAYOUT.length - 1),
//                             col: Math.min(
//                                 p.col,
//                                 KEYBOARD_LAYOUT[Math.min(p.row + 1, KEYBOARD_LAYOUT.length - 1)].length - 1
//                             )
//                         }));
//                     }
//                     break;

//                 case 'ArrowLeft':
//                     if (focusKey === 'keyboard') {
//                         setKbPos(p => ({ ...p, col: Math.max(0, p.col - 1) }));
//                     }
//                     break;

//                 case 'ArrowRight':
//                     if (focusKey === 'keyboard') {
//                         setKbPos(p => ({
//                             ...p,
//                             col: Math.min(
//                                 p.col + 1,
//                                 KEYBOARD_LAYOUT[kbPos.row].length - 1
//                             )
//                         }));
//                     }
//                     break;

//                 case 'Enter':
//                     handleRemoteEnter();
//                     break;

//                 default:
//                     break;
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [focusKey, kbPos, isKeyboardVisible]);



//     // 2. రిమోట్ 'Enter' నొక్కినప్పుడు మాత్రమే కీబోర్డ్ ఓపెన్ అవ్వాలి
//     const handleRemoteEnter = () => {
//     if (focusKey === 'username' || focusKey === 'password') {
//         setKeyboardTarget(focusKey);
//         setIsKeyboardVisible(true);
//         setFocusKey('keyboard');
//         return;
//     }

//     if (focusKey === 'login_btn') {
//         handleLogin();
//         return;
//     }

//     if (focusKey === 'keyboard') {
//         const key = layout[kbPos.row][kbPos.col];

//         if (key === 'CAPS') {
//         setIsCaps(p => !p);
//         return;
//         }

//         if (key === '@#$') {
//         setIsSymbol(true);
//         setKbPos({ row: 0, col: 0 });
//         return;
//         }

//         if (key === 'ABC') {
//         setIsSymbol(false);
//         setKbPos({ row: 0, col: 0 });
//         return;
//         }

//         if (key === 'BACK') {
//         handleKeyboardKeyPress('backspace');
//         return;
//         }

//         if (key === 'ENTER') {
//         setIsKeyboardVisible(false);
//         setFocusKey('login_btn');
//         return;
//         }

//         if (key === 'SPACE') {
//         handleKeyboardKeyPress(' ');
//         return;
//         }

//         handleKeyboardKeyPress(isCaps ? key.toUpperCase() : key.toLowerCase());
//     }
//     };



//     // --- Background Image Rotation Effect (Unchanged) ---
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setBgIndex((prev) => (prev + 1) % backgrounds.length);
//         }, 8000);
        
//         return () => clearInterval(interval);
//     }, []);

//     // --- API CALL HANDLER (Updated to hide keyboard) ---
//     const handleLogin = async () => {
//         // కీబోర్డ్ ను దాచండి
//         setIsKeyboardVisible(false);
//         setKeyboardTarget('');

//         // **Demo Logic for testing profile screen:**
//         if (username === 'omi' && password === '123') {
//              setAccessToken("DUMMY_TOKEN_OMI");
//              setIsLoggedIn(true);
//              setUsername('omi');
//              setProfiles([
//                  { id: 'p2', name: 'Rajini', image: AVATAR_LIST[0] },
//                  { id: 'p3', name: 'Vamsi', image: AVATAR_LIST[1] },
//              ]);
//              setLoading(false);
//              return;
//         }


//         if (loading) return;
//         setApiError('');
//         setLoading(true);

//         if (!username || !password) {
//             setApiError("Username and Password are required.");
//             setLoading(false);
//             return;
//         }
        
//         const apiBody = {
//             // ... (API బాడీ) ...
//              auth: `username=${username};password=${password};boxid=undefined;appid=${DUMMY_APP_ID};timestamp=${Date.now()}`,
//         };


//         try {
//             const response = await axios.post(
//                 'http://202.62.66.121:8080/apiv2/credentials/loginMini', 
//                 apiBody
//             );

//             if (response.data?.status_code === 200 && response.data.response_object?.[0]?.access_token) {
//                 const token = response.data.response_object[0].access_token;
//                 setAccessToken(token);
//                 setIsLoggedIn(true); 
//                 // Set the main user's profile here
//                 setProfiles([]); // Clear old profiles upon new login
                
//             } else {
//                 setApiError(response.data?.error_description || 'Login failed. Please check credentials.');
//             }
//         } catch (error) {
//             console.error("Login API Error:", error);
//             setApiError('Network error, server issue, or invalid API response.');
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     // Logout Handler (Unchanged)
//     const handleLogout = () => {
//         setIsLoggedIn(false);
//         setUsername('');
//         setPassword('');
//         setAccessToken('');
//         setApiError('');
//         setProfiles([]);
//         setIsViewingHome(false); 
//         setSelectedProfile('');
//         // కీబోర్డ్ ను దాచండి
//         setIsKeyboardVisible(false);
//         setKeyboardTarget('');
//         setActiveInput('');
//     };
    
//     // *** కొత్త ఫంక్షన్: ప్రొఫైల్ ఎంపిక తర్వాత హోమ్ పేజీకి వెళ్లడానికి ***
//     const handleSelectProfileAndNavigate = (profileName) => {
//         setSelectedProfile(profileName);
//         setIsViewingHome(true);
//     };

//     // New Profile Logic (Unchanged)
//     const handleSaveNewProfile = (newProfile) => {
//         if (profiles.length < 3) {
//             const avatarIndex = profiles.length; 
//             const image = AVATAR_LIST[avatarIndex] || AVATAR_DEFAULT;
            
//             setProfiles(prev => [
//                 ...prev, 
//                 { 
//                     id: `p${prev.length + 2}`,
//                     name: newProfile.name, 
//                     image: image 
//                 }
//             ]);
//         }
//         setIsCreatingProfile(false);
//     };

//     // *** కొత్త ఫంక్షన్: కీబోర్డ్ ఇన్‌పుట్ హ్యాండిల్ చేయడం ***
//     const handleKeyboardKeyPress = (key) => {
//         if (key === 'backspace') {
//             if (keyboardTarget === 'username') setUsername(prev => prev.slice(0, -1));
//             if (keyboardTarget === 'password') setPassword(prev => prev.slice(0, -1));
//         } else if (key === 'enter') {
//             // ఎంటర్ ప్రెస్ చేసినప్పుడు లాగిన్ ప్రయత్నించండి
//             handleLogin();
//         } else {
//             // సాధారణ అక్షరాలు, సంఖ్యలు, లేదా చిహ్నాలు
//             if (keyboardTarget === 'username') setUsername(prev => prev + key);
//             if (keyboardTarget === 'password') setPassword(prev => prev + key);
//         }
//     };

//     const handleInputFocus = (inputName) => {
//         setActiveInput(inputName);
//         setFocusKey(inputName); // ప్రస్తుతం ఏ ఫీల్డ్ మీద ఫోకస్ ఉందో సెట్ చేస్తుంది
//     };

//     // Helper style function for focus effect (Unchanged)
//     const getInputBorder = (inputName) => {
//         const baseStyle = {
//             width: '100%',
//             height: '48px', 
//             border: '5px solid',
//             backgroundColor: 'rgba(55, 134, 238, 0.1)', 
//             border: '5px solid',
//             borderRadius: '8px', 
//             padding: '0 16px',   
//             display: 'flex',
//             alignItems: 'center',
//             marginBottom: '32px', 
//             transition: 'border-color 300ms, transform 300ms, box-shadow 300ms',
//             cursor: 'text',
//         };

//         if (activeInput === inputName || focusKey === inputName) {
//             return {
//                 ...baseStyle,
//                 borderColor: COLOR_FOCUS, 
//                 transform: 'scale(1.03)', 
//                 boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', 
//             };
//         } else {
//             return {
//                 ...baseStyle,
//                 borderColor: '#6b7280', 
//             };
//         }
//     };

//     return (
//         <div style={{
//             width: '100%',
//             height: '100vh', 
//             display: 'flex',
//             backgroundColor: COLOR_BLACK, 
//             overflow: 'hidden',
//         }}>
//             <GlobalInputStyles />

//             {/* 1. Home Screen UI */}
//             {isViewingHome && isLoggedIn && (
//                 <HomeScreen
//                     profileName={selectedProfile}
//                     accessToken={accessToken}
//                     onGoBackToProfiles={() => setIsViewingHome(false)}
//                 />
//             )}

//             {/* 2. ప్రొఫైల్ క్రియేషన్ పేజీ */}
//             {isCreatingProfile && (
//                 <CreateProfileScreen
//                     username={username}
//                     onGoBack={() => setIsCreatingProfile(false)}
//                     onSaveProfile={handleSaveNewProfile} 
//                 />
//             )}
            
//             {/* 3. ప్రొఫైల్స్ స్క్రీన్ UI */}
//             {isLoggedIn && !isCreatingProfile && !isViewingHome && (
//                 <ProfileScreen 
//                     username={username} 
//                     accessToken={accessToken} 
//                     onLogout={handleLogout} 
//                     onCreateProfile={profiles.length < 3 ? () => setIsCreatingProfile(true) : () => alert("Maximum 4 profiles reached.")}
//                     profiles={profiles}
//                     onSelectProfile={handleSelectProfileAndNavigate} // <<< కొత్త లాజిక్
//                 />
//             )}


//             {/* 4. లాగిన్ స్క్రీన్ UI */}
//             {!isLoggedIn && (
//                 <div style={{
//                     width: '30%', 
//                     height: '100%',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     backgroundColor: COLOR_BLACK, 
//                     zIndex: 10, 
//                     minWidth: '580px', 
//                 }}>
//                     <div style={{
//                         width: '100%',
//                         maxWidth: '320px', 
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         height: '100%',
//                         paddingTop: '100px', 
//                         paddingBottom: '8px',
//                     }}>
//                         {/* HEADER TEXT (Unchanged) */}
//                         <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>THE FUTURE OF</h2>
//                             <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>ENTERTAINMENT</h2>
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//                                 <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>IS HERE</h2>
//                                 <div style={{ width: '40px', height: '40px', marginLeft: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                     <img src={ICON_DOWN_ARROW} alt="Down Arrow" style={{ width: '30px', height: '30px' }} />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* FORM SECTION (Updated for Keyboard) */}
//                         <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                             {/* USERNAME INPUT */}
//                         <div 
//                             style={getInputBorder('username')}
//                             onMouseEnter={() => handleInputFocus('username')} // Mouse hover చేసినప్పుడు ఫోకస్
//                         >
//                             <input
//                                 style={{ flex: 1, backgroundColor: 'transparent', color: COLOR_WHITE, border: 'none', outline: 'none' }}
//                                 type="text"
//                                 placeholder="Username"
//                                 value={username}
//                                 onFocus={() => handleInputFocus('username')} // రిమోట్ నావిగేషన్ ఫోకస్
//                                 readOnly={true} 
//                             />
//                         </div>

//                             {/* PASSWORD INPUT */}
//                             <div 
//                             style={getInputBorder('password')}
//                             onMouseEnter={() => handleInputFocus('password')}
//                         >
//                             <input
//                                 style={{ flex: 1, backgroundColor: 'transparent', color: COLOR_WHITE, border: 'none', outline: 'none' }}
//                                 type={showPassword ? "text" : "password"}
//                                 placeholder="Password"
//                                 value={password}
//                                 onFocus={() => handleInputFocus('password')}
//                                 readOnly={true}
//                             />
//                             <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                                 <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} />
//                             </button>
//                         </div>
                            
//                             {/* API Error Message */}
//                             {apiError && (
//                                 <p style={{ color: COLOR_PRIMARY, marginBottom: '10px', fontSize: '14px' }}>
//                                     ⚠️ {apiError}
//                                 </p>
//                             )}
                            
//                             {/* SIGN IN BUTTON (Unchanged) */}
//                             <button
//                                 onClick={handleLogin} 
//                                 onFocus={() => handleInputFocus('login_btn')} // బటన్ పైకి ఫోకస్ వచ్చినప్పుడు
//                                 style={{
//                                     width: '110%',
//                                     height: '48px',
//                                     borderRadius: '8px',
//                                     fontWeight: 'bold',
//                                     fontSize: '18px',
//                                     marginBottom: '32px',
//                                     backgroundColor: focusKey === 'login_btn' ? COLOR_FOCUS : COLOR_PRIMARY, // ఫోకస్ అయినప్పుడు రంగు మారుతుంది
//                                     border: focusKey === 'login_btn' ? '4px solid white' : 'none',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.2s',
//                                     transform: focusKey === 'login_btn' ? 'scale(1.05)' : 'scale(1)',
//                                     color: COLOR_WHITE
//                                 }}
//                             >
//                                 {loading ? 'Signing In...' : 'Sign In'}
//                             </button>

//                             {/* INFO / POLICY (Unchanged) */}
//                             <div style={{ textAlign: 'center', width: '100%', marginBottom: '32px' }}>
//                                 <a href="#" style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', color: COLOR_HEADER }}>Privacy Policy</a>
//                                 <p style={{ fontSize: '20px', fontWeight: 'bold', color: COLOR_HEADER, marginTop: '8px' }}>
//                                     <span style={{ color: COLOR_4K, fontSize: '30px' }}>4K</span> Ultra HD Streaming
//                                 </p>
//                             </div>

//                             {/* DEVICE TAGS (Unchanged) */}
//                             <div style={{ display: 'flex', justifyContent: 'center' }}>
//                                 {["SmartTV", "STB", "Stick", "Mobile"].map((d) => (
//                                     <button key={d}
//                                         style={{
//                                             color: COLOR_WHITE,
//                                             fontSize: '16px',
//                                             fontWeight: '900',
//                                             padding: '8px 13px',
//                                             borderRadius: '8px',
//                                             margin: '0 6px',
//                                             backgroundColor: `${COLOR_PRIMARY}cc`, 
//                                             border: 'none',
//                                             cursor: 'pointer',
//                                         }}
//                                         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLOR_PRIMARY}
//                                         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${COLOR_PRIMARY}cc`}
//                                     >
//                                         {d}
//                                     </button>
//                                 ))}
//                             </div>

//                         </div>

//                         {/* LOGO (Unchanged) */}
//                         <img src={LOGO_ULKA} alt="Company Logo" style={{ width: '400px', marginTop: 'auto', paddingBottom: '200px' }} />
//                     </div>
//                 </div>
//             )}
            

//             {/* 5. రైట్ ప్యానెల్ (యానిమేటెడ్ బ్యాక్‌గ్రౌండ్) - లాగిన్ లేదా ప్రొఫైల్స్ స్క్రీన్‌లో మాత్రమే కనిపించాలి */}
//             {!isViewingHome && (
//                 <div style={{
//                     flex: 1, 
//                     height: '100%', // 70% నుండి 100% కి మార్చబడింది
//                     position: 'relative', 
//                     backgroundColor: COLOR_BLACK, 
//                     zIndex: 1, 
//                 }}>
//                     {/* ... (Background image rotation logic - Unchanged) ... */}
//                     <div style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         overflow: 'hidden',
//                     }}>
//                         {/* BG 1 */}
//                         <img 
//                             src={backgrounds[0]} 
//                             alt="Background Scene 1"
//                             style={{
//                                 position: 'fixed', 
//                                 width: '70%', // 80% నుండి 70% కి మార్చబడింది
//                                 height: '100%',
//                                 objectFit: 'contain', // contain నుండి cover కి మార్చబడింది
//                                 opacity: bgIndex === 0 ? 1 : 0, 
//                                 backgroundColor: COLOR_BLACK, 
//                                 transition: 'opacity 1s ease-in-out', 
//                             }}
//                         />

//                         {/* BG 2 */}
//                         <img 
//                             src={backgrounds[1]} 
//                             alt="Background Scene 2"
//                             style={{
//                                 position: 'fixed', 
//                                 width: '70%', // 80% నుండి 70% కి మార్చబడింది
//                                 height: '100%',
//                                 objectFit: 'contain', // contain నుండి cover కి మార్చబడింది
//                                 opacity: bgIndex === 1 ? 1 : 0,
//                                 backgroundColor: COLOR_BLACK, 
//                                 transition: 'opacity 1s ease-in-out', 
//                             }}
//                         />
//                     </div>

//                     {/* DARK OVERLAY LAYER */}
//                     <div style={{ 
//                         position: 'absolute', 
//                         top: 0, 
//                         left: 0, 
//                         width: '100%', 
//                         height: '100%', 
//                         backgroundColor: 'rgba(0, 0, 0, 0.4)', 
//                         zIndex: 2,
//                     }}></div>
//                 </div>
//             )}
            
//             {/* 6. Custom Keyboard Integration */}
//             <div style={{
//                 position: 'fixed',
//                 bottom: isKeyboardVisible ? '250px' : '-500px', // అనిమేషన్ కోసం
//                 left: '260px',
//                 right: '0',
//                 zIndex: 100,
//                 transition: 'bottom 0.4s cubic-bezier(0.17, 0.04, 0.03, 0.94)',
//                 display: 'flex',
//                 justifyContent: 'center'
//             }}>
//                 <CustomKeyboard
//                 layout={layout}
//                 isCaps={isCaps}
//                 focusedPos={kbPos}
//                 isKeyboardFocused={focusKey === 'keyboard'}
//                 />

//             </div>
//         </div>
//     );
// };

// export default LoginScreen;






// src/components/LoginScreen.jsx - (Updated for HomeScreen integration and INLINE CustomKeyboard)

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios'; 
import CreateProfileScreen from './CreateProfileScreen'; 
import HomeScreen from './HomeScreen'; // <<< కొత్త కాంపోనెంట్ దిగుమతి

const LOGO_ULKA = "ulkatv.png";
const ICON_DOWN_ARROW = "DownArrow.png";
const BG_IMAGE_1 = "LoginIMG1.webp"; 
const BG_IMAGE_2 = "allnames.webp"; 
const AVATAR_DEFAULT = "Avatar16.png"; 
const AVATAR_LIST = ["Avatar15.png", "Avatar14.png", "Avatar13.png"];
const COLOR_PRIMARY = '#E50914'; 
const COLOR_FOCUS = '#e1001eff';   
const COLOR_HEADER = '#e6dc53ff';
const COLOR_4K = '#FFB800';      
const COLOR_WHITE = '#ffffff'; 
const COLOR_BLACK = '#020202ff';
const COLOR_DARK_GREY = '#1a1a1a'; 

// (Icon and GlobalInputStyles components unchanged)
const Icon = ({ name, size = 20, color = COLOR_WHITE }) => {
    const icons = {
        'eye-off-outline': '👁️‍🗨️', 
        'eye-outline': '👁️',       
        'chevron-down': '▼'
    };
    return (
        <span style={{ fontSize: size, color }}>{icons[name] || '❔'}</span>
    );
};
const GlobalInputStyles = () => (
    <style>
        {`
            ::selection {
                background: ${COLOR_FOCUS}; 
                color: ${COLOR_WHITE};
            }
            input:-webkit-autofill,
            input:-webkit-autofill:hover, 
            input:-webkit-autofill:focus, 
            input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important; 
                -webkit-text-fill-color: ${COLOR_WHITE} !important; 
                transition: background-color 5000s ease-in-out 0s; 
            }
        `}
    </style>
);

const SYMBOL_LAYOUT = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  ['-', '_', '+', '=', '{', '}', '[', ']'],
  [';', ':', '"', "'", '<', '>', '?'],
  ['ABC', 'BACK'],
  ['SPACE', 'ENTER']
];


const KEYBOARD_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['CAPS', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK'],
  ['@#$', '.', 'SPACE', 'ENTER'],
];

const CustomKeyboard = ({ layout, isCaps, focusedPos, isKeyboardFocused }) => {
  return (
    <div style={{
      width: '900px',
      padding: '20px',
      backgroundColor: 'rgba(20,20,20,0.95)',
      borderRadius: '15px',
      border: '1px solid #333'
    }}>
      {layout.map((row, rIdx) => (
        <div key={rIdx} style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
          {row.map((key, cIdx) => {
            const focused =
              isKeyboardFocused &&
              focusedPos.row === rIdx &&
              focusedPos.col === cIdx;

            return (
              <div
                key={key}
                style={{
                  flex: key === 'SPACE' ? 4 : key === 'ENTER' || key === 'CAPS' ? 1.5 : 1,
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: focused ? COLOR_FOCUS : '#333',
                  color: COLOR_WHITE,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  border: focused ? '3px solid white' : '1px solid transparent',
                  transform: focused ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.1s'
                }}
              >
                {key === 'BACK'
                  ? '⌫'
                  : key.length === 1
                    ? (isCaps ? key.toUpperCase() : key.toLowerCase())
                    : key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};


// =======================================================
// *** ProfileScreen COMPONENT (Unchanged) ***
// =======================================================

const ProfileScreen = ({ username: loggedInUsername, accessToken, onCreateProfile, profiles, onSelectProfile }) => {
    const MAX_PROFILES = 4;
    const profileSlots = [];
    profileSlots.push({ 
        id: 'slot-1', 
        name: loggedInUsername, 
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


    // --- Arrow Keys Navigation Logic ---
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
                // ఒకవేళ కింద Logout బటన్ ఉంటే అక్కడికి వెళ్ళడానికి
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
    }, [focusedId, profileSlots]);

    // *** లాజిక్ మార్పు: ఈ ఫంక్షన్ ఇప్పుడు ప్రొఫైల్ పేరును పేరెంట్ కు పంపుతుంది ***
    const handleProfileClick = (profileName) => {
        if (profileName === 'Add Profile') {
            onCreateProfile();
        } else {
            // ఎంపిక చేసిన ప్రొఫైల్‌తో హోమ్ స్క్రీన్‌కు వెళ్లడానికి కాల్ చేయండి
            onSelectProfile(profileName); 
        }
    };


    // Style Definitions for Profile Screen (Unchanged)
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
            <div style={styles.profileView}>
                <h1 style={styles.cardTitle}>Who's Watching?</h1>
                
                <div style={styles.profileButtonsContainer}>
                    {profileSlots.map((profileSlot) => {
                        const isFocused = focusedId === profileSlot.id;
                        
                        return (
                            <div key={profileSlot.id} style={styles.profileWrapper}>
                                <button
                                    // మౌస్ మరియు రిమోట్ రెండింటికీ పని చేసేలా
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
        );
    };

// =======================================================
// *** LoginScreen COMPONENT (Updated with Keyboard Logic) ***
// =======================================================
const LoginScreen = ({ startAtProfiles = false }) => {
    // --- State Management ---
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeInput, setActiveInput] = useState(''); // '' కి మార్చబడింది
    const [isCaps, setIsCaps] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);
    const [focusedId, setFocusedId] = useState('slot-1'); 
    const layout = isSymbol ? SYMBOL_LAYOUT : KEYBOARD_LAYOUT;
    const [focusKey, setFocusKey] = useState('username'); 
    const [kbPos, setKbPos] = useState({ row: 0, col: 0 });
    const [isLoggedIn, setIsLoggedIn] = useState(startAtProfiles);
    // API & Navigation State
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isCreatingProfile, setIsCreatingProfile] = useState(false); 
    
    // *** కొత్త స్టేట్‌లు ***
    const [isViewingHome, setIsViewingHome] = useState(false); 
    const [selectedProfile, setSelectedProfile] = useState(''); 

    // *** కీబోర్డ్ స్టేట్‌లు ***
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false); // కీబోర్డ్ చూపించడానికి
    const [keyboardTarget, setKeyboardTarget] = useState(''); // ఏ ఇన్‌పుట్‌కు కీబోర్డ్ టార్గెట్
    const keyboardRef = useRef(null); // CustomKeyboard యొక్క పద్ధతులను యాక్సెస్ చేయడానికి


    // Profile State (Maximum 3 additional profiles)
    const [profiles, setProfiles] = useState([]); 

    // Background State
    const [bgIndex, setBgIndex] = useState(0);
    const backgrounds = [BG_IMAGE_1, BG_IMAGE_2];
    
    // (DUMMY API VALUES unchanged)
    const DUMMY_MAC_ADDRESS = "00:00:00:00:00:00";
    const DUMMY_FIREBASE_TOKEN = "web_dummy_firebase_token";
    const DUMMY_FIRMWARE_VERSION = "1.0.0_web";
    const DUMMY_APP_ID = "1";
    const DUMMY_IP = "127.0.0.1";


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
            // 1. Home Screen లో ఉంటే ఈ లాజిక్ పని చేయకూడదు
            if (isViewingHome) return;

            // 2. Profile Screen Navigation (లాగిన్ అయి ఉండి, ప్రొఫైల్స్ చూస్తున్నప్పుడు)
            if (isLoggedIn && !isCreatingProfile) {
                // profileSlots డేటాను ఇక్కడ కూడా యాక్సెస్ చేయాలి కాబట్టి 
                // ఈ useEffect బయట profileSlots ని డిఫైన్ చేయడం మంచిది.
                const profileSlotsCount = profiles.length + 1; // మెయిన్ యూజర్ + ఇతర ప్రొఫైల్స్
                const addProfileExists = profileSlotsCount < 4;
                const totalItems = addProfileExists ? profileSlotsCount + 1 : profileSlotsCount;

                // ప్రస్తుతం ఏ ప్రొఫైల్ మీద ఉన్నామో ఇండెక్స్ కనుక్కోవడం
                // ఇక్కడ focusedId ని వాడతాము (ProfileScreen లో సెట్ చేసిన స్టేట్)
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
                return; // ప్రొఫైల్ స్క్రీన్ లో ఉన్నప్పుడు కింద ఉన్న లాగిన్ లాజిక్ కి వెళ్ళదు
            }

            // 3. Login Screen & Keyboard Navigation (పాత లాజిక్ కి అప్‌డేట్స్)
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


    // 2. రిమోట్ 'Enter' నొక్కినప్పుడు మాత్రమే కీబోర్డ్ ఓపెన్ అవ్వాలి
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
        setIsKeyboardVisible(false);
        setFocusKey('login_btn');
        return;
        }

        if (key === 'SPACE') {
        handleKeyboardKeyPress(' ');
        return;
        }

        handleKeyboardKeyPress(isCaps ? key.toUpperCase() : key.toLowerCase());
    }
    };


    // --- Background Image Rotation Effect (Unchanged) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % backgrounds.length);
        }, 8000);
        
        return () => clearInterval(interval);
    }, []);

    // --- API CALL HANDLER (Updated to hide keyboard) ---
    const handleLogin = async () => {
        // కీబోర్డ్ ను దాచండి
        setIsKeyboardVisible(false);
        setKeyboardTarget('');

        // **Demo Logic for testing profile screen:**
        if (username === 'omi' && password === '123') {
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

        if (!username || !password) {
            setApiError("Username and Password are required.");
            setLoading(false);
            return;
        }
        
        const apiBody = {
            // ... (API బాడీ) ...
             auth: `username=${username};password=${password};boxid=undefined;appid=${DUMMY_APP_ID};timestamp=${Date.now()}`,
        };


        try {
            const response = await axios.post(
                'http://202.62.66.121:8080/apiv2/credentials/loginMini', 
                apiBody
            );

            if (response.data?.status_code === 200 && response.data.response_object?.[0]?.access_token) {
                const token = response.data.response_object[0].access_token;
                setAccessToken(token);
                setIsLoggedIn(true); 
                // Set the main user's profile here
                setProfiles([]); // Clear old profiles upon new login
                
            } else {
                setApiError(response.data?.error_description || 'Login failed. Please check credentials.');
            }
        } catch (error) {
            console.error("Login API Error:", error);
            setApiError('Network error, server issue, or invalid API response.');
        } finally {
            setLoading(false);
        }
    };
    
    // Logout Handler (Unchanged)
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        setPassword('');
        setAccessToken('');
        setApiError('');
        setProfiles([]);
        setIsViewingHome(false); 
        setSelectedProfile('');
        // కీబోర్డ్ ను దాచండి
        setIsKeyboardVisible(false);
        setKeyboardTarget('');
        setActiveInput('');
    };
    
    // *** కొత్త ఫంక్షన్: ప్రొఫైల్ ఎంపిక తర్వాత హోమ్ పేజీకి వెళ్లడానికి ***
    const handleSelectProfileAndNavigate = (profileName) => {
        setSelectedProfile(profileName);
        setIsViewingHome(true);
    };

    // New Profile Logic (Unchanged)
    const handleSaveNewProfile = (newProfile) => {
        if (profiles.length < 3) {
            const avatarIndex = profiles.length; 
            const image = AVATAR_LIST[avatarIndex] || AVATAR_DEFAULT;
            
            setProfiles(prev => [
                ...prev, 
                { 
                    id: `p${prev.length + 2}`,
                    name: newProfile.name, 
                    image: image 
                }
            ]);
        }
        setIsCreatingProfile(false);
    };

    // *** కొత్త ఫంక్షన్: కీబోర్డ్ ఇన్‌పుట్ హ్యాండిల్ చేయడం ***
    const handleKeyboardKeyPress = (key) => {
        if (key === 'backspace') {
            if (keyboardTarget === 'username') setUsername(prev => prev.slice(0, -1));
            if (keyboardTarget === 'password') setPassword(prev => prev.slice(0, -1));
        } else if (key === 'enter') {
            // ఎంటర్ ప్రెస్ చేసినప్పుడు లాగిన్ ప్రయత్నించండి
            handleLogin();
        } else {
            // సాధారణ అక్షరాలు, సంఖ్యలు, లేదా చిహ్నాలు
            if (keyboardTarget === 'username') setUsername(prev => prev + key);
            if (keyboardTarget === 'password') setPassword(prev => prev + key);
        }
    };

    const handleInputFocus = (inputName) => {
        setActiveInput(inputName);
        setFocusKey(inputName); // ప్రస్తుతం ఏ ఫీల్డ్ మీద ఫోకస్ ఉందో సెట్ చేస్తుంది
    };

    // Helper style function for focus effect (Unchanged)
    const getInputBorder = (inputName) => {
        const baseStyle = {
            width: '100%',
            height: '48px', 
            border: '5px solid',
            backgroundColor: 'rgba(55, 134, 238, 0.1)', 
            border: '5px solid',
            borderRadius: '8px', 
            padding: '0 16px',   
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px', 
            transition: 'border-color 300ms, transform 300ms, box-shadow 300ms',
            cursor: 'text',
        };

        if (activeInput === inputName || focusKey === inputName) {
            return {
                ...baseStyle,
                borderColor: COLOR_FOCUS, 
                transform: 'scale(1.03)', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', 
            };
        } else {
            return {
                ...baseStyle,
                borderColor: '#6b7280', 
            };
        }
    };

    return (
        <div style={{
            width: '100%',
            height: '100vh', 
            display: 'flex',
            backgroundColor: COLOR_BLACK, 
            overflow: 'hidden',
        }}>
            <GlobalInputStyles />

            {/* 1. Home Screen UI */}
            {isViewingHome && isLoggedIn && (
                <HomeScreen
                    profileName={selectedProfile}
                    accessToken={accessToken}
                    onGoBackToProfiles={() => setIsViewingHome(false)}
                />
            )}

            {/* 2. ప్రొఫైల్ క్రియేషన్ పేజీ */}
            {isCreatingProfile && (
                <CreateProfileScreen
                    username={username}
                    onGoBack={() => setIsCreatingProfile(false)}
                    onSaveProfile={handleSaveNewProfile} 
                />
            )}
            
            {/* 3. ప్రొఫైల్స్ స్క్రీన్ UI */}
            {isLoggedIn && !isCreatingProfile && !isViewingHome && (
                <ProfileScreen 
                    username={username} 
                    accessToken={accessToken} 
                    onLogout={handleLogout} 
                    onCreateProfile={profiles.length < 3 ? () => setIsCreatingProfile(true) : () => alert("Maximum 4 profiles reached.")}
                    profiles={profiles}
                    focusedId={focusedId}
                    onSelectProfile={handleSelectProfileAndNavigate}
                    setFocusedId={setFocusedId}
                />
            )}


            {/* 4. లాగిన్ స్క్రీన్ UI */}
            {!isLoggedIn && (
                <div style={{
                    width: '30%', 
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLOR_BLACK, 
                    zIndex: 10, 
                    minWidth: '580px', 
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '320px', 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        paddingTop: '100px', 
                        paddingBottom: '8px',
                    }}>
                        {/* HEADER TEXT (Unchanged) */}
                        <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>THE FUTURE OF</h2>
                            <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>ENTERTAINMENT</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <h2 style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '0.15em', color: COLOR_HEADER }}>IS HERE</h2>
                                <div style={{ width: '40px', height: '40px', marginLeft: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={ICON_DOWN_ARROW} alt="Down Arrow" style={{ width: '30px', height: '30px' }} />
                                </div>
                            </div>
                        </div>

                        {/* FORM SECTION (Updated for Keyboard) */}
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* USERNAME INPUT */}
                        <div 
                            style={getInputBorder('username')}
                            onMouseEnter={() => handleInputFocus('username')} // Mouse hover చేసినప్పుడు ఫోకస్
                        >
                            <input
                                style={{ flex: 1, backgroundColor: 'transparent', color: COLOR_WHITE, border: 'none', outline: 'none' }}
                                type="text"
                                placeholder="Username"
                                value={username}
                                onFocus={() => handleInputFocus('username')} // రిమోట్ నావిగేషన్ ఫోకస్
                                readOnly={true} 
                            />
                        </div>

                            {/* PASSWORD INPUT */}
                            <div 
                            style={getInputBorder('password')}
                            onMouseEnter={() => handleInputFocus('password')}
                        >
                            <input
                                style={{ flex: 1, backgroundColor: 'transparent', color: COLOR_WHITE, border: 'none', outline: 'none' }}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onFocus={() => handleInputFocus('password')}
                                readOnly={true}
                            />
                            <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} />
                            </button>
                        </div>
                            
                            {/* API Error Message */}
                            {apiError && (
                                <p style={{ color: COLOR_PRIMARY, marginBottom: '10px', fontSize: '14px' }}>
                                    ⚠️ {apiError}
                                </p>
                            )}
                            
                            {/* SIGN IN BUTTON (Unchanged) */}
                            <button
                                onClick={handleLogin} 
                                onFocus={() => handleInputFocus('login_btn')} // బటన్ పైకి ఫోకస్ వచ్చినప్పుడు
                                style={{
                                    width: '110%',
                                    height: '48px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    marginBottom: '32px',
                                    backgroundColor: focusKey === 'login_btn' ? COLOR_FOCUS : COLOR_PRIMARY, // ఫోకస్ అయినప్పుడు రంగు మారుతుంది
                                    border: focusKey === 'login_btn' ? '4px solid white' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    transform: focusKey === 'login_btn' ? 'scale(1.05)' : 'scale(1)',
                                    color: COLOR_WHITE
                                }}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>

                            {/* INFO / POLICY (Unchanged) */}
                            <div style={{ textAlign: 'center', width: '100%', marginBottom: '32px' }}>
                                <a href="#" style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'underline', color: COLOR_HEADER }}>Privacy Policy</a>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', color: COLOR_HEADER, marginTop: '8px' }}>
                                    <span style={{ color: COLOR_4K, fontSize: '30px' }}>4K</span> Ultra HD Streaming
                                </p>
                            </div>

                            {/* DEVICE TAGS (Unchanged) */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {["SmartTV", "STB", "Stick", "Mobile"].map((d) => (
                                    <button key={d}
                                        style={{
                                            color: COLOR_WHITE,
                                            fontSize: '16px',
                                            fontWeight: '900',
                                            padding: '8px 13px',
                                            borderRadius: '8px',
                                            margin: '0 6px',
                                            backgroundColor: `${COLOR_PRIMARY}cc`, 
                                            border: 'none',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLOR_PRIMARY}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${COLOR_PRIMARY}cc`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>

                        </div>

                        {/* LOGO (Unchanged) */}
                        <img src={LOGO_ULKA} alt="Company Logo" style={{ width: '400px', marginTop: 'auto', paddingBottom: '200px' }} />
                    </div>
                </div>
            )}
            

            {/* 5. రైట్ ప్యానెల్ (యానిమేటెడ్ బ్యాక్‌గ్రౌండ్) - లాగిన్ లేదా ప్రొఫైల్స్ స్క్రీన్‌లో మాత్రమే కనిపించాలి */}
            {!isViewingHome && (
                <div style={{
                    flex: 1, 
                    height: '100%', // 70% నుండి 100% కి మార్చబడింది
                    position: 'relative', 
                    backgroundColor: COLOR_BLACK, 
                    zIndex: 1, 
                }}>
                    {/* ... (Background image rotation logic - Unchanged) ... */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                    }}>
                        {/* BG 1 */}
                        <img 
                            src={backgrounds[0]} 
                            alt="Background Scene 1"
                            style={{
                                position: 'fixed', 
                                width: '70%', // 80% నుండి 70% కి మార్చబడింది
                                height: '100%',
                                objectFit: 'contain', // contain నుండి cover కి మార్చబడింది
                                opacity: bgIndex === 0 ? 1 : 0, 
                                backgroundColor: COLOR_BLACK, 
                                transition: 'opacity 1s ease-in-out', 
                            }}
                        />

                        {/* BG 2 */}
                        <img 
                            src={backgrounds[1]} 
                            alt="Background Scene 2"
                            style={{
                                position: 'fixed', 
                                width: '70%', // 80% నుండి 70% కి మార్చబడింది
                                height: '100%',
                                objectFit: 'contain', // contain నుండి cover కి మార్చబడింది
                                opacity: bgIndex === 1 ? 1 : 0,
                                backgroundColor: COLOR_BLACK, 
                                transition: 'opacity 1s ease-in-out', 
                            }}
                        />
                    </div>

                    {/* DARK OVERLAY LAYER */}
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                        zIndex: 2,
                    }}></div>
                </div>
            )}
            
            {/* 6. Custom Keyboard Integration */}
            <div style={{
                position: 'fixed',
                bottom: isKeyboardVisible ? '250px' : '-500px', // అనిమేషన్ కోసం
                left: '260px',
                right: '0',
                zIndex: 100,
                transition: 'bottom 0.4s cubic-bezier(0.17, 0.04, 0.03, 0.94)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <CustomKeyboard
                layout={layout}
                isCaps={isCaps}
                focusedPos={kbPos}
                isKeyboardFocused={focusKey === 'keyboard'}
                />

            </div>
        </div>
    );
};

export default LoginScreen;




