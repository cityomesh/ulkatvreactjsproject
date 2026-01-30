import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ExitScreen from './screens/ExitScreen';
import CreateProfileScreen from './screens/CreateProfileScreen';

function AppContent() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('ulka_token'));
  
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('ulka_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const token = localStorage.getItem('ulka_token');
    if (token) setAccessToken(token);
  }, []);

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

  const handleSaveProfile = (newProfile) => {
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('ulka_profiles', JSON.stringify(updatedProfiles)); 
    navigate('/profiles'); 
  };

  return (
    <div className="App min-h-screen"> 
      <Routes>
        <Route path="/" element={
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess} 
            onSelectProfile={handleSelectProfile} 
            profiles={profiles}
          />
        } />
        
        <Route path="/home" element={<HomeScreen accessToken={accessToken} />} />
        
        <Route path="/exit" element={<ExitScreen />} />

        <Route path="/create-profile" element={
          <CreateProfileScreen 
            onGoBack={() => navigate('/profiles')} 
            onSaveProfile={handleSaveProfile} 
          />
        } />

        <Route path="/profiles" element={
          <LoginScreen 
            startAtProfiles={true} 
            onLoginSuccess={handleLoginSuccess} 
            onSelectProfile={handleSelectProfile} 
            profiles={profiles}
          />
        } />
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