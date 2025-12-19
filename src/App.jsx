// src/App.jsx

import React from 'react';
import LoginScreen from './components/LoginScreen'; // <-- మీ కొత్త ఫైల్

function App() {
  return (
    // Tailwind base styles పనిచేయడానికి, బాడీకి పూర్తి స్క్రీన్ క్లాస్‌లు ఉండాలి
    <div className="App min-h-screen"> 
      <LoginScreen />
    </div>
  );
}

export default App;