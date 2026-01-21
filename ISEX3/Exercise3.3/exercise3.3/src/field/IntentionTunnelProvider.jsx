import { useState } from 'react';
import { FieldContext } from './FieldContext';

export function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState({
    pulses: {
      cart_items: [],
      cart_count: 0,
      cart_total: 0
    }
  });

  const emit = (type, payload) => {
    if (type === 'ADD_TO_CART') {
      const newItems = [...field.pulses.cart_items, payload];
      const newCount = newItems.length;
      const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);

      setField({
        pulses: {
          cart_items: newItems,
          cart_count: newCount,
          cart_total: newTotal
        }
      });
    }
  };

  return (
    <FieldContext.Provider value={{ field, emit }}>
      {children}
    </FieldContext.Provider>
  );
}
