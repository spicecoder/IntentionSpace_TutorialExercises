# Exercise 3.3: Signals Group Pulses Together

**⏱️ Time**: 20 minutes  
**📚 Level**: 3 - Intentions as Channels  
**🎯 Prerequisite**: Exercises 1.1-3.2 complete

---

## 🎯 What You'll Learn

- **Core Concept**: Signal as a collection of Pulses
- When multiple concerns need to travel together
- How Signals differ from bloated Pulses
- The Intention + Signal communication pattern
- Real examples from colab.kitchen

---

## 🧠 The Problem: Multiple Concerns That Travel Together

Remember in Exercise 1.1 we learned:
> **One Pulse = One Concern** (minimal unit of perceived relevance)

But what happens when you need to communicate MULTIPLE concerns at once?

### ❌ Wrong Approach: Bloat the Pulse

```javascript
// ❌ DON'T DO THIS!
const orderDetails = {
  prompt: "order_details",
  responses: [
    // Products (concern #1)
    ["META", "product_id", "name"],
    ["p123", "Biryani"],
    
    // Shipping (concern #2) 
    ["META", "street", "city"],
    ["123 Main St", "Melbourne"],
    
    // Payment (concern #3)
    ["META", "card_last4", "total"],
    ["4242", "$35.97"]
  ],
  trivalence: "N"
};

// Problem: You're looking at THREE different things!
// "What am I looking at?" → "Products AND shipping AND payment" ❌
```

### ✅ Correct Approach: Use a Signal

```javascript
// ✅ DO THIS: Separate pulses for separate concerns

const productsPulse = {
  prompt: "products_ordered",
  responses: [
    ["META", "product_id", "name", "quantity", "price"],
    ["p123", "Biryani", "2", "$12.99"],
    ["p124", "Curry", "1", "$9.99"]
  ],
  trivalence: "N"
};

const shippingPulse = {
  prompt: "shipping_address",
  responses: [
    ["META", "street", "city", "state", "zip"],
    ["123 Main St", "Melbourne", "VIC", "3000"],
    
    ["META", "delivery_notes"],
    ["Leave at door"]
  ],
  trivalence: "Y"
};

const paymentPulse = {
  prompt: "payment_info",
  responses: [
    ["META", "method", "card_last4", "total", "status"],
    ["credit_card", "4242", "$35.97", "approved"]
  ],
  trivalence: "N"
};

// Group them in a SIGNAL
const createOrderSignal = {
  intention: "INT_CREATE_ORDER",
  pulses: [
    productsPulse,
    shippingPulse,
    paymentPulse
  ]
};

// Each pulse maintains its own concern boundary ✅
// Signal just groups them for communication ✅
```

---

## 📖 What is a Signal?

A **Signal** is a collection of Pulses that travel together when communicating between Design Nodes.

```javascript
Signal = {
  intention: string,        // Which intention carries this
  pulses: Array<Pulse>,     // Collection of pulses
  timestamp: number         // Optional: when created
}
```

**Key properties**:
1. **Multiple Pulses**: Can contain 1 or more pulses
2. **Intent-driven**: Always associated with an Intention
3. **Maintains Boundaries**: Each pulse keeps its own concern
4. **Transport Mechanism**: How pulses move through the system

---

## 🎨 Signal vs Bloated Pulse

### Bloated Pulse (Wrong)
```
┌──────────────────────────────────┐
│     ONE BLOATED PULSE            │
│  ┌────────────────────────────┐  │
│  │ Products + Shipping + Pay  │  │ ← Everything mixed!
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Problems**:
- Hard to understand (what am I looking at?)
- Fields change independently (breaks cohesion)
- Can't reuse parts (all or nothing)

### Signal with Separate Pulses (Right)
```
┌───────────────────────────────────┐
│        SIGNAL                     │
│  ┌──────────┐  ┌──────────┐      │
│  │ Products │  │ Shipping │  ... │ ← Clean separation!
│  └──────────┘  └──────────┘      │
└───────────────────────────────────┘
```

**Benefits**:
- Clear boundaries (one concern per pulse)
- Independent evolution (change shipping without touching products)
- Reusable (shipping pulse can be used elsewhere)

---

## 🏗️ How Signals Work in CPUX

### The Communication Pattern

```
Design Node (DN)
      ↓
  emits Intention
      ↓
  carries Signal (with Pulses)
      ↓
Object (O)
      ↓
  reflects Intention
      ↓
  carries Signal (possibly modified)
      ↓
Design Node (DN)
```

### Example: Order Creation Flow

```javascript
// DN_CreateOrder emits an intention with signal
dn.emit("INT_ORDER_CREATED", {
  pulses: [
    productsPulse,
    shippingPulse,
    paymentPulse
  ]
});

