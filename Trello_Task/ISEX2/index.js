import { DN_ValidateEmail } from "./design-nodes/DN_ValidateEmail.js";
import { DN_CreateAccount } from "./design-nodes/DN_CreateAccount.js";
import { Object_UserValidation } from "./objects/Object_UserValidation.js";
import { createIntentionBus } from "./intentions/intentionBus.js";

const bus = createIntentionBus();

// Object listens
bus.subscribe(intention =>
  Object_UserValidation.receive(intention, bus.emit)
);

// Final DN listens
bus.subscribe(intention => {
  if (intention.id === "INT_CREATE_USER") {
    DN_CreateAccount(intention);
  }
});

// Start flow
DN_ValidateEmail("user@example.com", bus.emit);
