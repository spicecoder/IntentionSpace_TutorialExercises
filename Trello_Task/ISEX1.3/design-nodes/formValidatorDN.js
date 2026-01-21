const { getSimpleValue } = require("../helpers/pulse-helpers");
const { emit } = require("../tunnels/emitter");

class FormValidatorDN {
  process(signal) {
    console.log("⚙️ Design Node validating...");

    const get = (p) =>
      signal.pulses.find(x => x.prompt === p);

    const nameValid = getSimpleValue(get("user_name")).length >= 2;
    const emailValid = getSimpleValue(get("user_email")).includes("@");
    const ageValid = parseInt(getSimpleValue(get("user_age"))) >= 18;

    const updatedSignal = {
      ...signal,
      pulses: signal.pulses.map(pulse => {
        if (pulse.prompt === "name_valid")
          return { ...pulse, responses: [String(nameValid)], trivalence: nameValid ? "Y" : "N" };
        if (pulse.prompt === "email_valid")
          return { ...pulse, responses: [String(emailValid)], trivalence: emailValid ? "Y" : "N" };
        if (pulse.prompt === "age_valid")
          return { ...pulse, responses: [String(ageValid)], trivalence: ageValid ? "Y" : "N" };
        return pulse;
      })
    };

    emit("INT_VALIDATION_COMPLETE", updatedSignal);
    return updatedSignal;
  }
}

module.exports = FormValidatorDN;
