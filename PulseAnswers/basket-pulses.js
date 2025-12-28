//Pulse 1: Dish selected to add (user-controlled)
const dishToAdd = {
  prompt: "dish_to_add",
  responses: [
    ["META", "dish_id", "name", "price", "quantity"],
    ["D101", "Vegetable Biryani", "12.99", "1"]
  ],
  trivalence: "Y"
};
// Pulse 2: Add-to-basket intention (action)
const addToBasket = {
  prompt: "add_to_basket",
  responses: ["add"],
  trivalence: "UN"
};
// Pulse 3: Basket state (system-owned)
const basketState = {
  prompt: "basket_state",
  responses: [
    ["META", "total_items", "total_price"],
    []
  ],
  trivalence: "N"
};
module.exports = {
  dishToAdd,
  addToBasket,
  basketState
};