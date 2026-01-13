import ToDoList from "./components/TODoList";
import { IntentionTunnelProvider } from "./intention-tunnel";

export default function App() {
  return (
    <IntentionTunnelProvider>
    <div>
      <h1>Intention Tunnel – Field Demo</h1>
      <ToDoList />
    </div>
    </IntentionTunnelProvider>
  );
}