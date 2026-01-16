import { CartFieldProvider } from "./intention-tunnel/CartFieldProvider";
import ProductCard from "./components/ProductCard";
import CartIcon from "./components/CartIcon";
import CartPanel from "./components/CartPanel";
import CheckButton from "./components/CheckButton";

export default function App() {
  return (
    <CartFieldProvider>
    
      <h1>Shopping Cart – Field Demo</h1>
      <ProductCard />
      <CartIcon />
      <CartPanel />
      <CheckButton />
    
    </CartFieldProvider>
  );
}
