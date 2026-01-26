import React from 'react';
import { useFieldPulse } from '../hooks/useIntentionTunnel';

function TodoList() {
 const todos = useFieldPulse('todos') || [];
  const todosCount = useFieldPulse('todo_count') || 0;
  return (
    <>
      <p>Total: {todosCount}</p>
      <ul>
        {todos.map(t => <li key={t.id}>{t.text}</li>)}
      </ul>
    </>
  );
}
export default TodoList;