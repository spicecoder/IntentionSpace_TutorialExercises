import { useContext } from "react";
import { FieldContext } from "../intention-tunnel";

export default function TodoList() {
  const { field } = useContext(FieldContext);

  const todos = JSON.parse(
    field.pulses.todos.responses[0]
  );

  return (
    <div>
      <h3>Todos from Field</h3>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
