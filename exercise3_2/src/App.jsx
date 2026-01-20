import { IntentionTunnelProvider } from "./field/IntentionTunnelProvider";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { TodoStats } from "./components/TodoStats";

export default function App() {
  return (
    <IntentionTunnelProvider>
      <h2>Exercise 3.2 – One Field, Many Components</h2>
      <TodoInput />
      <TodoList />
      <TodoStats />
    </IntentionTunnelProvider>
  );
}