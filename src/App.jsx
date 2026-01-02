// // // src/App.jsx

// // import React from 'react';
// // import LoginScreen from './components/LoginScreen'; // <-- మీ కొత్త ఫైల్

// // function App() {
// //   return (
// //     // Tailwind base styles పనిచేయడానికి, బాడీకి పూర్తి స్క్రీన్ క్లాస్‌లు ఉండాలి
// //     <div className="App min-h-screen"> 
// //       <LoginScreen />
// //     </div>
// //   );
// // }

// // export default App;

// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginScreen from './components/LoginScreen';
// import HomeScreen from './components/HomeScreen';
// import ExitScreen from './components/ExitScreen';

// function App() {
//   // గమనిక: HomeScreen కి accessToken పంపాలి, ఇక్కడ dummy గా ఇస్తున్నాను
//   const dummyToken = "your_token_here";

//   return (
//     <Router>
//       <div className="App min-h-screen"> 
//         <Routes>
//           <Route path="/" element={<LoginScreen />} />
//           <Route path="/login" element={<LoginScreen />} />
//           <Route path="/home" element={<HomeScreen accessToken={dummyToken} />} />
//           <Route path="/exit" element={<ExitScreen />} />
//           <Route path="/profiles" element={<LoginScreen startAtProfiles={true} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


// //App.jsx
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginScreen from './components/LoginScreen';
// import HomeScreen from './components/HomeScreen';
// import ExitScreen from './components/ExitScreen';

// function App() {
// // const [accessToken, setAccessToken] = useState(localStorage.getItem('token'));
// const [accessToken, setAccessToken] = useState(localStorage.getItem('ulka_token'));

//   const handleLoginSuccess = (token) => {
//     localStorage.setItem('ulka_token', token); // ఇక్కడ మార్చండి
//     setAccessToken(token);
//   };

//   const handleSelectProfile = (profileName, token) => {
//     setAccessToken(token); 
//         console.log("Profile Selected:", profileName);
//     navigate('/home'); 
// };
//   return (
//     <Router>
//       <div className="App min-h-screen"> 
//         <Routes>
//           <Route path="/" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
//           <Route path="/login" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
          
//           <Route path="/home" element={<HomeScreen accessToken={accessToken} />} />
          
//           <Route path="/exit" element={<ExitScreen />} />
          
//           <Route path="/profiles" element={<LoginScreen startAtProfiles={true} onLoginSuccess={handleLoginSuccess} />} />
//           <Route path="/profiles" element={
//               <LoginScreen 
//                   startAtProfiles={true} 
//                   onSelectProfile={(name) => handleSelectProfile(name, actualToken)} 
//               />
//           } />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // useNavigate యాడ్ చేశా
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ExitScreen from './components/ExitScreen';

function AppContent() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('ulka_token'));

  const handleLoginSuccess = (token) => {
    localStorage.setItem('ulka_token', token);
    setAccessToken(token);
    navigate('/home'); 
  };

  const handleSelectProfile = (profileName, token) => {
    const activeToken = token || localStorage.getItem('ulka_token');
    setAccessToken(activeToken); 
    console.log("Profile Selected:", profileName, "Token:", activeToken);
    navigate('/home'); 
  };

  return (
    <div className="App min-h-screen"> 
      <Routes>
        <Route path="/" element={<LoginScreen onLoginSuccess={handleLoginSuccess} onSelectProfile={handleSelectProfile} />} />
        <Route path="/login" element={<LoginScreen onLoginSuccess={(token) => setAccessToken(token)} />} />
        <Route path="/home" element={<HomeScreen accessToken={accessToken} />} />
        <Route path="/exit" element={<ExitScreen />} />
        <Route path="/profiles" element={<LoginScreen startAtProfiles={true} onLoginSuccess={handleLoginSuccess} onSelectProfile={handleSelectProfile} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
