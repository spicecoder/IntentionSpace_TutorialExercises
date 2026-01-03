// select-dish-structured-history.js

const { getFieldValue } = require("./pulse-helpers");
const { selectDishWithDetails } = require("./selectdish-design-node");

const history = [];

// -----------------------------
// T0 – nothing selected
// -----------------------------
let dishPulse = {
  prompt: "dish_selected",
  responses: [["META"], []],
  trivalence: "U"
};

history.push({
  time: "T0",
  action: "initial",
  pulse: dishPulse
});

// -----------------------------
// T1 – user selects a dish
// -----------------------------
dishPulse = selectDishWithDetails(dishPulse, {
  dishId: "D101",
  dishName: "Paneer Butter Masala",
  price: 180
});

history.push({
  time: "T1",
  action: "select dish",
  pulse: dishPulse
});

// -----------------------------
// View details (reaction)
// -----------------------------
console.log("=== Dish Selection History ===");

history.forEach(entry => {
  const name =  getFieldValue(entry.pulse, "dishName");
  const price = getFieldValue(entry.pulse, "price");

  console.log(
    `${entry.time}: ${entry.action} → ${
      name ? `${name} (₹${price})` : "none"
    }`
  );
});
