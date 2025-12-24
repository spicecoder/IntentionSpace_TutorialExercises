// Scenario

// User selects a food item
// We want to represent:

// what the user selected

// whether it can be changed

// how the system reads it (without if-else logic)


// PULSE DEFINITIONS

// Simple Pulse: user login status
const userLoggedIn = {
  prompt: "user_logged_in",
  responses: ["yes"],
  trivalence: "N" // Read-only (system decided)
};

// Structured Pulse: selected dish
const dishSelected = {
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "chef"],
    ["Vegetable Biryani", "12.99", "Kumar"]
  ],
  trivalence: "Y" // User can change
};

// ================================
// HELPER FUNCTIONS
// ================================

function isSimplePulse(pulse) {
  return pulse.responses.length === 1 &&
         !Array.isArray(pulse.responses[0]);
}

function isStructuredPulse(pulse) {
  return Array.isArray(pulse.responses[0]) &&
         pulse.responses[0][0] === "META";
}

function getSimpleValue(pulse) {
  return pulse.responses[0];
}

function toObject(pulse) {
  const meta = pulse.responses[0].slice(1);
  const data = pulse.responses[1];

  const obj = {};
  meta.forEach((field, index) => {
    obj[field] = data[index];
  });

  return obj;
}

// ================================
// USING THE PULSES
// ================================

console.log("Is userLoggedIn simple?", isSimplePulse(userLoggedIn));
console.log("Login state:", getSimpleValue(userLoggedIn));

console.log("\nIs dishSelected structured?", isStructuredPulse(dishSelected));
const dishObject = toObject(dishSelected);
console.log("Dish details:", dishObject);
