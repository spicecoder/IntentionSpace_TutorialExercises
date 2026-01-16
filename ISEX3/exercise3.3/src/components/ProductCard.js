import { useContext } from 'react';
import { FieldContext } from '../intention-tunnel/FieldContext';


export default function ProductCard() {
  const { emit } = useContext(FieldContext)

  const addToCart = () => {
    emit({
      type: "INT_ADD_TO_CART",
      signal: {
        id: Date.now(),
        name: "Biryani",
        price: 15
      }
    });
  };

  return <button onClick={addToCart}>Add to Cart</button>;
}
