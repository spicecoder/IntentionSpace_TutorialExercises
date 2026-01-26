// FieldContext.jsx
import { createContext, useContext, useState } from "react";

const FieldContext = createContext(null);

export function FieldProvider({ children }) {
  const [FIS, setFIS] = useState(null); // intention
  const [FPS, setFPS] = useState({});   // pulses

  function emit(intention, pulses = {}) {
    setFIS(intention);
    setFPS(pulses);
  }

  function clearIntention() {
    setFIS(null);
  }

  return (
    <FieldContext.Provider value={{ FIS, FPS, emit, clearIntention }}>
      {children}
    </FieldContext.Provider>
  );
}

export function useField() {
  return useContext(FieldContext);
}
