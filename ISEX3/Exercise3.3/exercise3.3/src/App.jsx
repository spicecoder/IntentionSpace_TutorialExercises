import { ProductCard } from './components/ProductCard';
import { CartIcon } from './components/CartIcon';
import { CartPanel } from './components/CartPanel';
import { CheckoutButton } from './components/CheckoutButton';

export function App() {
  return (
    <>
      <ProductCard />
      <CartIcon />
      <CartPanel />
      <CheckoutButton />
    </>
  );
}
