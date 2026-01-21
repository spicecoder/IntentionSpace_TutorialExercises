const { createShoppingCartSignal } = require("./signals/shopping-cart-signal");
const { calculateTotal } = require("./calculations/calculate-total");
const { validateEntireSignal } = require("./validation/validate-entire-signal");

console.log("🚀 Running Challenge 1.3");

// Create Signal
const cartSignal = createShoppingCartSignal();
console.log("🛒 Cart has", cartSignal.pulses.length, "items");

// Calculate total
const total = calculateTotal(cartSignal);
console.log("💰 Cart total: $", total);

// Validate signal
const summary = validateEntireSignal(cartSignal);
console.log("📊 Validation summary:", summary);
