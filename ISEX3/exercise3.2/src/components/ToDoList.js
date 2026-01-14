import { useContext } from "react";
import { FieldContext } from "../intention-tunnel";


export default function ToDoList() {
  const { field } = useContext(FieldContext);

  const todos = JSON.parse(
    field.pulses.todos.responses[0]
  );

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id}>📝 {t.text}</li>
      ))}
    </ul>
  );
}
