import { useField } from "../field/FieldContext";

const dishes = [
  { id: 1, name: "Biryani" },
  { id: 2, name: "Pizza" },
  { id: 3, name: "Pasta" }
];

export default function DishList() {
  const { field, updateField } = useField();
  const { searchQuery } = field.pulses;

  const filtered = dishes.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3>Dishes</h3>
      {filtered.map(dish => (
        <button
          key={dish.id}
          onClick={() =>
            updateField("selectedDish", dish, "INT_SELECT_DISH")
          }
        >
          {dish.name}
        </button>
      ))}
    </div>
  );
}