const { isStructuredPulse, getSimpleValue } = require("./pulse-helpers");

function selectDishWithDetails(pulse, dishDetails) {
  if (!pulse || pulse.prompt !== "dish_selected") {
    throw new Error("Invalid dish selection pulse");
  }

  return {
    prompt: "dish_selected",
    responses: [
      ["META", "dishId", "dishName", "price"],
      [
        dishDetails.dishId,
        dishDetails.dishName,
        String(dishDetails.price)
      ]
    ],
    trivalence: "Y"
  };
}

module.exports = { selectDishWithDetails };
