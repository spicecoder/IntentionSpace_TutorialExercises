function DN_CreateAccount(intention) {
  const emailPulse = intention.signal.pulses.find(
    p => p.prompt === "email"
  );

  console.log("Creating account for:", emailPulse.responses[0]);
}

module.exports = { DN_CreateAccount };

