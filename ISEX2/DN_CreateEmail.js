import { bus } from "./intentionBus.js";

bus.subscribe((intention) => {
  if (intention.type !== "INT_EMAIL_SUBMITTED") return;

  const email = intention.signal.email;

  bus.emit({
    type: "INT_EMAIL_CREATED",
    signal: { email }
  });
});
