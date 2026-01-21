import React, { createContext, useContext, useState } from "react";

const FieldContext = createContext();

export function FieldProvider({ children }) {
  const [field, setField] = useState({
    pulses: {
      selectedDish: null,
      searchQuery: "",
      order: []
    },
    intentions: {},
    lastUpdated: Date.now()
  });

  const updateField = (pulseKey, value, intentionId) => {
    setField(prev => ({
      ...prev,
      pulses: {
        ...prev.pulses,
        [pulseKey]: value
      },
      intentions: {
        ...prev.intentions,
        [intentionId]: {
          id: intentionId,
          timestamp: Date.now()
        }
      },
      lastUpdated: Date.now()
    }));
  };

  return (
    <FieldContext.Provider value={{ field, updateField }}>
      {children}
    </FieldContext.Provider>
  );
}

export const useField = () => useContext(FieldContext);
