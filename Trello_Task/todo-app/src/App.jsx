import React from 'react';
import { IntentionTunnelProvider } from './hooks/useIntentionTunnel';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <IntentionTunnelProvider>
      <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial' }}>
        <h1>Todo App</h1>
        <p style={{ color: '#666' }}>Built with Intention Tunnel</p>
        <TodoInput />
        <TodoList />
        <p style={{ fontSize: 12, color: '#999' }}>
          Open DevTools console to observe CPUX flow
        </p>
      </div>
    </IntentionTunnelProvider>
  );
}

export default App;
