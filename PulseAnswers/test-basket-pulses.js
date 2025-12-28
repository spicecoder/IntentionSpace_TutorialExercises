const {
  isSimplePulse,
  isStructuredPulse,
  getSimpleValue,
  getFieldValue,
  toObject
} = require("../PulseExercise/pulse-helpers");
const {
  dishToAdd,
  addToBasket,
  basketState
} = require("./basket-pulses");
console.log("=== DISH TO ADD ===");
console.log("Is structured?", isStructuredPulse(dishToAdd));
console.log("Dish name:", getFieldValue(dishToAdd, "name"));
console.log("Quantity:", getFieldValue(dishToAdd, "quantity"));
console.log("As object:", toObject(dishToAdd));
console.log("\n=== ADD TO BASKET ACTION ===");
console.log("Is simple?", isSimplePulse(addToBasket));
console.log("Action:", getSimpleValue(addToBasket));
console.log("Trivalence:", addToBasket.trivalence);
console.log("\n=== BASKET STATE ===");
console.log("Is structured?", isStructuredPulse(basketState));
console.log("Basket placeholder:", basketState.responses);