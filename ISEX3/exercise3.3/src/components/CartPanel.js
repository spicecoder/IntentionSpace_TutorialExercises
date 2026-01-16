import { useFieldPulse } from "../intention-tunnel/useFieldPulse";

export default function CartPanel() {
  const items = useFieldPulse("cart_items") ;
   if (!items || items.length === 0) {
    return <p>Cart is empty</p>;
  }
  return (
    <div>
      <h4>Cart Items-Price</h4>
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} - ₹{item.price}
        </li>
      ))}
    </ul>
    </div>
  );
}
