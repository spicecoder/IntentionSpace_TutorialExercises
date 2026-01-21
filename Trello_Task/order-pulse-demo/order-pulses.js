// Pulse 1: Selected dishes (editable data)
const selectedDishes = {
  prompt: "selected_dishes",
  responses: [
    ["META", "dish_id", "name", "price", "quantity"],
    ["D1", "Veg Biryani", "12.99", "2"]
  ],
  trivalence: "Y"
};

// Pulse 2: Order creation intent (action)
const createOrder = {
  prompt: "create_order",
  responses: ["create"],
  trivalence: "UN"
};

// Pulse 3: Order state (system-known fact)
const orderState = {
  prompt: "order_state",
  responses: ["not_created"],
  trivalence: "N"
};

module.exports = {
  selectedDishes,
  createOrder,
  orderState
};
