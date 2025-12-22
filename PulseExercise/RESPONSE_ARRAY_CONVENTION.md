# Response Array Convention Specification
## Self-Describing Data in Pulses

**Version**: 1.0  
**Date**: December 22, 2024  
**Status**: Core Convention (Platform Independent)

---

## 🎯 Purpose

Define a universal convention for structuring Pulse responses as self-describing data containers, enabling pulses to carry simple scalar values or complex tabular data with explicit field definitions.

---

## 📋 Core Principles

1. **Self-Describing**: Response structure is explicit through meta rows
2. **Platform Independent**: Convention works in any language/runtime
3. **Flexible**: Supports simple values and complex multi-record data
4. **Spreadsheet Analogy**: Think of responses as a mini spreadsheet with column headers

---

## 📊 Response Array Structure

### Simple Pulse (No Meta Row)

For single scalar values, you have two options:

**Option A: Direct value (recommended for simplicity)**
```javascript
{
  prompt: "light_switch_state",
  responses: ["on"],              // Single value, no meta
  trivalence: "Y"
}

{
  prompt: "user_age",
  responses: ["25"],              // Single value, no meta
  trivalence: "N"
}
```

**Option B: Structured (for consistency)**
```javascript
{
  prompt: "light_switch_state",
  responses: [
    ["META", "state"],
    ["on"]
  ],
  trivalence: "Y"
}

{
  prompt: "user_age",
  responses: [
    ["META", "age"],
    ["25"]
  ],
  trivalence: "N"
}
```

**Recommendation**: Use **Option A** (direct value) for true scalar values. Use **Option B** (with meta) when:
- You might add more fields later
- You want uniform parsing code across all pulses
- The platform enforces structured-only convention

**Rule**: If `responses.length === 1` and it's not an array, it's a simple scalar value (Option A). Otherwise, it follows structured convention (Option B).

---

### Structured Pulse (With Meta Row)

For complex data with multiple fields, use nested arrays with META row:

```javascript
{
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "chef", "ingredients"],     // Meta row
    ["Vegetable Biryani", "$12.99", "Kumar", "rice, vegetables, spices"]  // Data row
  ],
  trivalence: "Y"
}
```

**Structure**:
- **First element**: `["META", field1, field2, ..., fieldN]`
- **Subsequent elements**: Data rows following the meta structure
- **Field count**: All data rows must match meta row field count

---

### Multiple Records (Multi-Row Data)

A pulse can carry multiple records under one meta definition:

```javascript
{
  prompt: "shopping_cart_items",
  responses: [
    ["META", "item_id", "name", "quantity", "price"],
    ["item_1", "Biryani", "2", "$12.99"],
    ["item_2", "Curry", "1", "$9.99"],
    ["item_3", "Naan", "4", "$2.50"]
  ],
  trivalence: "N"
}
```

**Rule**: All rows after META row follow the same structure until a new META row is encountered.

---

### Multiple Meta Rows (Different Structures)

⚠️ **IMPORTANT**: Multiple meta rows in a single pulse should represent a cohesive business action or entity that can be described by a single verbal expression.

A pulse can contain multiple data structures when they together represent ONE logical business concept:

```javascript
{
  prompt: "order_complete",  // Single business action: "completing an order"
  responses: [
    // Section 1: Items in the order
    ["META", "item_name", "quantity", "price"],
    ["Biryani", "2", "$12.99"],
    ["Curry", "1", "$9.99"],
    
    // Section 2: Customer details
    ["META", "customer_name", "table_number", "payment_method"],
    ["Alice", "5", "credit_card"],
    
    // Section 3: Financial summary
    ["META", "order_total", "tax", "tip"],
    ["$22.98", "$2.07", "$4.00"]
  ],
  trivalence: "N"
}
```

**Key Principle**: The pulse prompt ("order_complete") describes the unified business concept. All meta sections together answer: "What data is needed to complete an order?"

**Analogy**: Think of a pulse as a **database entity** (but looser than strict normalization). Just as a "Customer" entity in a DB might have related sub-tables (addresses, phone numbers), a pulse can have related meta sections that together describe one business concept.

**Good Examples** (cohesive business concepts):
- ✅ `"dish_selected"` → dish details + ingredients + nutritional info
- ✅ `"order_submitted"` → items + customer + payment + delivery
- ✅ `"user_profile"` → personal info + preferences + settings

**Bad Examples** (unrelated concepts forced together):
- ❌ `"random_data"` → weather + stock prices + todo items
- ❌ `"mixed_stuff"` → user login + product catalog + system logs

**Rule**: Each META row starts a new data section with its own structure, but all sections must relate to the single business action/entity named in the prompt.

---

## 🔍 Meta Row Format

