import { useContext } from "react";
import { FieldContext } from "../intention-tunnel";


export default function ToDoStats() {
  const { field } = useContext(FieldContext);

  return (
    <div>
      {field.pulses.todo_count.responses[0]} total,
      {field.pulses.active_count.responses[0]} active
    </div>
  );
}
