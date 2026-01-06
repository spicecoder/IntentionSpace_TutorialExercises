import { emit,listen} from "../tunnel/emitter.js";
import { getPulseFromSignal, getSimpleValue } from "../tunnel/signal-utils.js";

export class FormValidatorDN {
  constructor() {
   listen("INT_SUBMIT_FORM", signal => this.process(signal)); 
  }

  process(signal) { 
    console.log("⚙️ Validator DN processing");

    const name = getSimpleValue(getPulseFromSignal(signal, "user_name"));
    const email = getSimpleValue(getPulseFromSignal(signal, "user_email"));
    const age = parseInt(getSimpleValue(getPulseFromSignal(signal, "user_age")));

    const nameValid = name.length >= 2;
    const emailValid = email.includes("@");
    const ageValid =  age >= 18;

    const validatedSignal = {
      ...signal,
      pulses: signal.pulses.map(p => {
        if (p.prompt === "name_valid")
          return { ...p, responses: [String(name.length >= 2)], trivalence: name.length >= 2 ? "Y" : "N" };

        if (p.prompt === "email_valid")
          return { ...p, responses: [String(email.includes("@"))], trivalence: email.includes("@") ? "Y" : "N" };

        if (p.prompt === "age_valid")
          return { ...p, responses: [String(age >= 18)], trivalence: age >= 18 ? "Y" : "N" };

        return p;
      })
    };
     
    console.log("✅ Validation complete");
    console.log("   Name valid:", nameValid);
    console.log("   Email valid:", emailValid);
    console.log("   Age valid:", ageValid);
    

    emit("INT_VALIDATION_COMPLETE", validatedSignal);
  }
}
