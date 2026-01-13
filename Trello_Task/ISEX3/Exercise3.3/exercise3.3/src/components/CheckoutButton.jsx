import { useFieldPulse } from '../field/useFieldPulse';

export function CheckoutButton() {
  const total = useFieldPulse('cart_total');
  console.log('CheckoutButton render');

  return <button>Checkout ₹{total}</button>;
}
