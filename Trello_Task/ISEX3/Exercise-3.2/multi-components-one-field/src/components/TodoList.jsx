import { useFieldPulse } from "../field/useFieldPulse";
import { useIntentionTunnel } from "../field/useIntentionTunnel";

export function TodoList() {
  const todos = JSON.parse(useFieldPulse("todos") || "[]");
  const { emit } = useIntentionTunnel();

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => emit("INT_TOGGLE_TODO", { id: todo.id })}
          />
          {todo.done ? "✅ " : "📝 "}
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
