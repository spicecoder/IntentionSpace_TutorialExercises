const {
  isSimplePulse,
  isStructuredPulse,
  getSimpleValue,
  getFieldValue,
  toObject
} = require("./pulse-helpers");

const {
  selectedDishes,
  createOrder,
  orderState
} = require("./order-pulses");

console.log("=== SELECTED DISHES ===");
console.log("Is structured?", isStructuredPulse(selectedDishes));
console.log("Dish name:", getFieldValue(selectedDishes, "name"));
console.log("Quantity:", getFieldValue(selectedDishes, "quantity"));
console.log("As object:", toObject(selectedDishes));

console.log("\n=== CREATE ORDER ===");
console.log("Is simple?", isSimplePulse(createOrder));
console.log("Action:", getSimpleValue(createOrder));
console.log("Trivalence:", createOrder.trivalence);

console.log("\n=== ORDER STATE ===");
console.log("Is simple?", isSimplePulse(orderState));
console.log("State:", getSimpleValue(orderState));
