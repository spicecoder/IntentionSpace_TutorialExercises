import { useState } from "react";
import { FieldContext } from "./FieldContext";

const initialField = {
  pulses: {
    todos: {
      prompt: "todos",
      responses: ["[]"],
      trivalence: "N"
    }
  },
  intentions: {},
  lastUpdated: Date.now()
};

export function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState(initialField);

  return (
    <FieldContext.Provider value={{ field, setField }}>
      {children}
    </FieldContext.Provider>
  );
}
