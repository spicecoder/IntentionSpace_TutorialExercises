import { useFieldPulse } from "../intention-tunnel/useFieldPulse";

export default function CheckButton() {
  const total = useFieldPulse("cart_total");
  return <button>Checkout ₹{total}</button>;
}
