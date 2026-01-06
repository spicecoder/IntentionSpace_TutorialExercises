import { emit,listen } from "../tunnel/emitter.js";

export class FormStateObject {
  constructor() {
    this.persistedSignal = null;
    listen("INT_SUBMIT_FORM", signal => this.receive(signal));
  }

  receive(signal) {
    console.log("🏢 Object received Signal");

    // Persistence
    this.persistedSignal = signal;
    console.log("💾 Signal persisted");

    // Reflection
    const reflectedSignal = {
      ...signal,
      pulses: [
        ...signal.pulses,
        { prompt: "name_valid", responses: [""], trivalence: "UN" },
        { prompt: "email_valid", responses: [""], trivalence: "UN" },
        { prompt: "age_valid", responses: [""], trivalence: "UN" }
      ]
    };
    console.log("🔄 Signal reflected with", reflectedSignal.pulses.length, "pulses");
    emit("INT_VALIDATE_FORM", reflectedSignal);
  }
}
