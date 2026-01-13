import { useState } from "react";
import { FieldContext } from "./FieldContext";

export function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState({
    pulses: {},
    intentions: {},
    lastUpdated: Date.now()
  });

  return (
    <FieldContext.Provider value={{ field, setField }}>
      {children}
    </FieldContext.Provider>
  );
}