// Object receives the signal
object.absorb("INT_ORDER_CREATED", signal);

// Object can modify the signal (add validation results, etc.)
const modifiedSignal = {
  pulses: [
    ...signal.pulses,
    validationResultPulse  // Added by object
  ]
};

// Object reflects to next DN
object.emit("INT_ORDER_VALIDATED", modifiedSignal);

// DN_ProcessOrder absorbs the signal
dn.absorb("INT_ORDER_VALIDATED", modifiedSignal);
// Now DN can access all pulses in the signal
```

---

## 🔧 Working with Signals

### Creating a Signal

```javascript
function createSignal(intention, pulses) {
  return {
    intention,
    pulses,
    timestamp: Date.now()
  };
}

// Usage
const signal = createSignal("INT_CREATE_ORDER", [
  productsPulse,
  shippingPulse,
  paymentPulse
]);
```

### Accessing Pulses in a Signal

```javascript
function getPulseByPrompt(signal, promptName) {
  return signal.pulses.find(p => p.prompt === promptName);
}

// Usage
const shipping = getPulseByPrompt(signal, "shipping_address");
const city = getFieldValue(shipping, "city");  // "Melbourne"
```

### Adding Pulses to a Signal

```javascript
function addPulseToSignal(signal, newPulse) {
  return {
    ...signal,
    pulses: [...signal.pulses, newPulse]
  };
}

// Usage
const validationPulse = {
  prompt: "validation_result",
  responses: ["passed"],
  trivalence: "N"
};

const updatedSignal = addPulseToSignal(signal, validationPulse);
```

---

## 🌍 Real-World Example: colab.kitchen Order

### Scenario
User creates an order for dishes to be delivered.

### Separate Concerns (Pulses)

```javascript
// 1. Selected dishes (what they're ordering)
const dishSelectionPulse = {
  prompt: "dishes_selected",
  responses: [
    ["META", "dish_id", "dish_name", "seller_id", "quantity", "unit_price"],
    ["d123", "Biryani", "s456", "2", "$12.99"],
    ["d124", "Curry", "s456", "1", "$9.99"]
  ],
  trivalence: "Y"
};

// 2. Delivery details (where it's going)
const deliveryPulse = {
  prompt: "delivery_details",
  responses: [
    ["META", "address", "city", "zip", "phone"],
    ["123 Main St", "Melbourne", "3000", "555-0123"],
    
    ["META", "delivery_time", "special_instructions"],
    ["ASAP", "Ring bell twice"]
  ],
  trivalence: "Y"
};

// 3. Payment info (how they're paying)
const paymentPulse = {
  prompt: "payment_method",
  responses: [
    ["META", "method", "card_last4", "billing_zip"],
    ["credit_card", "4242", "3000"]
  ],
  trivalence: "Y"
};

// 4. Order summary (calculated totals)
const orderSummaryPulse = {
  prompt: "order_summary",
  responses: [
    ["META", "subtotal", "delivery_fee", "tax", "total"],
    ["$22.98", "$5.00", "$2.52", "$30.50"]
  ],
  trivalence: "N"  // Read-only (calculated)
};

