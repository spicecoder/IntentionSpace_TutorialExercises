// PULSE HELPER FUNCTIONS

function isSimplePulse(pulse) {
  return pulse.responses.length === 1 &&
         !Array.isArray(pulse.responses[0]);
}

function isStructuredPulse(pulse) {
  return pulse.responses.length > 0 &&
         Array.isArray(pulse.responses[0]) &&
         pulse.responses[0][0] === "META";
}

function getSimpleValue(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("Not a simple pulse");
  }
  return pulse.responses[0];
}

function getFieldValue(pulse, fieldName) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }

  const meta = pulse.responses[0];
  const data = pulse.responses[1];

  const fieldIndex = meta.indexOf(fieldName);
  if (fieldIndex <= 0) return null;

  return data[fieldIndex - 1];
}

function toObject(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }

  const meta = pulse.responses[0].slice(1);
  const data = pulse.responses[1];

  const obj = {};
  meta.forEach((field, idx) => {
    obj[field] = data[idx];
  });

  return obj;
}

//Pulse(Task in the html file for practice)

// 🔧 TASK 1: Simple pulse for a door lock
const doorLock = {
  prompt: "door_lock_state",
  responses: ["locked"],
  trivalence: "Y" // User can lock/unlock the door
};

// 🔧 TASK 2: Structured pulse for a book
const bookInfo = {
  prompt: "book_info",
  responses: [
    ["META", "title", "author", "year", "price"],
    ["Clean Code", "Robert C. Martin", "2008", "35"]
  ],
  trivalence: "N" // Book info is read-only
};


// TEST THE PULSES

console.log("=== DOOR LOCK ===");
console.log("Is simple?", isSimplePulse(doorLock));
console.log("Value:", getSimpleValue(doorLock));

console.log("\n=== BOOK INFO ===");
console.log("Is structured?", isStructuredPulse(bookInfo));
console.log("Title:", getFieldValue(bookInfo, "title"));
console.log("Author:", getFieldValue(bookInfo, "author"));
console.log("As object:", toObject(bookInfo));
