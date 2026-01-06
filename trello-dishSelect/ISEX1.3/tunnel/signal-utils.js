export function getPulseFromSignal(signal, prompt) {
  return signal.pulses.find(p => p.prompt === prompt);
}

export function getSimpleValue(pulse) {
  return pulse?.responses?.[0] ?? "";
}
