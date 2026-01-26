// App.jsx
import { FieldProvider } from "./Context/FieldContext";
import AddTodo from "./components/AddTodo";
import TodoReflector from "./components/TodoReflector";
import TodoManager from "./components/TodoManager";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <FieldProvider>
      <AddTodo />
      <TodoReflector />  {/* O */}
      <TodoManager />    {/* DN */}
      <TodoList />
    </FieldProvider>
  );
}
