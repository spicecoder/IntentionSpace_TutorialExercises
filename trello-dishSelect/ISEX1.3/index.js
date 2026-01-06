import { FormStateObject } from "./object/FormStateObject.js";
import { FormValidatorDN } from "./design-nodes/FormValidatorDN.js";
import { FormSubmit } from "./component/formsubmit.js";

new FormStateObject();
new FormValidatorDN();

console.log("🧠 Intention Space initialized");
FormSubmit();
