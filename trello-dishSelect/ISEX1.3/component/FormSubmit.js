import { emit } from "../tunnel/emitter.js";

export function FormSubmit() {

  const formSignal = {
    pulses: [
      { prompt: "user_name", responses: ["Frank"], trivalence: "Y" },
      { prompt: "user_email", responses: ["frank@example.com"], trivalence: "Y" },
      { prompt: "user_age", responses: ["25"], trivalence: "Y" }
    ],
    timestamp: new Date().toISOString()
  };

  console.log("🚀 User clicked Submit");
  console.log("📦 Signal created with", formSignal.pulses.length, "pulses");
  emit("INT_SUBMIT_FORM", formSignal);
}
