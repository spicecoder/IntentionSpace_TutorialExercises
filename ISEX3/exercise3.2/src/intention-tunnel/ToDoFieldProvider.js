import { useState } from "react";
import { FieldContext } from "./FieldContext";

const initialField = {
  pulses: {
    todos: {
      prompt: "todos",
      responses: ["[]"],
      trivalence: "N"
    },
    todo_count: {
      prompt: "todo_count",
      responses: ["0"],
      trivalence: "N"
    },
    active_count: {
      prompt: "active_count",
      responses: ["0"],
      trivalence: "N"
    }
  },
  lastUpdated: Date.now()
};

export function ToDoFieldProvider({ children }) {
  const [field, setField] = useState(initialField);

  const emit = (intention) => {
    if (intention.type !== "INT_ADD_TODO") return;

    setField(prev => {
      const todos = JSON.parse(
        prev.pulses.todos.responses[0]
      );

      const newTodo = {
        id: Date.now(),
        text: intention.signal.text,
        done: false
      };

      const updated = [...todos, newTodo];

      return {
        ...prev,
        pulses: {
          todos: {
            ...prev.pulses.todos,
            responses: [JSON.stringify(updated)],
            trivalence: "Y"
          },
          todo_count: {
            ...prev.pulses.todo_count,
            responses: [String(updated.length)],
            trivalence: "Y"
          },
          active_count: {
            ...prev.pulses.active_count,
            responses: [
              String(updated.filter(t => !t.done).length)
            ],
            trivalence: "Y"
          }
        },
        lastUpdated: Date.now()
      };
    });
  };

  return (
    <FieldContext.Provider value={{ field, emit }}>
      {children}
    </FieldContext.Provider>
  );
}
