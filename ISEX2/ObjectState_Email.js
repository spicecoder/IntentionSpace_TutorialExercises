// ObjectState_EmailAccount.js
import { bus } from "./intentionBus.js";

export const EmailAccountState = {
  email: null
};

bus.subscribe((intention) => {
  if (intention.type !== "INT_EMAIL_CREATED") return;

  EmailAccountState.email = intention.signal.email;

  bus.emit({
    type: "INT_SHOW_CREATED_ACCOUNT"
  });
});
