import React from 'react';
import { IntentionTunnelProvider } from './hooks/useIntentionTunnel';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

 function App() {
  console.log('Provider:', IntentionTunnelProvider);
  console.log('TodoInput:', TodoInput);
  console.log('TodoList:', TodoList);

  return (
    <IntentionTunnelProvider>
      <TodoInput />
      <TodoList />
    </IntentionTunnelProvider>
  );
}
export default App;
