import { useState } from "react";
import { FieldContext } from "./FieldContext";

export function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState({
    pulses: {
      todos: {
        responses: ["[]"],
      },
      todo_count: {
        responses: ["0"],
      },
      active_count: {
        responses: ["0"],
      },
      done_count: {
        responses: ["0"],
      },
    },
  });

  // Simplified "Object + DN" logic
  const emit = (type, payload) => {
    if (type === "INT_ADD_TODO") {
      const todos = JSON.parse(field.pulses.todos.responses[0]);

      const newTodo = {
        id: Date.now(),
        text: payload.text,
        done: false,
      };

      const updatedTodos = [...todos, newTodo];

      const active = updatedTodos.filter(t => !t.done).length;
      const done = updatedTodos.filter(t => t.done).length;

      setField({
        pulses: {
          todos: { responses: [JSON.stringify(updatedTodos)] },
          todo_count: { responses: [String(updatedTodos.length)] },
          active_count: { responses: [String(active)] },
          done_count: { responses: [String(done)] },
        },
      });
    }

    if (type === "INT_TOGGLE_TODO") {
      const todos = JSON.parse(field.pulses.todos.responses[0]);

      const updatedTodos = todos.map(todo =>
        todo.id === payload.id
          ? { ...todo, done: !todo.done }
          : todo
      );

      const active = updatedTodos.filter(t => !t.done).length;
      const done = updatedTodos.filter(t => t.done).length;

      setField({
        pulses: {
          todos: { responses: [JSON.stringify(updatedTodos)] },
          todo_count: { responses: [String(updatedTodos.length)] },
          active_count: { responses: [String(active)] },
          done_count: { responses: [String(done)] },
        },
      });
    }
  };

  return (
    <FieldContext.Provider value={{ field, emit }}>
      {children}
    </FieldContext.Provider>
  );
}
