import { useContext } from "react";
import { FieldContext } from "../intention-tunnel";

export default function TodoList() {
  const { field } = useContext(FieldContext);

  const todos =
    field.pulses["todos"]?.responses[0] ?? "[]";

  return (
    <div>
      <h3>Todos from Field</h3>
      <pre>{todos}</pre>
    </div>
  );
}
