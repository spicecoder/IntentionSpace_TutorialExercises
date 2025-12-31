const { isStructuredPulse, getFieldValue } = require("./pulse-helpers");


function markDishSoldOut(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("markDishSoldOut expects a structured pulse");
  }

  const metaRow = pulse.responses[0];

  const currentData = pulse.responses[1];


  const availabilityMetaIndex = metaRow.indexOf("availability");

  if (availabilityMetaIndex === -1) {
    throw new Error("availability field not found");
  }

  const availabilityDataIndex = availabilityMetaIndex - 1;


  const newData = [...currentData];
  newData[availabilityDataIndex] = "sold_out";


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
);

console.log("Trivalence:", dishSoldOut.trivalence); 