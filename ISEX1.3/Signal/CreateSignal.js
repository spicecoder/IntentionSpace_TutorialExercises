function createShoppingCartSignal() {
  const item1 = {
    prompt: "cart_item_1",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Biryani", "$12.99", "2"]
    ],
    trivalence: "Y"
  };

  const item2 = {
    prompt: "cart_item_2",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Naan", "$2.99", "4"]
    ],
    trivalence: "Y"
  };

  const item3 = {
    prompt: "cart_item_3",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Curry", "$10.99", "1"]
    ],
    trivalence: "Y"
  };

  return {
    pulses: [item1, item2, item3],
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  createShoppingCartSignal
};