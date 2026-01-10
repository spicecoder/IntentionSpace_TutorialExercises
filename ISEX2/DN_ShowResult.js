import { bus } from "./intentionBus.js";
import { EmailAccountState } from "./ObjectState_Email.js";

bus.subscribe((intention) => {
  if (intention.type !== "INT_SHOW_CREATED_ACCOUNT") return;

  console.log(
    "Created Account:",
    EmailAccountState.email
  );
});
