import { useFieldPulse } from '../field/useFieldPulse';

export function CartIcon() {
  const count = useFieldPulse('cart_count');
  console.log('CartIcon render');

  return <div>🛒 Items: {count}</div>;
}