### Meta Row Structure

```javascript
["META", field1, field2, field3, ..., fieldN]
```

**Required**:
- First element MUST be the string `"META"`
- Subsequent elements are field names (strings)
- Field names should be descriptive identifiers (lowercase_with_underscores recommended)

**Invalid Meta Rows**:
```javascript
["meta", "field1"]           // ❌ Wrong: lowercase "meta"
[null, "field1"]             // ❌ Wrong: not "META" string
["META"]                     // ❌ Wrong: no fields defined
```

**Valid Meta Rows**:
```javascript
["META", "name"]                                    // ✅ Single field
["META", "id", "name", "price"]                     // ✅ Multiple fields
["META", "dish_name", "price_usd", "cook_time_min"] // ✅ Descriptive names
```

---

## 📖 Data Row Format

### Data Row Structure

```javascript
[value1, value2, value3, ..., valueN]
```

**Rules**:
1. Must follow a META row
2. Must have exactly the same number of elements as META row fields
3. **All values are strings** - typed interpretation is platform-specific
4. Empty values represented as empty string `""`

**Important**: Field values are ALWAYS strings in the Response Array Convention. Platforms may parse these strings into native types (numbers, booleans, dates) based on application needs, but the convention itself stores everything as strings.

**Examples**:

```javascript
// Valid - all values are strings
["META", "name", "age", "city"]
["Alice", "25", "Melbourne"]      // ✅ 3 fields match meta, all strings

// Platform parsing (application-level, not convention-level)
const age = parseInt(row[1]);     // "25" → 25 (number)
const active = row[2] === "true"; // "true" → true (boolean)
```

**Invalid**:
```javascript
["META", "name", "age", "city"]
["Bob", "30"]                     // ❌ Only 2 fields (should be 3)
```

**Handling Empty Values**:
```javascript
["META", "name", "email", "phone"]
["Alice", "alice@example.com", ""],  // Empty phone
["Bob", "", "555-1234"]              // Empty email
```

---

## 🎨 Complete Examples

### Example 1: Restaurant Menu Item

```javascript
const menuItemPulse = {
  prompt: "menu_item_details",
  responses: [
    ["META", "dish_name", "price", "cuisine", "spice_level", "prep_time"],
    ["Vegetable Biryani", "$12.99", "Indian", "Medium", "30 min"]
  ],
  trivalence: "N"
};
```

### Example 2: Shopping Cart

```javascript
const cartPulse = {
  prompt: "cart_contents",
  responses: [
    ["META", "product_id", "name", "quantity", "unit_price", "subtotal"],
    ["prod_001", "Laptop", "1", "$999", "$999"],
    ["prod_002", "Mouse", "2", "$25", "$50"],
    ["prod_003", "Keyboard", "1", "$75", "$75"]
  ],
  trivalence: "Y"
};
```

### Example 3: Mixed Data (Order Summary)

```javascript
const orderSummaryPulse = {
  prompt: "order_summary",
  responses: [
    // Items section
    ["META", "item", "qty", "price"],
    ["Biryani", "2", "$25.98"],
    ["Naan", "4", "$10.00"],
    
    // Customer section
    ["META", "customer_name", "table", "server"],
    ["Alice Smith", "12", "Bob"],
    
    // Totals section
    ["META", "subtotal", "tax", "tip", "total"],
    ["$35.98", "$3.24", "$7.00", "$46.22"]
  ],
  trivalence: "N"
};
```

### Example 4: Form Fields (UI Configuration)

```javascript
const formFieldsPulse = {
  prompt: "login_form_fields",
  responses: [
    ["META", "field_name", "field_type", "placeholder", "required"],
    ["username", "text", "Enter username", "true"],
    ["password", "password", "Enter password", "true"],
    ["remember_me", "checkbox", "Remember me", "false"]
  ],
  trivalence: "Y"
};
```

---

## 🛠️ Platform Helpers (Reference Implementation)

### Core Helper Functions

These are **platform-specific implementations** of the convention. Each platform (JavaScript, Python, Go, etc.) should provide these helpers.

#### JavaScript Reference Implementation

