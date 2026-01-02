// src/components/CreateProfileScreen.jsx - (Updated with additional background images)

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 

// --- Assets/Constants ---
const COLOR_PRIMARY = '#E50914';
const COLOR_FOCUS = '#00A8E1'; 
const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#020202ff';
const LOGO_ULKA = "ulkatv.png";

const CREATE_BG_IMAGES = [
    'city1.jpg',
    'city2.jpg',
    'city3.webp',
    'city4.webp'
];


const ImageSlider = () => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % CREATE_BG_IMAGES.length);
    }, 4000); 

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div style={styles.rightContainer}>
      {CREATE_BG_IMAGES.map((imageSrc, idx) => (
         <img
            key={idx} 
            src={imageSrc}
            alt={`Background Scene ${idx + 1}`}
            style={{
                ...styles.animatedImage,
                opacity: index === idx ? 1 : 0, 
                transition: 'opacity 1.5s ease-in-out',
            }}
          />
      ))}
      <div style={styles.rightOverlay} />
    </div>
  );
};

const CreateProfileScreen = ({ username, onGoBack, onSaveProfile }) => {
  const [name, setName] = useState(username || ''); 
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(null);
  const [phone, setPhone] = useState('');
  
  const [focusKey, setFocusKey] = useState('name'); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          if (focusKey === 'name') setFocusKey('age');
          else if (focusKey === 'age') setFocusKey('gender_male');
          else if (focusKey === 'gender_male' || focusKey === 'gender_female') setFocusKey('phone');
          else if (focusKey === 'phone') setFocusKey('save');
          break;

        case 'ArrowUp':
          if (focusKey === 'age') setFocusKey('name');
          else if (focusKey === 'gender_male' || focusKey === 'gender_female') setFocusKey('age');
          else if (focusKey === 'phone') setFocusKey('gender_male');
          else if (focusKey === 'save' || focusKey === 'cancel') setFocusKey('phone');
          break;

        case 'ArrowRight':
          if (focusKey === 'gender_male') setFocusKey('gender_female');
          else if (focusKey === 'save') setFocusKey('cancel');
          break;

        case 'ArrowLeft':
          if (focusKey === 'gender_female') setFocusKey('gender_male');
          else if (focusKey === 'cancel') setFocusKey('save');
          break;

        case 'Enter':
          if (focusKey === 'save') handleSave();
          else if (focusKey === 'cancel') handleCancel();
          else if (focusKey === 'gender_male') setGender('Male');
          else if (focusKey === 'gender_female') setGender('Female');
          break;
          
        case 'Backspace':
          if (name === '' && age === '' && phone === '') onGoBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusKey, name, age, phone, gender]);

  const handleSave = () => {
    if (name.trim()) {
      onSaveProfile({ id: Date.now().toString(), name: name.trim(), age, gender, phone });
      onGoBack();
    } else {
      alert('Please enter a name.');
    }
  };

  const handleCancel = () => onGoBack();

  return (
    <div style={styles.container}>
      <div style={styles.leftCard}>
        <h2 style={styles.title}>Create a New Profile</h2>

        {/* Name Input */}
        <div style={{ ...styles.inputWrapper, ...(focusKey === 'name' && styles.focusedInput) }}>
          <input
            style={styles.inputText}
            placeholder="Name"
            value={name}
            readOnly
          />
        </div>

        {/* Age Input */}
        <div style={{ ...styles.inputWrapper, ...(focusKey === 'age' && styles.focusedInput) }}>
          <input
            style={styles.inputText}
            placeholder="Age"
            value={age}
            readOnly
          />
        </div>

        {/* Gender Selection */}
        <div style={styles.genderContainer}>
          <button
            style={{
              ...styles.genderButton,
              ...(gender === 'Male' && styles.genderSelected),
              ...(focusKey === 'gender_male' && styles.focusedInput)
            }}
          >
            <span style={styles.genderText}>Male</span>
          </button>
          <button
            style={{
              ...styles.genderButton,
              ...(gender === 'Female' && styles.genderSelected),
              ...(focusKey === 'gender_female' && styles.focusedInput)
            }}
          >
            <span style={styles.genderText}>Female</span>
          </button>
        </div>

        {/* Phone Number Input */}
        <div style={{ ...styles.inputWrapper, ...(focusKey === 'phone' && styles.focusedInput) }}>
          <input
            style={styles.inputText}
            placeholder="Phone Number"
            value={phone}
            readOnly
          />
        </div>

        {/* Action Buttons */}
        <div style={styles.actionButtons}>
          <button
            style={{ ...styles.button, ...styles.saveButton, ...(focusKey === 'save' && styles.focusedInput) }}
            onClick={handleSave}
          >
            <span style={styles.buttonText}>Save</span>
          </button>
          <button
            style={{ ...styles.button, ...styles.cancelButton, ...(focusKey === 'cancel' && styles.focusedInput) }}
            onClick={handleCancel}
          >
            <span style={styles.buttonText}>Cancel</span>
          </button>
        </div>
        
        <img src={LOGO_ULKA} alt="Logo" style={{ width: '300px', marginTop: '40px', opacity: 0.6 }} />
      </div>

      <ImageSlider />
    </div>
  );
};

const styles = {
  container: { 
      width: '100%',
      height: '100vh',
      display: 'flex', 
      flexDirection: 'row', 
      backgroundColor: COLOR_BLACK,
      position: 'absolute', 
      zIndex: 100 
  },
  leftCard: {
    width: '20%',
    minWidth: '400px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 40px',
    background: 'linear-gradient(to right, #000000cc, #020202ee, #070303dd)', 
    boxShadow: '4px 0 10px rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  rightContainer: {
    flex: 1,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  animatedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  rightOverlay: { 
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  title: { fontSize: '30px', fontWeight: 700, color: COLOR_WHITE, marginBottom: '30px' },
  inputWrapper: {
    width: '100%',
    height: '50px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#888',
    borderWidth: '2px',
    borderRadius: '8px',
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    transition: 'all 0.3s',
  },
  inputText: { 
      flex: 1,
      color: COLOR_WHITE, 
      fontSize: '16px',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none'
  },
  focusedInput: {
    borderColor: COLOR_FOCUS,
    transform: 'scale(1.03)',
    boxShadow: '0 0 15px rgba(0, 168, 225, 0.7)',
  },
  genderContainer: { display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: '20px' },
  genderButton: {
    width: '48%',
    height: '50px',
    borderRadius: '8px',
    borderWidth: '2px',
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  genderSelected: { backgroundColor: COLOR_FOCUS, borderColor: COLOR_FOCUS },
  genderText: { color: COLOR_WHITE, fontSize: '16px', fontWeight: 600 },
  actionButtons: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '20px' },
  button: { width: '48%', height: '50px', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.3s' },
  saveButton: { backgroundColor: '#27ae60' },
  cancelButton: { backgroundColor: '#c0392b' },
  buttonText: { color: COLOR_WHITE, fontSize: '18px', fontWeight: 700 },
};

export default CreateProfileScreen;