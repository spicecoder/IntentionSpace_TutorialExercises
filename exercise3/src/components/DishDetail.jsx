import { useField } from "../field/FieldContext";

export default function DishDetails() {
   const { field, updateField } = useField();
   const dish = field.pulses.selectedDish;

  if (!dish) return <p>Select a dish</p>;

  return (
    <div>
      <h3>Dish Detail</h3>
      <p>{dish.name}</p>
      <button
        onClick={() =>
          updateField("order", [dish], "INT_CREATE_ORDER")
        }
      >
        Create Order
      </button>
    </div>
  );
}