// pulse-helpers.js
// Pulse Helper Functions for Intention Space
// Version 1.0 - Based on Response Array Convention

/**
 * Check if a pulse is simple (single scalar value)
 * 
 * @param {Object} pulse - The pulse object to check
 * @returns {boolean} - True if pulse has a single non-array response
 * 
 * Example:
 *   isSimplePulse({ responses: ["on"] })  // true
 *   isSimplePulse({ responses: [["META", "name"], ["Alice"]] })  // false
 */
function isSimplePulse(pulse) {
  return pulse.responses.length === 1 && 
         !Array.isArray(pulse.responses[0]);
}

/**
 * Check if a pulse is structured (has META rows)
 * 
 * @param {Object} pulse - The pulse object to check
 * @returns {boolean} - True if pulse has META row structure
 * 
 * Example:
 *   isStructuredPulse({ responses: [["META", "name"], ["Alice"]] })  // true
 *   isStructuredPulse({ responses: ["on"] })  // false
 */
function isStructuredPulse(pulse) {
  return pulse.responses.length > 0 &&
         Array.isArray(pulse.responses[0]) &&
         pulse.responses[0][0] === "META";
}

/**
 * Get value from a simple pulse
 * 
 * @param {Object} pulse - The simple pulse
 * @returns {string} - The scalar value
 * @throws {Error} - If pulse is not simple
 * 
 * Example:
 *   getSimpleValue({ responses: ["on"] })  // "on"
 */
function getSimpleValue(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("Not a simple pulse - use getFieldValue() for structured pulses");
  }
  return pulse.responses[0];
}

/**
 * Get a specific field value from structured pulse (first data row)
 * 
 * @param {Object} pulse - The structured pulse
 * @param {string} fieldName - The field name to retrieve
 * @returns {string|null} - The field value or null if not found
 * @throws {Error} - If pulse is not structured
 * 
 * Example:
 *   const pulse = {
 *     responses: [
 *       ["META", "name", "price"],
 *       ["Biryani", "$12.99"]
 *     ]
 *   };
 *   getFieldValue(pulse, "name")   // "Biryani"
 *   getFieldValue(pulse, "price")  // "$12.99"
 */
function getFieldValue(pulse, fieldName) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse - use getSimpleValue() for simple pulses");
  }
  
  // responses[0] is ["META", field1, field2, ...]
  // responses[1] is [value1, value2, ...]
  
  const meta = pulse.responses[0];
  
  if (pulse.responses.length < 2) {
    return null;  // No data rows
  }
  
  const data = pulse.responses[1];
  
  // Find which position this field is in
  const fieldIndex = meta.indexOf(fieldName);
  
  if (fieldIndex === -1 || fieldIndex === 0) {
    return null;  // Field not found (index 0 is "META")
  }
  
  return data[fieldIndex - 1];  // -1 because meta has "META" at index 0
}

/**
 * Get all values for a field across all data rows (first section only)
 * 
 * @param {Object} pulse - The structured pulse
 * @param {string} fieldName - The field name to retrieve
 * @returns {Array<string>} - Array of values for that field
 * @throws {Error} - If pulse is not structured
 * 
 * Example:
 *   const pulse = {
 *     responses: [
 *       ["META", "name", "qty"],
 *       ["Biryani", "2"],
 *       ["Curry", "1"]
 *     ]
 *   };
 *   getFieldValues(pulse, "name")  // ["Biryani", "Curry"]
 *   getFieldValues(pulse, "qty")   // ["2", "1"]
 */
function getFieldValues(pulse, fieldName) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }
  
  const meta = pulse.responses[0];
  const fieldIndex = meta.indexOf(fieldName);
  
  if (fieldIndex === -1 || fieldIndex === 0) {
    return [];  // Field not found
  }
  
  const values = [];
  
  // Iterate through all data rows (skip META row at index 0)
  for (let i = 1; i < pulse.responses.length; i++) {
    const row = pulse.responses[i];
    
    // Check if this is a new META row (multi-section pulse)
    if (Array.isArray(row) && row[0] === "META") {
      break;  // Stop at next META row
    }
    
    values.push(row[fieldIndex - 1]);
  }
  
  return values;
}

/**
 * Convert structured pulse (first data row) to a JavaScript object
 * 
 * @param {Object} pulse - The structured pulse
 * @returns {Object} - Object with field names as keys
 * @throws {Error} - If pulse is not structured
 * 
 * Example:
 *   const pulse = {
 *     responses: [
 *       ["META", "name", "price", "chef"],
 *       ["Biryani", "$12.99", "Kumar"]
 *     ]
 *   };
 *   toObject(pulse)
 *   // { name: "Biryani", price: "$12.99", chef: "Kumar" }
 */
