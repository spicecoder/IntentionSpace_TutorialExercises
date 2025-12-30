const { emit } = require("../tunnels/emitter");

class FormStateObject {
  constructor() {
    this.persistedSignal = null;
  }

  receive(signal) {
    console.log("🏢 Object received Signal");

    // Persist
    this.persistedSignal = signal;

    // Reflect
    const reflectedSignal = {
      ...signal,
      pulses: [
        ...signal.pulses,
        { prompt: "name_valid", responses: [""], trivalence: "UN" },
        { prompt: "email_valid", responses: [""], trivalence: "UN" },
        { prompt: "age_valid", responses: [""], trivalence: "UN" }
      ]
    };

    emit("INT_VALIDATE_FORM", reflectedSignal);
    return reflectedSignal;
  }
}

module.exports = FormStateObject;
