import { useContext } from 'react';
import { FieldContext } from '../field/FieldContext';

export function ProductCard() {
  const { emit } = useContext(FieldContext);

  return (
    <button
      onClick={() =>
        emit('ADD_TO_CART', { name: 'Apple', price: 10 })
      }
    >
      Add Apple 🍎
    </button>
  );
}
