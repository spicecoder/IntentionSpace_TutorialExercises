const Object_UserValidation = {
  name: "Object_UserValidation",
  accepts: ["INT_EMAIL_VALIDATED"],
  intentionMappings: {
    INT_EMAIL_VALIDATED: "INT_CREATE_USER"
  },
  capturedState: null,

  receive(intention, emit) {
    if (!this.accepts.includes(intention.id)) return;

    this.capturedState = {
      signal: intention.signal,
      receivedAt: Date.now(),
      source: intention.source
    };

    emit({
      id: this.intentionMappings[intention.id],
      signal: this.capturedState.signal,
      source: this.name,
      timestamp: Date.now()
    });
  }
};

module.exports = { Object_UserValidation };
