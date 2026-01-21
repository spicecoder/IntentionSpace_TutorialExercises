const { getFieldValue } = require("../helpers/pulse-helpers");

function calculateTotal(cartSignal) {
  let total = 0;

  cartSignal.pulses.forEach(pulse => {
    const price = parseFloat(
      getFieldValue(pulse, "price").replace("$", "")
    );
    const quantity = parseInt(
      getFieldValue(pulse, "quantity")
    );

    total += price * quantity;
  });

  return total.toFixed(2);
}

module.exports = {
  calculateTotal
};
