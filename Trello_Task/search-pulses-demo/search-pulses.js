// Pulse 1: Search criteria (user-editable)
const searchCriteria = {
  prompt: "search_criteria",
  responses: [
    ["META", "name", "max_price", "category", "is_veg"],
    ["Biryani", "15", "Main Course", "true"]
  ],
  trivalence: "Y"
};

// Pulse 2: Search intent (action)
const searchDishes = {
  prompt: "search_dishes",
  responses: ["search"],
  trivalence: "UN"
};

// Pulse 3: Search result placeholder (system-owned)
const searchResult = {
  prompt: "search_result",
  responses: [
    ["META", "dish_id", "name", "price", "category"],
    []
  ],
  trivalence: "N"
};

module.exports = {
  searchCriteria,
  searchDishes,
  searchResult
};
