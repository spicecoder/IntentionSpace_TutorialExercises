// DN_A
function DN_ValidateEmail(email, emit) {
  const isValid = email.includes("@");

  emit({
    id: "INT_EMAIL_VALIDATED",
    signal: {
      pulses: [
        { prompt: "email", responses: [email], trivalence: "N" },
        { prompt: "email_valid", responses: [String(isValid)], trivalence: "N" }
      ]
    },
    source: "DN_ValidateEmail",
    timestamp: Date.now()
  });
}

module.exports = { DN_ValidateEmail };
