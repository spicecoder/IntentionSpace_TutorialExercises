function validateEntireSignal(signal) {
  let validCount = 0;
  let invalidCount = 0;

  signal.pulses.forEach(pulse => {
    if (pulse.trivalence === "Y") validCount++;
    if (pulse.trivalence === "N") invalidCount++;
  });

  return {
    totalPulses: signal.pulses.length,
    validCount,
    invalidCount,
    allValid: validCount === signal.pulses.length && invalidCount === 0
  };
}

module.exports = {
  validateEntireSignal
};