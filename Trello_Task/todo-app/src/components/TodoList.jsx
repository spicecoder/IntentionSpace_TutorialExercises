import React from 'react';
import { useFieldPulse } from '../hooks/useIntentionTunnel';

function TodoList() {
  const todosJson = useFieldPulse('todos');
  const count = useFieldPulse('todo_count');

  const todos = todosJson ? JSON.parse(todosJson) : [];

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Todos ({count || 0})</h3>
      <ul>
        {todos.map(t => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
