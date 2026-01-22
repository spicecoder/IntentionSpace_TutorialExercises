import { useFieldPulse } from "../intention-tunnel/useFieldPulse";

export default function CartIcon() {
  const count = useFieldPulse("cart_count");
  return <div>🛒cart items: {count}</div>;
}
