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
    <div>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default TodoInput;
