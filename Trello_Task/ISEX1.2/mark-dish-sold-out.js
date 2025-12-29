const { isStructuredPulse, getFieldValue } = require("./pulse-helpers");


function markDishSoldOut(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("markDishSoldOut expects a structured pulse");
  }

  // META row (structure stays unchanged)
  const metaRow = pulse.responses[0];

  // Current data row
  const currentData = pulse.responses[1];

  // Find availability field index
  const availabilityMetaIndex = metaRow.indexOf("availability");

  if (availabilityMetaIndex === -1) {
    throw new Error("availability field not found");
  }

  // META has "META" at index 0 → data index = meta index - 1
  const availabilityDataIndex = availabilityMetaIndex - 1;

  // Create new data snapshot
  const newData = [...currentData];
  newData[availabilityDataIndex] = "sold_out";

  // Emit NEW pulse
  return {
    prompt: pulse.prompt,
    responses: [metaRow, newData],
    trivalence: "N" 
  };
}


const dishInStock = {
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "availability"],
    ["Biryani", "$12.99", "in_stock"]
  ],
  trivalence: "Y"
};

const dishSoldOut = markDishSoldOut(dishInStock);

console.log(
  "Availability:",
  getFieldValue(dishSoldOut, "availability")
); // "sold_out"

console.log("Trivalence:", dishSoldOut.trivalence); // "N"
