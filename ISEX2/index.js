import { bus } from "./intentionBus.js";
import "./DN_CreateEmail.js";
import "./ObjectState_Email.js";
import "./DN_ShowResult.js";

// user action 
export function submitEmail(email) {
  bus.emit({
    type: "INT_EMAIL_SUBMITTED",
    signal: {email} 
  
  });
}

// TEST CASES
submitEmail("test@gmail.com");   // valid

