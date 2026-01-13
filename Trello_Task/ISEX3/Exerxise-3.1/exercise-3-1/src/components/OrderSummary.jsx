import { useField } from "../field/FieldContext";

export default function OrderSummary() {
  const { field } = useField();

  return (
    <div>
      <h3>Order Summary</h3>
      {field.pulses.order.map((item, i) => (
        <p key={i}>{item.name}</p>
      ))}
    </div>
  );
}