```javascript
/**
 * Check if a pulse is simple (single scalar value)
 */
function isSimplePulse(pulse) {
  return pulse.responses.length === 1 && 
         !Array.isArray(pulse.responses[0]);
}

/**
 * Check if a pulse is structured (has meta rows)
 */
function isStructuredPulse(pulse) {
  return pulse.responses.length > 0 &&
         Array.isArray(pulse.responses[0]) &&
         pulse.responses[0][0] === "META";
}

/**
 * Get simple pulse value
 */
function getSimpleValue(pulse) {
  if (!isSimplePulse(pulse)) {
    throw new Error("Not a simple pulse");
  }
  return pulse.responses[0];
}

/**
 * Parse structured pulse into sections
 * Returns array of { meta: [...], data: [[...], [...]] }
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
 * Get field value from first data row
 */
function getFieldValue(pulse, fieldName) {
  const sections = parseStructuredPulse(pulse);
  
  if (sections.length === 0) {
    return null;
  }
  
  const section = sections[0];
  const fieldIndex = section.meta.indexOf(fieldName);
  
  if (fieldIndex === -1 || section.data.length === 0) {
    return null;
  }
  
  return section.data[0][fieldIndex];
}

/**
 * Get all values for a field across all data rows in first section
 */
function getFieldValues(pulse, fieldName) {
  const sections = parseStructuredPulse(pulse);
  
  if (sections.length === 0) {
    return [];
  }
  
  const section = sections[0];
  const fieldIndex = section.meta.indexOf(fieldName);
  
  if (fieldIndex === -1) {
    return [];
  }
  
  return section.data.map(row => row[fieldIndex]);
}

/**
 * Convert first section to array of objects
 */
function toObjects(pulse) {
  const sections = parseStructuredPulse(pulse);
  
  if (sections.length === 0) {
    return [];
  }
  
  const section = sections[0];
  return section.data.map(row => {
    const obj = {};
    section.meta.forEach((field, idx) => {
      obj[field] = row[idx];
    });
    return obj;
  });
}

/**
 * Validate pulse structure
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
```

---

## 📚 Usage Examples

### Example 1: Simple Pulse

```javascript
const lightSwitch = {
  prompt: "light_state",
  responses: ["on"],
  trivalence: "Y"
};

// Get value
const state = getSimpleValue(lightSwitch);
console.log(state);  // "on"
```

### Example 2: Structured Pulse (Single Record)

```javascript
const dish = {
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "chef"],
    ["Biryani", "$12.99", "Kumar"]
  ],
  trivalence: "Y"
};

// Get specific field
const dishName = getFieldValue(dish, "name");
console.log(dishName);  // "Biryani"

const price = getFieldValue(dish, "price");
console.log(price);  // "$12.99"

// Convert to object
const dishObj = toObjects(dish)[0];
console.log(dishObj);
// { name: "Biryani", price: "$12.99", chef: "Kumar" }
```

### Example 3: Structured Pulse (Multiple Records)

```javascript
const cart = {
  prompt: "cart_items",
  responses: [
    ["META", "id", "name", "qty"],
    ["1", "Biryani", "2"],
    ["2", "Curry", "1"],
    ["3", "Naan", "4"]
  ],
  trivalence: "N"
};

// Get all names
const names = getFieldValues(cart, "name");
console.log(names);  // ["Biryani", "Curry", "Naan"]

// Convert to array of objects
const items = toObjects(cart);
console.log(items);
// [
//   { id: "1", name: "Biryani", qty: "2" },
//   { id: "2", name: "Curry", qty: "1" },
//   { id: "3", name: "Naan", qty: "4" }
// ]
```

### Example 4: Multiple Sections

```javascript
const orderSummary = {
  prompt: "order_summary",
  responses: [
    ["META", "item", "qty"],
    ["Biryani", "2"],
    ["Naan", "4"],
    
    ["META", "customer", "table"],
    ["Alice", "12"],
    
    ["META", "total"],
    ["$35.98"]
  ],
  trivalence: "N"
};

// Parse all sections
const sections = parseStructuredPulse(orderSummary);

console.log(sections);
// [
//   {
//     meta: ["item", "qty"],
//     data: [["Biryani", "2"], ["Naan", "4"]]
//   },
//   {
//     meta: ["customer", "table"],
//     data: [["Alice", "12"]]
//   },
//   {
//     meta: ["total"],
//     data: [["$35.98"]]
//   }
// ]

// Access specific sections
const items = sections[0].data;  // Item rows
const customer = sections[1].data[0];  // ["Alice", "12"]
const total = sections[2].data[0][0];  // "$35.98"
```

---

## ✅ Validation Rules

### Rule 1: Meta Row Must Be First
```javascript
// ✅ Valid
responses: [
  ["META", "name"],
  ["Alice"]
]

// ❌ Invalid - data before meta
responses: [
  ["Alice"],
  ["META", "name"]
]
```

### Rule 2: Field Count Must Match
```javascript
// ✅ Valid
responses: [
  ["META", "name", "age"],
  ["Alice", "25"],
  ["Bob", "30"]
]

// ❌ Invalid - mismatched field count
responses: [
  ["META", "name", "age"],
  ["Alice", "25"],
  ["Bob"]  // Missing age!
]
```

