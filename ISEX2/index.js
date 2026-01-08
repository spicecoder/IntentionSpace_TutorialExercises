const { DN_ValidateEmail } = require("./DesignNode/ValidateEmail.js");
const { DN_CreateAccount } = require("./DesignNode/CreateAccount.js");
const { Object_UserValidation } = require("./Objects/Object_UserValidation.js");
const { createIntentionBus } = require("./intentions/intentionBus.js");

const bus = createIntentionBus();


bus.subscribe(intention =>
  Object_UserValidation.receive(intention, bus.emit)
);


bus.subscribe(intention => {
  if (intention.id === "INT_CREATE_USER") {
    DN_CreateAccount(intention);
  }
});

DN_ValidateEmail("user@example.com", bus.emit);