// Create the signal
const createOrderSignal = createSignal("INT_CREATE_ORDER", [
  dishSelectionPulse,
  deliveryPulse,
  paymentPulse,
  orderSummaryPulse
]);
```

**Why this is better**:
- ✅ Each pulse has clear boundary (dishes, delivery, payment, summary)
- ✅ Can validate each independently (validate address without touching dishes)
- ✅ Can reuse (delivery pulse used for other orders)
- ✅ Clear responsibility (who updates what)

---

## 🎯 Practice: Create Your Own Signal

### Task: Create a "User Registration" Signal

**Scenario**: User registers on colab.kitchen. We need:
1. Account info (email, password)
2. Profile info (name, phone, location)
3. Preferences (dietary restrictions, favorite cuisines)

### Step 1: Identify the Concerns

```
Ask: "What different things am I looking at?"
Answer: 
  1. Account credentials (concern #1)
  2. Personal profile (concern #2)
  3. Food preferences (concern #3)

Each = ONE pulse ✅
```

### Step 2: Create Separate Pulses

```javascript
// 🔧 TODO: Create account credentials pulse
const accountPulse = {
  prompt: "account_credentials",
  responses: [
    // 🔧 TODO: META row: email, password_hash, verified
    // 🔧 TODO: Data row with example values
  ],
  trivalence: ""  // 🔧 TODO: Y, N, or UN?
};

// 🔧 TODO: Create profile pulse
const profilePulse = {
  prompt: "user_profile",
  responses: [
    // 🔧 TODO: META row: name, phone, city, join_date
    // 🔧 TODO: Data row with example values
  ],
  trivalence: ""  // 🔧 TODO: Y, N, or UN?
};

// 🔧 TODO: Create preferences pulse
const preferencesPulse = {
  prompt: "food_preferences",
  responses: [
    // 🔧 TODO: META row: dietary, allergies, favorite_cuisines
    // 🔧 TODO: Data row with example values
  ],
  trivalence: ""  // 🔧 TODO: Y, N, or UN?
};
```

### Step 3: Create the Signal

```javascript
// 🔧 TODO: Create registration signal
const registrationSignal = createSignal("INT_USER_REGISTER", [
  // 🔧 TODO: Add your pulses here
]);

console.log("Registration signal:", registrationSignal);
```

### Step 4: Test Pulse Access

```javascript
// 🔧 TODO: Get account pulse from signal
const account = getPulseByPrompt(registrationSignal, "account_credentials");

// 🔧 TODO: Get email from account pulse
const email = getFieldValue(account, "email");

console.log("User email:", email);
```

---

## ✅ Solution

<details>
<summary>Click to see solution (try yourself first!)</summary>

```javascript
// Account credentials pulse
const accountPulse = {
  prompt: "account_credentials",
  responses: [
    ["META", "email", "password_hash", "verified"],
    ["alice@example.com", "hash_abc123", "false"]
  ],
  trivalence: "Y"  // User can edit
};

// Profile pulse  
const profilePulse = {
  prompt: "user_profile",
  responses: [
    ["META", "name", "phone", "city", "join_date"],
    ["Alice Smith", "555-0123", "Melbourne", "2024-12-27"]
  ],
  trivalence: "Y"  // User can edit
};

// Preferences pulse
const preferencesPulse = {
  prompt: "food_preferences",
  responses: [
    ["META", "dietary", "allergies", "favorite_cuisines"],
    ["vegetarian", "nuts", "Indian, Thai, Italian"]
  ],
  trivalence: "Y"  // User can edit
};

// Create signal
const registrationSignal = createSignal("INT_USER_REGISTER", [
  accountPulse,
  profilePulse,
  preferencesPulse
]);

// Test access
const account = getPulseByPrompt(registrationSignal, "account_credentials");
const email = getFieldValue(account, "email");
console.log("User email:", email);  // "alice@example.com"
```

</details>

---

## 🎓 Key Takeaways

### ✅ Do This
- **One Pulse = One Concern** (minimal perceived relevance)
- **Signal = Collection of Pulses** (for communication)
- **Keep pulse boundaries clean** (don't mix concerns)
- **Use signals when multiple concerns travel together**

### ❌ Don't Do This
- **Don't create bloated pulses** with unrelated data
- **Don't mix concerns in one pulse** (products + shipping)
- **Don't use signals when one pulse is enough**

### 🎯 The Test
Before creating a pulse, ask:
- "What am I looking at?"
- One answer → One pulse
- Multiple answers → Multiple pulses in a Signal

---

## 📋 Quick Reference Card

```javascript
// PULSE (minimal unit of perceived relevance)
{
  prompt: "shipping_address",  // What you're looking at
  responses: [...],             // The data
  trivalence: "Y"               // How it's used
}

// SIGNAL (collection for communication)
{
  intention: "INT_CREATE_ORDER",  // Why we're communicating
  pulses: [                        // What we're sending
    productsPulse,
    shippingPulse,
    paymentPulse
  ],
  timestamp: 1703692800000        // When
}

// HELPER FUNCTIONS
createSignal(intention, pulses)
getPulseByPrompt(signal, promptName)
addPulseToSignal(signal, newPulse)
```

---

## 🚀 Next Exercise

**Exercise 4.1: Objects Reflect Signals**

You'll learn how Objects receive Signals, transform them, and reflect them to the next Design Node.

---

## 💡 Reflection Questions

1. When would you use multiple META rows in ONE pulse? (Hint: When all sections are aspects of the SAME concern)

2. When would you use MULTIPLE pulses in a Signal? (Hint: When you have SEPARATE concerns that need to travel together)

3. In colab.kitchen, would "dish details + customer review" be:
   - a) One pulse with multiple META rows? 
   - b) Two pulses in a Signal?
   
   **Answer**: b) Two separate concerns!
   - Dish details = what the dish is (ingredients, price, etc.)
   - Customer review = what someone thinks about it
   - These are independent and change separately → Two pulses ✅

---

**Estimated time**: 20 minutes  
**Files to create**: None (just practice with code examples)  
**Ready for verification**: Run `npm test -- exercise-3.3 your-name`
