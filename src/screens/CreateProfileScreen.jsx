// src/components/CreateProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import CustomKeyboard from '../components/CustomKeyboard';
import {
  COLOR_FOCUS,
  COLOR_WHITE,
  COLOR_BLACK,
  LOGO_ULKA,
  CREATE_BG_IMAGES,
  KEYBOARD_LAYOUT,
  SYMBOL_LAYOUT
} from '../constants';

// --- IMAGE SLIDER ---
const ImageSlider = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % CREATE_BG_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={styles.rightContainer}>
      {CREATE_BG_IMAGES.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`bg-${idx}`}
          style={{
            ...styles.animatedImage,
            opacity: idx === index ? 1 : 0,
            transition: 'opacity 1.5s'
          }}
        />
      ))}
      <div style={styles.rightOverlay} />
    </div>
  );
};

// --- CREATE PROFILE SCREEN ---
const CreateProfileScreen = ({ username, onGoBack, onSaveProfile }) => {
  const [name, setName] = useState(username || '');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState(null);

  const [focusKey, setFocusKey] = useState('name');
  const [kbPos, setKbPos] = useState({ row:0, col:0 });
  const [isCaps, setIsCaps] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false); // toggle symbol layout

  const currentLayout = isSymbol ? SYMBOL_LAYOUT : KEYBOARD_LAYOUT;

  // --- HANDLE REMOTE NAVIGATION ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if(isKeyboardVisible){
        // Keyboard navigation
        if(e.key==='ArrowUp'){
          setKbPos(p => ({ row: Math.max(0, p.row-1), col: Math.min(p.col, currentLayout[Math.max(0,p.row-1)].length-1) }));
        } else if(e.key==='ArrowDown'){
          setKbPos(p => ({ row: Math.min(currentLayout.length-1, p.row+1), col: Math.min(p.col, currentLayout[Math.min(currentLayout.length-1,p.row+1)].length-1) }));
        } else if(e.key==='ArrowLeft'){
          setKbPos(p => ({ ...p, col: Math.max(0,p.col-1) }));
        } else if(e.key==='ArrowRight'){
          setKbPos(p => ({ ...p, col: Math.min(currentLayout[p.row].length-1, p.col+1) }));
        } else if(e.key==='Enter'){
          handleKeyboardEnter();
        }
        return;
      }

      // Field navigation
      switch(e.key){
        case 'ArrowDown':
          if(focusKey==='name') setFocusKey('age');
          else if(focusKey==='age') setFocusKey('gender_male');
          else if(focusKey==='gender_male'||focusKey==='gender_female') setFocusKey('phone');
          else if(focusKey==='phone') setFocusKey('save');
          else if(focusKey==='save'||focusKey==='cancel') setFocusKey('name');
          break;
        case 'ArrowUp':
          if(focusKey==='age') setFocusKey('name');
          else if(focusKey==='gender_male'||focusKey==='gender_female') setFocusKey('age');
          else if(focusKey==='phone') setFocusKey('gender_male');
          else if(focusKey==='save'||focusKey==='cancel') setFocusKey('phone');
          break;
        case 'ArrowLeft':
          if(focusKey==='gender_female') setFocusKey('gender_male');
          else if(focusKey==='cancel') setFocusKey('save');
          break;
        case 'ArrowRight':
          if(focusKey==='gender_male') setFocusKey('gender_female');
          else if(focusKey==='save') setFocusKey('cancel');
          break;
        case 'Enter':
          if(focusKey==='name'||focusKey==='age'||focusKey==='phone'){
            setKeyboardVisible(true);
            setKbPos({ row:0, col:0 });
          } else if(focusKey==='gender_male') setGender('Male');
          else if(focusKey==='gender_female') setGender('Female');
          else if(focusKey==='save') handleSave();
          else if(focusKey==='cancel') onGoBack();
          break;
        case 'Backspace':
          if(focusKey==='name') setName(name.slice(0,-1));
          if(focusKey==='age') setAge(age.slice(0,-1));
          if(focusKey==='phone') setPhone(phone.slice(0,-1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return ()=> window.removeEventListener('keydown', handleKeyDown);
  }, [focusKey, name, age, phone, gender, kbPos, isKeyboardVisible, isSymbol]);

  const handleKeyboardEnter = () => {
    const key = currentLayout[kbPos.row][kbPos.col];

    if(key==='BACK'){
      if(focusKey==='name') setName(name.slice(0,-1));
      if(focusKey==='age') setAge(age.slice(0,-1));
      if(focusKey==='phone') setPhone(phone.slice(0,-1));
    } else if(key==='SPACE'){
      if(focusKey==='name') setName(name+' ');
      if(focusKey==='age') setAge(age+' ');
      if(focusKey==='phone') setPhone(phone+' ');
    } else if(key==='ENTER'){
      setKeyboardVisible(false);
    } else if(key==='CAPS'){
      setIsCaps(!isCaps);
    } else if(key==='@#$'){
      setIsSymbol(true);
      setKbPos({ row:0, col:0 });
    } else if(key==='ABC'){
      setIsSymbol(false);
      setKbPos({ row:0, col:0 });
    } else {
      const char = isCaps && !isSymbol ? key.toUpperCase() : key;
      if(focusKey==='name') setName(name+char);
      if(focusKey==='age') setAge(age+char);
      if(focusKey==='phone') setPhone(phone+char);
    }
  }

  const handleSave = () => {
    if(!name.trim()){ alert('Please enter a name'); return;}
    onSaveProfile({ id: Date.now().toString(), name, age, gender, phone });
    onGoBack();
  }

  return (
    <div style={styles.container}>
      <div style={styles.leftCard}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Create a New Profile</h2>

          {/* Inputs */}
          <div style={{...styles.inputWrapper, ...(focusKey==='name'?styles.focusedInput:{})}}>
            <input style={styles.inputText} placeholder="Name" value={name} readOnly />
          </div>
          <div style={{...styles.inputWrapper, ...(focusKey==='age'?styles.focusedInput:{})}}>
            <input style={styles.inputText} placeholder="Age" value={age} readOnly />
          </div>
          <div style={styles.genderContainer}>
            <button style={{...styles.genderButton, ...(gender==='Male'?styles.genderSelected:{}), ...(focusKey==='gender_male'?styles.focusedInput:{})}}>Male</button>
            <button style={{...styles.genderButton, ...(gender==='Female'?styles.genderSelected:{}), ...(focusKey==='gender_female'?styles.focusedInput:{})}}>Female</button>
          </div>
          <div style={{...styles.inputWrapper, ...(focusKey==='phone'?styles.focusedInput:{})}}>
            <input style={styles.inputText} placeholder="Phone" value={phone} readOnly />
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button style={{...styles.button, ...styles.saveButton, ...(focusKey==='save'?styles.focusedInput:{})}} onClick={handleSave}>Save</button>
            <button style={{...styles.button, ...styles.cancelButton, ...(focusKey==='cancel'?styles.focusedInput:{})}} onClick={onGoBack}>Cancel</button>
          </div>

          <img src={LOGO_ULKA} alt="Logo" style={{ width:300, marginTop:40, opacity:0.6 }} />

          {isKeyboardVisible && (
            <CustomKeyboard 
              layout={currentLayout} 
              isCaps={isCaps} 
              focusedPos={kbPos} 
              isKeyboardFocused={true} 
            />
          )}
        </div>
      </div>
      <ImageSlider />
    </div>
  );
};

const styles = {
  container:{ 
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    backgroundColor: COLOR_BLACK
  },
  leftCard: { 
    width: '30%',
    minWidth: '360px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: 'rgba(0,0,0,0.92)'
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  },
  rightContainer: {
    width: '70%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  animatedImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  rightOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: COLOR_WHITE,
    marginBottom: 30
  },
  inputWrapper: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#888',
    borderWidth: 2,
    borderRadius: 8,
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
    transition: 'all 0.3s'
  },
  inputText: {
    flex: 1,
    color: COLOR_WHITE,
    fontSize: 16,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none'
  },
  focusedInput: {
    borderColor: COLOR_FOCUS,
    transform: 'scale(1.03)',
    boxShadow: '0 0 15px rgba(0,168,225,0.7)'
  },
  genderContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  genderButton: {
    width: '48%',
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  genderSelected: {
    backgroundColor: COLOR_FOCUS,
    borderColor: COLOR_FOCUS
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20
  },
  button: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  saveButton: {
    backgroundColor: '#27ae60'
  },
  cancelButton: {
    backgroundColor: '#c0392b'
  },
};

export default CreateProfileScreen;
