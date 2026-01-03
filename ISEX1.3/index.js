const { createShoppingCartSignal } = require("./Signal/CreateSignal");
const { calculateTotal } = require("./CalculateTotal/total_calculations");
const { validateEntireSignal } = require("./ValidateSignal/validate_Entire_Signal");

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