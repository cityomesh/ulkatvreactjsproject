import React, { useState, forwardRef } from "react";

const COLOR_FOCUS = "#e1001eff";
const COLOR_WHITE = "#ffffff";

const ALPHA_LAYOUT = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["CAPS","z","x","c","v","b","n","m","BACK"],
  ["@#$",".","SPACE","ENTER"]
];

const SYMBOL_LAYOUT = [
  ["!","@","#","$","%","^","&","*","(",")"],
  ["_","+","=","-","/","?","~","`","|","\\"],
  ["[","]","{","}","<",">",":",";","'"],
  ["CAPS",",","\"","€","₹","¥","£","•","BACK"],
  ["ABC",".","SPACE","ENTER"]
];

const CustomKeyboard = forwardRef(
({ onKeyPress, focusedPos, isKeyboardFocused }, ref) => {

  const [isSymbol, setIsSymbol] = useState(false);

  const layout = isSymbol ? SYMBOL_LAYOUT : ALPHA_LAYOUT;

  const resolveKeyLabel = (key) => {
    if (["CAPS","BACK","SPACE","ENTER","@#$","ABC"].includes(key)) {
      return key;
    }
    return isCaps ? key.toUpperCase() : key.toLowerCase();
  };

  const handleKeyAction = (key) => {
    switch (key) {
      case "CAPS":
        setIsCaps(p => !p);
        break;

      case "@#$":
        setIsSymbol(true);
        break;

      case "ABC":
        setIsSymbol(false);
        break;

      case "SPACE":
        onKeyPress(" ");
        break;

      case "BACK":
        onKeyPress("backspace");
        break;

      case "ENTER":
        onKeyPress("enter");
        break;

      default:
        onKeyPress(resolveKeyLabel(key));
    }
  };

  return (
    <div style={{
      width: "900px",
      padding: "20px",
      backgroundColor: "rgba(20,20,20,0.95)",
      borderRadius: "15px",
      border: "1px solid #333"
    }}>
      {layout.map((row, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "10px"
          }}
        >
          {row.map((key, cIdx) => {
            const focused =
              isKeyboardFocused &&
              focusedPos.row === rIdx &&
              focusedPos.col === cIdx;

            return (
              <div
                key={key}
                onClick={() => handleKeyAction(key)}
                style={{
                  flex:
                    key === "SPACE" ? 4 :
                    key === "ENTER" || key === "CAPS" ? 1.5 : 1,
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? COLOR_FOCUS : "#333",
                  color: COLOR_WHITE,
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "18px",
                  border: focused ? "3px solid white" : "1px solid transparent",
                  transform: focused ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.1s",
                  cursor: "pointer"
                }}
              >
                {key === "BACK" ? "⌫" : resolveKeyLabel(key)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default CustomKeyboard;
