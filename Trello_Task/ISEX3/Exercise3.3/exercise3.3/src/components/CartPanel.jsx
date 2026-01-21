import { useFieldPulse } from '../field/useFieldPulse';

export function CartPanel() {
  const items = useFieldPulse('cart_items');
  console.log('CartPanel render');

  return (
    <ul>
      {items.map((i, idx) => (
        <li key={idx}>{i.name}</li>
      ))}
    </ul>
  );
}
