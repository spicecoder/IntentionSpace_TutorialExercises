function isSimplePulse(pulse) {
  return pulse.responses.length === 1 &&
         !Array.isArray(pulse.responses[0]);
}
function isStructuredPulse(pulse) {
  return pulse.responses.length > 0 &&
         Array.isArray(pulse.responses[0]) &&
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
  const idx = meta.indexOf(fieldName);
  if (idx <= 0) return null;
  return data[idx - 1];
}
function toObject(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }
  const meta = pulse.responses[0].slice(1);
  const data = pulse.responses[1];
  const obj = {};
  meta.forEach((field, i) => {
    obj[field] = data[i];
  });
  return obj;
}
module.exports = {
  isSimplePulse,
  isStructuredPulse,
  getSimpleValue,
  getFieldValue,
  toObject
};