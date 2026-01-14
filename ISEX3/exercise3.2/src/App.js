import { ToDoFieldProvider } from "./intention-tunnel/ToDoFieldProvider";
import ToDoList from "./components/ToDoList";
import ToDoInput from "./components/ToDoInput";
import ToDoStats from "./components/ToDoStats";


export default function App() {
  return (
    <ToDoFieldProvider>
      <div>
      <h1>Intention Tunnel – Multiple components Field Demo</h1>
      <ToDoInput />
      <ToDoList />
      <ToDoStats />
      </div>
    </ToDoFieldProvider>
  );
}
