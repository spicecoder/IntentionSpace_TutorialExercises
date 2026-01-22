import React, { useState } from 'react';
import { useIntentionTunnel } from '../hooks/useIntentionTunnel';

function TodoInput() {
  const { emit } = useIntentionTunnel();
  const [text, setText] = useState('');

  const addTodo = () => {
    if (!text.trim()) return;
    emit('INT_ADD_TODO', { text: text.trim() });
    setText('');
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        placeholder="Add todo..."
        style={{ flex: 1, padding: 8 }}
      />
      <button onClick={addTodo}>Add</button>
    </div>
  );
}

export default TodoInput;
