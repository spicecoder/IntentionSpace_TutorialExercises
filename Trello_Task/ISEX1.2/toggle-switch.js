const { getSimpleValue } = require("./pulse-helpers");

// DESIGN NODE (Pulse Transformer)

function toggleSwitch(pulse) {
  const currentValue = getSimpleValue(pulse);
  const nextValue = currentValue === "on" ? "off" : "on";

  return {
    prompt: pulse.prompt,
    responses: [nextValue],
    trivalence: pulse.trivalence
  };
}

// TEST

const switchOff = {
  prompt: "light_switch_state",
  responses: ["off"],
  trivalence: "Y"
};

const switchOn = toggleSwitch(switchOff);
console.log("After first toggle:", getSimpleValue(switchOn)); 

const switchOffAgain = toggleSwitch(switchOn);
console.log("After second toggle:", getSimpleValue(switchOffAgain)); 
