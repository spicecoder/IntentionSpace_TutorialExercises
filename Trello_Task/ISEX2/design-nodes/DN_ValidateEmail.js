export function DN_ValidateEmail(email, emit) {
  // blackbox validation logic
  const isValid = email.includes("@");

  const intention = {
    id: "INT_EMAIL_VALIDATED",
    signal: {
      pulses: [
        { prompt: "email", responses: [email], trivalence: "N" },
        { prompt: "email_valid", responses: [String(isValid)], trivalence: "N" }
      ]
    },
    source: "DN_ValidateEmail",
    timestamp: Date.now()
  };

  emit(intention);
}
