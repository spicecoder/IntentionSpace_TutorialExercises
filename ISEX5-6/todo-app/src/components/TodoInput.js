import React, { useState } from 'react';
import { useIntentionTunnel } from '../hooks/useIntentionTunnel';

function TodoInput() {
  const { emit } = useIntentionTunnel();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    emit('INT_ADD_TODO', { text });
    setText('');
  };

  return (
    <div className="app">
          <h1>To Do List</h1>

    <div style={{ display: 'flex', gap: 10 }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter todo"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
    
    </div>
  );
}

export default TodoInput;
