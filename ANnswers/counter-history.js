const {
  isSimplePulse,
  getSimpleValue
} = require("./pulse-helpers");


function incrementCounter(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("incrementCounter expects a simple pulse");
  }

  const currentValue = parseInt(getSimpleValue(pulse), 10);

  return {
    prompt: pulse.prompt,
    responses: [String(currentValue + 1)], 
    trivalence: pulse.trivalence            
  };
}


function decrementCounter(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("decrementCounter expects a simple pulse");
  }

  const currentValue = parseInt(getSimpleValue(pulse), 10);

  return {
    prompt: pulse.prompt,
    responses: [String(currentValue - 1)], 
    trivalence: pulse.trivalence           
  };
}

// Simulate pulse changes over time

const history = [];

// Initial pulse (T0)
let counter = {
  prompt: "counter_value",
  responses: ["0"],
  trivalence: "Y"
};

history.push({
  time: "T0",
  action: "initial",
  pulse: counter
});

// T1 – increment
counter = incrementCounter(counter);
history.push({
  time: "T1",
  action: "increment",
  pulse: counter
});

// T2 – increment again
counter = incrementCounter(counter);
history.push({
  time: "T2",
  action: "increment",
  pulse: counter
});

// T3 – decrement
counter = decrementCounter(counter);
history.push({
  time: "T3",
  action: "decrement",
  pulse: counter
});

// Display history

console.log("=== Counter History ===");

history.forEach(entry => {
  console.log(
    `${entry.time}: ${entry.action} → value=${getSimpleValue(entry.pulse)}`
  );
});