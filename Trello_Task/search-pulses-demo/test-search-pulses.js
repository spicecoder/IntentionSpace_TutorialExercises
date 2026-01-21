const {
  isSimplePulse,
  isStructuredPulse,
  getSimpleValue,
  getFieldValue,
  toObject
} = require("./pulse-helpers");

const {
  searchCriteria,
  searchDishes,
  searchResult
} = require("./search-pulses");


console.log("Is structured?", isStructuredPulse(searchCriteria));
console.log("Dish name:", getFieldValue(searchCriteria, "name"));
console.log("Max price:", getFieldValue(searchCriteria, "max_price"));
console.log("As object:", toObject(searchCriteria));


console.log("Is simple?", isSimplePulse(searchDishes));
console.log("Action:", getSimpleValue(searchDishes));
console.log("Trivalence:", searchDishes.trivalence);


console.log("Is structured?", isStructuredPulse(searchResult));
console.log("Result placeholder:", searchResult.responses);
