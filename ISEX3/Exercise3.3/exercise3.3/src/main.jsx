import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { IntentionTunnelProvider } from './field/IntentionTunnelProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <IntentionTunnelProvider>
    <App />
  </IntentionTunnelProvider>
);