function toObject(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }
  
  if (pulse.responses.length < 2) {
    return {};  // No data rows
  }
  
  const meta = pulse.responses[0].slice(1);  // Remove "META"
  const data = pulse.responses[1];
  
  const obj = {};
  meta.forEach((field, idx) => {
    obj[field] = data[idx];
  });
  
  return obj;
}

/**
 * Convert all data rows in first section to array of objects
 * 
 * @param {Object} pulse - The structured pulse
 * @returns {Array<Object>} - Array of objects
 * @throws {Error} - If pulse is not structured
 * 
 * Example:
 *   const pulse = {
 *     responses: [
 *       ["META", "name", "qty"],
 *       ["Biryani", "2"],
 *       ["Curry", "1"]
 *     ]
 *   };
 *   toObjects(pulse)
 *   // [
 *   //   { name: "Biryani", qty: "2" },
 *   //   { name: "Curry", qty: "1" }
 *   // ]
 */
function toObjects(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }
  
  const meta = pulse.responses[0].slice(1);  // Remove "META"
  const objects = [];
  
  // Iterate through all data rows (skip META row at index 0)
  for (let i = 1; i < pulse.responses.length; i++) {
    const row = pulse.responses[i];
    
    // Check if this is a new META row (multi-section pulse)
    if (Array.isArray(row) && row[0] === "META") {
      break;  // Stop at next META row
    }
    
    const obj = {};
    meta.forEach((field, idx) => {
      obj[field] = row[idx];
    });
    
    objects.push(obj);
  }
  
  return objects;
}

/**
 * Parse structured pulse into sections (for multi-META pulses)
 * 
 * @param {Object} pulse - The structured pulse
 * @returns {Array<Object>} - Array of sections, each with { meta: [...], data: [[...], ...] }
 * @throws {Error} - If pulse is not structured
 * 
 * Example:
 *   const pulse = {
 *     responses: [
 *       ["META", "item", "qty"],
 *       ["Biryani", "2"],
 *       ["META", "total"],
 *       ["$25.98"]
 *     ]
 *   };
 *   parseStructuredPulse(pulse)
 *   // [
 *   //   { meta: ["item", "qty"], data: [["Biryani", "2"]] },
 *   //   { meta: ["total"], data: [["$25.98"]] }
 *   // ]
 */
function parseStructuredPulse(pulse) {
  if (!isStructuredPulse(pulse)) {
    throw new Error("Not a structured pulse");
  }
  
  const sections = [];
  let currentSection = null;
  
  for (const row of pulse.responses) {
    if (Array.isArray(row) && row[0] === "META") {
      // Start new section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        meta: row.slice(1),  // Remove "META" prefix
        data: []
      };
    } else if (currentSection) {
      // Add data row to current section
      currentSection.data.push(row);
    }
  }
  
  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Validate pulse structure
 * 
 * @param {Object} pulse - The pulse to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 * 
 * Example:
 *   validatePulse({ prompt: "test", responses: ["ok"], trivalence: "Y" })
 *   // { valid: true, errors: [] }
 * 
 *   validatePulse({ prompt: "", responses: ["ok"], trivalence: "X" })
 *   // { valid: false, errors: ["Missing prompt", "Invalid trivalence..."] }
 */
function validatePulse(pulse) {
  const errors = [];
  
  // Check basic structure
  if (!pulse.prompt) {
    errors.push("Missing prompt");
  }
  
  if (!Array.isArray(pulse.responses)) {
    errors.push("Responses must be an array");
  }
  
  if (!["Y", "N", "UN"].includes(pulse.trivalence)) {
    errors.push("Invalid trivalence (must be Y, N, or UN)");
  }
  
  // Check structured pulse validity
  if (isStructuredPulse(pulse)) {
    const sections = parseStructuredPulse(pulse);
    
    sections.forEach((section, sectionIdx) => {
      const fieldCount = section.meta.length;
      
      section.data.forEach((row, rowIdx) => {
        if (row.length !== fieldCount) {
          errors.push(
            `Section ${sectionIdx}, row ${rowIdx}: ` +
            `Expected ${fieldCount} fields, got ${row.length}`
          );
        }
      });
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ============================================================
// EXPORT (for Node.js modules) or GLOBAL (for browser)
// ============================================================

// If running in Node.js with module support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isSimplePulse,
    isStructuredPulse,
    getSimpleValue,
    getFieldValue,
    getFieldValues,
    toObject,
    toObjects,
    parseStructuredPulse,
    validatePulse
  };
}

// If running in browser or as a script, make functions global
if (typeof window !== 'undefined') {
  window.PulseHelpers = {
    isSimplePulse,
    isStructuredPulse,
    getSimpleValue,
    getFieldValue,
    getFieldValues,
    toObject,
    toObjects,
    parseStructuredPulse,
    validatePulse
  };
}
