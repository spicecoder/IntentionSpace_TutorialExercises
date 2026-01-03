const { emit } = require("./tunnels/emitter");
const FormStateObject = require("./objects/formStateObject");
const FormValidatorDN = require("./design-nodes/formValidatorDN");

console.log("🚀 User submits form");

const signal = {
  pulses: [
    { prompt: "user_name", responses: ["Frank"], trivalence: "Y" },
    { prompt: "user_email", responses: ["frank@example.com"], trivalence: "Y" },
    { prompt: "user_age", responses: ["25"], trivalence: "Y" }
  ],
  timestamp: new Date().toISOString()
};

emit("INT_SUBMIT_FORM", signal);

const object = new FormStateObject();
const reflectedSignal = object.receive(signal);

const validator = new FormValidatorDN();
validator.process(reflectedSignal);