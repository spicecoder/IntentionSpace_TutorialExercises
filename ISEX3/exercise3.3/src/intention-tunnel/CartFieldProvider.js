import { useState } from "react";
import { FieldContext } from "./FieldContext";

const initialField = {
  pulses: {
    cart_items: [],
    cart_count: 0,
    cart_total: 0
  }
};

export function CartFieldProvider({ children }) {
  const [field, setField] = useState(initialField);

  const emit = (intention) => {
    if (intention.type !== "INT_ADD_TO_CART") return;

    setField(prev => {
      const newItems = [...prev.pulses.cart_items, intention.signal];

      return {
        pulses: {
          cart_items: newItems,
          cart_count: newItems.length,
          cart_total: newItems.reduce((s, i) => s + i.price, 0)
        }
      };
    });
  };

  return (
    <FieldContext.Provider value={{ field, emit }}>
      {children}
    </FieldContext.Provider>
  );
}
