import { FieldProvider } from "./field/FieldContext";
import SearchBar from "./components/SearchBar";
import DishList from "./components/DishList";
import DishDetail from "./components/DishDetail";
import OrderSummary from "./components/OrderSummary";

export default function App() {
  return (
    <FieldProvider>
      <h2>Exercise 3.1 – IntentionSpace Field</h2>
      <SearchBar />
      <DishList />
      <DishDetail/>
      <OrderSummary />
    </FieldProvider>
  );
}
