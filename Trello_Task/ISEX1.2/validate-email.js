const { isSimplePulse, getSimpleValue } = require("./pulse-helpers");


function validateEmail(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("validateEmail expects a simple pulse");
  }

  // Perceive current email
  const email = getSimpleValue(pulse);

  // Validation logic (simple, explicit)
  const isValid = email.includes("@") && email.includes(".");

  // Emit NEW pulse (snapshot)
  return {
    prompt: pulse.prompt,
    responses: [isValid ? "true" : "false"],
    trivalence: isValid ? "Y" : "N"
  };
}


const emailBefore = {
  prompt: "user_email",
  responses: ["alice@example.com"],
  trivalence: "UN"
};

const emailAfter = validateEmail(emailBefore);
console.log("Valid email response:", getSimpleValue(emailAfter)); 
console.log("Valid email trivalence:", emailAfter.trivalence);   

const invalidEmailBefore = {
  prompt: "user_email",
  responses: ["not-an-email"],
  trivalence: "UN"
};

const invalidEmailAfter = validateEmail(invalidEmailBefore);
console.log("Invalid email response:", getSimpleValue(invalidEmailAfter)); 
console.log("Invalid email trivalence:", invalidEmailAfter.trivalence); 
