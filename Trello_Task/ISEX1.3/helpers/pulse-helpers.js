function isSimplePulse(pulse) {
  return pulse.responses.length === 1 &&
         !Array.isArray(pulse.responses[0]);
}

function isStructuredPulse(pulse) {
  return Array.isArray(pulse.responses[0]) &&
         pulse.responses[0][0] === "META";
}

function getSimpleValue(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("Not a simple pulse");
  }
  return pulse.responses[0];
}

function getFieldValue(pulse, fieldName) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }

  const meta = pulse.responses[0];
  const data = pulse.responses[1];

  const fieldIndex = meta.indexOf(fieldName);
  if (fieldIndex === -1 || fieldIndex === 0) {
    return null;
  }

  return data[fieldIndex - 1];
}

module.exports = {
  isSimplePulse,
  isStructuredPulse,
  getSimpleValue,
  getFieldValue
};