### Rule 3: Simple Pulses Don't Use Arrays
```javascript
// ✅ Valid simple pulse
responses: ["on"]

// ❌ Invalid - unnecessary array
responses: [["on"]]
```

### Rule 4: Structured Pulses Must Have Data
```javascript
// ✅ Valid
responses: [
  ["META", "name"],
  ["Alice"]
]

// ⚠️ Warning - meta with no data (allowed but unusual)
responses: [
  ["META", "name"]
]
```

---

## 🎯 Best Practices

### 1. Choose Simple When Possible
If you only need a single value, don't use meta rows:

```javascript
// Good
responses: ["on"]

// Unnecessarily complex
responses: [
  ["META", "state"],
  ["on"]
]
```

### 2. Use Descriptive Field Names
```javascript
// Good
["META", "dish_name", "price_usd", "cook_time_minutes"]

// Bad
["META", "d", "p", "t"]
```

### 3. Keep Related Data Together
If data is always used together, put it in one pulse:

```javascript
// Good - order data together
responses: [
  ["META", "item", "qty", "price"],
  ["Biryani", "2", "$25.98"]
]

// Bad - split into multiple pulses
// (harder to keep in sync)
```

### 4. Use Multiple Meta Rows for Cohesive Business Concepts
Only use multiple sections when they together represent ONE business action/entity:

```javascript
// Good - "order_complete" is the unified concept
responses: [
  ["META", "item", "qty"],      // What was ordered
  ["Biryani", "2"],
  
  ["META", "customer", "table"], // Who ordered
  ["Alice", "12"],
  
  ["META", "total", "tax"],     // Payment details
  ["$25.98", "$2.34"]
]
// All sections answer: "What data completes an order?"

// Bad - unrelated concepts forced together
// prompt: "random_stuff"
responses: [
  ["META", "weather"],          // ❌ Unrelated to each other
  ["sunny"],
  
  ["META", "stock_price"],      // ❌ Different business domain
  ["$150.25"]
]
```

**Key Test**: Can you describe all meta sections with a single verbal expression?
- ✅ "When I select a dish, I need: name, price, ingredients, cook time"
- ✅ "When an order completes, I need: items, customer, payment"
- ❌ "When random_stuff happens, I need: weather and stocks" (not cohesive!)

### 5. Pulse as Entity (DB Table Analogy)
Think of each pulse as representing a **loosely normalized entity** (like a database table):

```javascript
// Pulse = "Customer" entity (like a DB table)
// Multiple meta rows = related aspects of that entity
{
  prompt: "customer_profile",
  responses: [
    ["META", "id", "name", "email"],        // Basic info
    ["c123", "Alice", "alice@ex.com"],
    
    ["META", "address", "city", "country"], // Address info
    ["123 Main St", "Melbourne", "AU"],
    
    ["META", "tier", "points", "since"],    // Loyalty info
    ["Gold", "5000", "2020-01-15"]
  ]
}
// All sections describe ONE entity: "the customer"
```

---

## 🚀 Migration Path

### From Unstructured to Structured

**Old (unclear)**:
```javascript
responses: ["Biryani", "$12.99", "Kumar"]
// What does each value mean?
```

**New (self-describing)**:
```javascript
responses: [
  ["META", "name", "price", "chef"],
  ["Biryani", "$12.99", "Kumar"]
]
// Crystal clear!
```

### Backward Compatibility

Platform implementations should support both:

```javascript
function getPulseValue(pulse) {
  if (isSimplePulse(pulse)) {
    return getSimpleValue(pulse);
  } else if (isStructuredPulse(pulse)) {
    return toObjects(pulse)[0];
  } else {
    // Legacy unstructured pulse - best effort
    return pulse.responses;
  }
}
```

---

## 📖 Summary

### Core Convention

1. **Simple Pulses**: Single value in array → `responses: ["value"]`
2. **Structured Pulses**: Meta row + data rows → `responses: [["META", ...], [...]]`
3. **Multiple Records**: Multiple data rows under one meta
4. **Multiple Sections**: Multiple meta rows with different structures
5. **Meta Row Format**: `["META", field1, field2, ...]` (always first element "META")

### Platform Responsibilities

Each platform must provide:
- `isSimplePulse(pulse)` → boolean
- `isStructuredPulse(pulse)` → boolean
- `getSimpleValue(pulse)` → string
- `parseStructuredPulse(pulse)` → sections array
- `getFieldValue(pulse, fieldName)` → string
- `getFieldValues(pulse, fieldName)` → string[]
- `toObjects(pulse)` → object[]
- `validatePulse(pulse)` → validation result

---

**This convention is now the official standard for all Intention Space implementations.**

---

**Version History**:
- v1.0 (2024-12-22): Initial specification
