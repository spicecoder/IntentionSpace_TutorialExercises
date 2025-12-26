# Exercise 1.3: Pulses Travel as Signals

**⏱️ Time**: 15 minutes  
**📚 Level**: 1 - Pulse Basics  
**🎯 Prerequisite**: Exercise 1.2 (Pulses Change Over Time)

---

## 🎯 What You'll Learn

- What a Signal is (bundle of pulses)
- Why pulses travel in groups
- How Signals move through Intention Tunnels
- Objects as waypoints where Signals pause and reflect
- The form submission analogy
- Creating and working with Signals

---

## 🌍 Real-World Example: Shipping Multiple Packages Together

Imagine you're moving to a new apartment and need to ship:
- Your clothes (package 1)
- Your books (package 2)
- Your kitchen items (package 3)

**Option A: Ship individually** ❌
- Each package travels separately
- They might arrive on different days
- Hard to track - are they all delivered?
- Expensive (3 separate shipments)

**Option B: Ship together as one shipment** ✅
- All packages bundled into one container
- They travel together
- Single tracking number
- They all arrive together
- More efficient

In Intention Space:
- **Packages** = Individual Pulses
- **Container** = Signal (bundle of pulses)
- **Shipping route** = Intention Tunnel
- **Waypoints** = Objects (where container pauses)

---

## 📊 Where We Are

```
┌─────────────────────────────────────────────────┐
│  LEVEL 1: PULSE BASICS                          │
│  ├─ 1.1 What is a Pulse? ✅ COMPLETED          │
│  ├─ 1.2 Pulses Change Over Time ✅ COMPLETED   │
│  └─ 1.3 Pulses Travel as Signals ← 🎯 YOU ARE HERE │
└─────────────────────────────────────────────────┘
```

After this exercise, you'll complete Level 1 (Pulse Basics)!

---

## 📖 Understanding Signals

### What is a Signal?

A **Signal** is a **collection of related pulses** that travel together through Intention Space.

```javascript
// Individual pulses
const namePulse = {
  prompt: "user_name",
  responses: ["Alice"],
  trivalence: "Y"
};

const emailPulse = {
  prompt: "user_email",
  responses: ["alice@example.com"],
  trivalence: "Y"
};

const agePulse = {
  prompt: "user_age",
  responses: ["28"],
  trivalence: "Y"
};

// Signal: Bundle of pulses
const signupSignal = {
  pulses: [namePulse, emailPulse, agePulse]
};
```

**Think of it as**: A folder containing related documents, or a box containing related items.

---

## 🎨 The Form Submission Analogy

This is the PERFECT real-world example of Signals.

### Traditional HTML Form

```html
<form onSubmit={handleSubmit}>
  <input name="user_name" value="Alice" />
  <input name="user_email" value="alice@example.com" />
  <input name="user_age" value="28" />
  <button type="submit">Sign Up</button>
</form>
```

When you click "Sign Up":
- All fields submit **together**
- Server receives all values **at once**
- They're related (represent one user)

### In Intention Space

The form fields become **pulses** that travel together as a **Signal**:

```javascript
// User clicks "Sign Up" button
const formSubmissionSignal = {
  pulses: [
    { prompt: "user_name", responses: ["Alice"], trivalence: "Y" },
    { prompt: "user_email", responses: ["alice@example.com"], trivalence: "Y" },
    { prompt: "user_age", responses: ["28"], trivalence: "Y" }
  ]
};

// This entire Signal travels together through:
// Component → Intention Tunnel → Object → Design Node
```

**Key insight**: Just like form submission bundles all fields, Signals bundle all related pulses.

---

## 🚂 How Signals Travel

### The Journey of a Signal

```
USER ACTION
    ↓
┌─────────────────┐
│  Component      │  User fills form, clicks submit
│  (Human Agent)  │
└────────┬────────┘
         │ emit(Signal₁)
         ↓
┌─────────────────┐
│ Intention       │  Signal travels through channel
│ Tunnel          │  (INT_SUBMIT_FORM)
│ (Transportation)│
└────────┬────────┘
         │ Signal₁ (unchanged)
         ↓
┌─────────────────┐
│  Object₁        │  WAYPOINT: Signal pauses here
│  (Waypoint)     │  - Persists the Signal
└────────┬────────┘  - May reflect to different Signal
         │ reflect(Signal₁ → Signal₂)
         ↓
┌─────────────────┐
│ Intention       │  Signal₂ travels through channel
│ Tunnel          │  (INT_VALIDATE)
│ (Transportation)│
└────────┬────────┘
         │ Signal₂ (unchanged)
         ↓
┌─────────────────┐
│ Design Node₁    │  PROCESSING: Signal changes here
│ (Processor)     │  - Validates fields
└────────┬────────┘  - Updates pulse responses/TV
         │ emit(Signal₃)
         ↓
┌─────────────────┐
│ Intention       │
│ Tunnel          │
│ (Transportation)│
└────────┬────────┘
         │ Signal₃ (changed pulses)
         ↓
┌─────────────────┐
│  Object₂        │  WAYPOINT: Persists result
│  (Waypoint)     │
└────────┬────────┘
         │ reflect(Signal₃ → Signal₄)
         ↓
   (continues...)
```

**Key Points**:

1. **Signals don't change during travel** (Intention Tunnels)
2. **Objects are waypoints** - Signals pause, get persisted, may reflect to different Signal
3. **Design Nodes change Signals** - business logic transforms pulses
4. **All pulses travel together** - they arrive as a group

---

## 🛤️ Intention Tunnels: The Transportation System

### What is an Intention Tunnel?

An **Intention Tunnel** is the **channel** through which Signals travel.

```javascript
// Component emits Signal into Intention Tunnel
emit('INT_SUBMIT_FORM', {
  pulses: [namePulse, emailPulse, agePulse]
});

// The tunnel "INT_SUBMIT_FORM" carries this Signal to the next waypoint
```

**Think of it as**:
- Highway for Signals
- Labeled route (e.g., "INT_SUBMIT_FORM")
- One-way direction
- No changes during transit

**Real-world analogy**:
- Amazon delivery route from warehouse to your house
- Train track from Station A to Station B
- Postal route from sender to receiver

---

## 🏢 Objects: Critical Waypoints

### Why Objects Matter

From your explanation: *"The presence of intermediate objects is subtle but critical, with objects giving the persistence necessary to summarize the event occurrence in UI into discrete standardized Intention Space entity attributes."*

Let's break this down:

#### 1. Objects Provide Persistence

When a Signal reaches an Object, the Object **saves** it.

```javascript
// User submits form at 10:30:15 AM
const formSignal = {
  timestamp: "2024-12-24T10:30:15Z",
  pulses: [
    { prompt: "user_name", responses: ["Alice"], trivalence: "Y" },
    { prompt: "user_email", responses: ["alice@example.com"], trivalence: "Y" }
  ]
};

// Object₁ receives and persists this Signal
Object₁.persist(formSignal);

// Later, if network fails or browser crashes, 
// Object₁ still has this Signal - can retry!
```

**Why this matters**: If something fails, you don't lose the user's form data.

#### 2. Objects Reflect Signals

An Object can **transform** one Signal into another Signal.

```javascript
// Signal₁ arrives (raw form input)
const inputSignal = {
  pulses: [
    { prompt: "user_name", responses: ["Alice"], trivalence: "Y" },
    { prompt: "user_email", responses: ["alice@example.com"], trivalence: "Y" }
  ]
};

// Object reflects it (adds validation pulses)
const reflectedSignal = {
  pulses: [
    // Original pulses
    { prompt: "user_name", responses: ["Alice"], trivalence: "Y" },
    { prompt: "user_email", responses: ["alice@example.com"], trivalence: "Y" },
    
    // New pulses added by Object reflection
    { prompt: "name_valid", responses: [""], trivalence: "UN" },  // Unknown - not validated yet
    { prompt: "email_valid", responses: [""], trivalence: "UN" }
  ]
};

// Now this new Signal travels to the validation Design Node
```

**Key insight**: Objects are **transformation points** between Design Nodes.

#### 3. Objects Standardize UI Events

From UI (messy, platform-specific) → To Intention Space (clean, standardized).

```javascript
// UI Event (React-specific)
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  // Convert messy UI event to clean Signal
  const signal = {
    pulses: [
      { prompt: "user_name", responses: [formData.get('name')], trivalence: "Y" },
      { prompt: "user_email", responses: [formData.get('email')], trivalence: "Y" }
    ]
  };
  
  // Emit standardized Signal into Intention Space
  emit('INT_SUBMIT_FORM', signal);
}
```

**Result**: The rest of Intention Space doesn't care if it came from React, Vue, or vanilla JS - it's now a standard Signal.

---

## 🔧 Working with Signals in Code

### Creating a Signal

```javascript
// Method 1: From individual pulses
function createSignal(pulses) {
  return {
    pulses: pulses,
    timestamp: new Date().toISOString()
  };
}

const signal = createSignal([
  { prompt: "user_name", responses: ["Bob"], trivalence: "Y" },
  { prompt: "user_age", responses: ["30"], trivalence: "Y" }
]);

// Method 2: From form data
function createSignalFromForm(formData) {
  const pulses = [];
  
  for (let [key, value] of formData.entries()) {
    pulses.push({
      prompt: key,
      responses: [value],
      trivalence: "Y"
    });
  }
  
  return createSignal(pulses);
}
```

---

### Accessing Pulses in a Signal

```javascript
// Get specific pulse by prompt
function getPulseFromSignal(signal, promptName) {
  return signal.pulses.find(pulse => pulse.prompt === promptName);
}

// Example
const signal = {
  pulses: [
    { prompt: "user_name", responses: ["Carol"], trivalence: "Y" },
    { prompt: "user_email", responses: ["carol@example.com"], trivalence: "Y" }
  ]
};

const namePulse = getPulseFromSignal(signal, "user_name");
console.log(getSimpleValue(namePulse));  // "Carol"
```

---

### Adding Pulses to a Signal

```javascript
// Immutable way (creates new Signal)
function addPulseToSignal(signal, newPulse) {
  return {
    ...signal,
    pulses: [...signal.pulses, newPulse]
  };
}

// Example: Object adds validation pulses
const inputSignal = {
  pulses: [
    { prompt: "user_email", responses: ["dave@example.com"], trivalence: "Y" }
  ]
};

const validationPulse = {
  prompt: "email_valid",
  responses: [""],
  trivalence: "UN"  // Unknown - not validated yet
};

const enhancedSignal = addPulseToSignal(inputSignal, validationPulse);

console.log(enhancedSignal.pulses.length);  // 2
```

---

### Transforming Signals (Inside Design Nodes)

```javascript
// Design Node that validates all pulses in a Signal
function validateSignal(signal) {
  const validatedPulses = signal.pulses.map(pulse => {
    // Simple validation: check if not empty
    const value = getSimpleValue(pulse);
    const isValid = value.trim().length > 0;
    
    return {
      ...pulse,
      trivalence: isValid ? "Y" : "N"
    };
  });
  
  return {
    ...signal,
    pulses: validatedPulses
  };
}

// Example
const inputSignal = {
  pulses: [
    { prompt: "user_name", responses: ["Eve"], trivalence: "UN" },
    { prompt: "user_email", responses: [""], trivalence: "UN" }  // Empty!
  ]
};

const validatedSignal = validateSignal(inputSignal);

console.log(validatedSignal.pulses[0].trivalence);  // "Y" (valid)
console.log(validatedSignal.pulses[1].trivalence);  // "N" (invalid - empty)
```

---

## 🎯 Complete Example: Form Submission Flow

Let's trace a Signal through the complete journey:

```javascript
// ============================================================
// STEP 1: User fills form and clicks Submit (Component)
// ============================================================

function handleFormSubmit(event) {
  event.preventDefault();
  
  // Create Signal from form data
  const formSignal = {
    pulses: [
      { prompt: "user_name", responses: ["Frank"], trivalence: "Y" },
      { prompt: "user_email", responses: ["frank@example.com"], trivalence: "Y" },
      { prompt: "user_age", responses: ["25"], trivalence: "Y" }
    ],
    timestamp: new Date().toISOString()
  };
  
  console.log("🚀 User clicked Submit");
  console.log("📦 Signal created with", formSignal.pulses.length, "pulses");
  
  // Emit into Intention Tunnel
  emit('INT_SUBMIT_FORM', formSignal);
}

// ============================================================
// STEP 2: Signal travels through Intention Tunnel
// ============================================================

// (No code here - Signal travels unchanged)
console.log("🚂 Signal traveling through INT_SUBMIT_FORM...");

// ============================================================
// STEP 3: Signal arrives at Object₁ (Form State)
// ============================================================

class FormStateObject {
  constructor() {
    this.persistedSignal = null;
  }
  
  receive(signal) {
    console.log("🏢 Object received Signal at", signal.timestamp);
    
    // PERSISTENCE: Save the Signal
    this.persistedSignal = signal;
    console.log("💾 Signal persisted");
    
    // REFLECTION: Add validation pulses
    const reflectedSignal = {
      ...signal,
      pulses: [
        ...signal.pulses,
        // Add validation status pulses (Unknown initially)
        { prompt: "name_valid", responses: [""], trivalence: "UN" },
        { prompt: "email_valid", responses: [""], trivalence: "UN" },
        { prompt: "age_valid", responses: [""], trivalence: "UN" }
      ]
    };
    
    console.log("🔄 Signal reflected with", reflectedSignal.pulses.length, "pulses");
    
    // Emit reflected Signal into next Intention Tunnel
    emit('INT_VALIDATE_FORM', reflectedSignal);
  }
}

// ============================================================
// STEP 4: Signal travels through next Intention Tunnel
// ============================================================

console.log("🚂 Signal traveling through INT_VALIDATE_FORM...");

// ============================================================
// STEP 5: Signal arrives at Design Node (Validator)
// ============================================================

class FormValidatorDN {
  process(signal) {
    console.log("⚙️ Design Node processing Signal...");
    
    // Extract pulses
    const namePulse = getPulseFromSignal(signal, "user_name");
    const emailPulse = getPulseFromSignal(signal, "user_email");
    const agePulse = getPulseFromSignal(signal, "user_age");
    
    // Validate each field
    const nameValid = getSimpleValue(namePulse).length >= 2;
    const emailValid = getSimpleValue(emailPulse).includes("@");
    const ageValid = parseInt(getSimpleValue(agePulse)) >= 18;
    
    // Update validation pulses
    const validatedSignal = {
      ...signal,
      pulses: signal.pulses.map(pulse => {
        if (pulse.prompt === "name_valid") {
          return { ...pulse, responses: [String(nameValid)], trivalence: nameValid ? "Y" : "N" };
        }
        if (pulse.prompt === "email_valid") {
          return { ...pulse, responses: [String(emailValid)], trivalence: emailValid ? "Y" : "N" };
        }
        if (pulse.prompt === "age_valid") {
          return { ...pulse, responses: [String(ageValid)], trivalence: ageValid ? "Y" : "N" };
        }
        return pulse;
      })
    };
    
    console.log("✅ Validation complete");
    console.log("   Name valid:", nameValid);
    console.log("   Email valid:", emailValid);
    console.log("   Age valid:", ageValid);
    
    // Emit validated Signal
    emit('INT_VALIDATION_COMPLETE', validatedSignal);
  }
}

// ============================================================
// STEP 6: Signal continues to next Object/DN...
// ============================================================

console.log("🚂 Signal traveling through INT_VALIDATION_COMPLETE...");
console.log("🏁 Signal reaches final destination");
```

**Output**:
```
🚀 User clicked Submit
📦 Signal created with 3 pulses
🚂 Signal traveling through INT_SUBMIT_FORM...
🏢 Object received Signal at 2024-12-24T10:30:15Z
💾 Signal persisted
🔄 Signal reflected with 6 pulses
🚂 Signal traveling through INT_VALIDATE_FORM...
⚙️ Design Node processing Signal...
✅ Validation complete
   Name valid: true
   Email valid: true
   Age valid: true
🚂 Signal traveling through INT_VALIDATION_COMPLETE...
🏁 Signal reaches final destination
```

---

## 🎯 Your Turn: Practice Challenges

### Challenge 1: Create Shopping Cart Signal

Create a Signal that represents a shopping cart with multiple items.

```javascript
// 🔧 YOUR TASK: Create a Signal with 3 item pulses

// Each item should have structured pulse format:
// ["META", "name", "price", "quantity"]

// Example items:
// - Biryani, $12.99, qty 2
// - Naan, $2.99, qty 4
// - Curry, $10.99, qty 1

function createShoppingCartSignal() {
  // TODO: Create pulses for each item
  // TODO: Bundle into Signal
  // TODO: Return Signal
}

const cartSignal = createShoppingCartSignal();
console.log("Cart has", cartSignal.pulses.length, "items");
```

<details>
<summary>Solution</summary>

```javascript
function createShoppingCartSignal() {
  const item1 = {
    prompt: "cart_item_1",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Biryani", "$12.99", "2"]
    ],
    trivalence: "Y"
  };
  
  const item2 = {
    prompt: "cart_item_2",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Naan", "$2.99", "4"]
    ],
    trivalence: "Y"
  };
  
  const item3 = {
    prompt: "cart_item_3",
    responses: [
      ["META", "name", "price", "quantity"],
      ["Curry", "$10.99", "1"]
    ],
    trivalence: "Y"
  };
  
  return {
    pulses: [item1, item2, item3],
    timestamp: new Date().toISOString()
  };
}
```

</details>

---

### Challenge 2: Extract Total from Signal

Given a shopping cart Signal, calculate the total price.

```javascript
// 🔧 YOUR TASK: Calculate total from cart Signal

function calculateTotal(cartSignal) {
  // TODO: Loop through pulses
  // TODO: Extract price and quantity for each
  // TODO: Calculate subtotal for each item
  // TODO: Return grand total
}

const cartSignal = createShoppingCartSignal();
const total = calculateTotal(cartSignal);
console.log("Cart total:", total);  // Should be $47.92
```

<details>
<summary>Solution</summary>

```javascript
function calculateTotal(cartSignal) {
  let total = 0;
  
  cartSignal.pulses.forEach(pulse => {
    // Extract price and quantity
    const price = parseFloat(getFieldValue(pulse, "price").replace("$", ""));
    const quantity = parseInt(getFieldValue(pulse, "quantity"));
    
    // Add to total
    total += price * quantity;
  });
  
  return total.toFixed(2);
}
```

</details>

---

### Challenge 3: Validate Entire Signal

Create a function that validates all pulses in a Signal and returns a summary.

```javascript
// 🔧 YOUR TASK: Validate all pulses in Signal

function validateEntireSignal(signal) {
  // TODO: Check each pulse
  // TODO: Count valid vs invalid
  // TODO: Return summary object
  //   { totalPulses, validCount, invalidCount, allValid }
}

// Test with mixed Signal
const testSignal = {
  pulses: [
    { prompt: "field1", responses: ["valid"], trivalence: "Y" },
    { prompt: "field2", responses: [""], trivalence: "N" },      // Invalid
    { prompt: "field3", responses: ["valid"], trivalence: "Y" }
  ]
};

const summary = validateEntireSignal(testSignal);
console.log("Total:", summary.totalPulses);       // 3
console.log("Valid:", summary.validCount);        // 2
console.log("Invalid:", summary.invalidCount);    // 1
console.log("All valid:", summary.allValid);      // false
```

<details>
<summary>Solution</summary>

```javascript
function validateEntireSignal(signal) {
  let validCount = 0;
  let invalidCount = 0;
  
  signal.pulses.forEach(pulse => {
    if (pulse.trivalence === "Y") {
      validCount++;
    } else if (pulse.trivalence === "N") {
      invalidCount++;
    }
    // Note: "UN" (Unknown) not counted as either
  });
  
  return {
    totalPulses: signal.pulses.length,
    validCount: validCount,
    invalidCount: invalidCount,
    allValid: validCount === signal.pulses.length && invalidCount === 0
  };
}
```

</details>

---

## ✅ Check Your Understanding

**Question 1**: What is a Signal?
<details>
<summary>Click to reveal answer</summary>

A **Signal** is a **bundle of related pulses** that travel together through Intention Space. Like a form submission containing multiple fields, or a box containing multiple packages.
</details>

**Question 2**: Where do Signals change?
<details>
<summary>Click to reveal answer</summary>

Signals change **inside Design Nodes** (where pulses are transformed). They do NOT change while traveling through Intention Tunnels. Objects may reflect one Signal into a different Signal.
</details>

**Question 3**: Why are Objects important?
<details>
<summary>Click to reveal answer</summary>

Objects provide:
1. **Persistence** - Save Signals so they can be recovered if something fails
2. **Reflection** - Transform one Signal into another Signal
3. **Standardization** - Convert messy UI events into clean Intention Space Signals
</details>

**Question 4**: What is an Intention Tunnel?
<details>
<summary>Click to reveal answer</summary>

An **Intention Tunnel** is the **channel** through which Signals travel. It's like a labeled highway (e.g., "INT_SUBMIT_FORM") that transports Signals from one location to another without changing them.
</details>

---

## 💡 Key Takeaways

After completing this exercise, you should understand:

✅ **Signals bundle pulses** - related data travels together

✅ **Intention Tunnels transport Signals** - labeled channels for Signal flow

✅ **Objects are critical waypoints** - provide persistence and reflection

✅ **Signals don't change during travel** - only at Design Nodes

✅ **Form submission is the perfect analogy** - all fields submit together

✅ **Objects standardize UI events** - convert platform-specific to universal

---

## 🎨 Visual Summary

```
SIGNAL JOURNEY

┌─────────────────┐
│   Component     │  Creates Signal (pulses bundled)
│   (Human)       │
└────────┬────────┘
         │
         ↓ emit(Signal)
         │
┌────────────────────┐
│ Intention Tunnel   │  Signal travels (unchanged)
│ "INT_SUBMIT"       │
└────────┬───────────┘
         │
         ↓ Signal arrives
         │
┌────────────────────┐
│     Object₁        │  WAYPOINT
│  - Persists Signal │  Signal pauses here
│  - May reflect     │
└────────┬───────────┘
         │
         ↓ reflect(Signal₁ → Signal₂)
         │
┌────────────────────┐
│ Intention Tunnel   │  Signal₂ travels (unchanged)
│ "INT_VALIDATE"     │
└────────┬───────────┘
         │
         ↓ Signal₂ arrives
         │
┌────────────────────┐
│   Design Node      │  PROCESSING
│  - Changes pulses  │  Transforms Signal
└────────┬───────────┘
         │
         ↓ emit(Signal₃)
         │
     (continues...)

KEY:
🚫 No changes during travel (Intention Tunnels)
💾 Persistence at Objects
🔄 Reflection at Objects (Signal₁ → Signal₂)
⚙️ Transformation at Design Nodes (pulses change)
```

---

## 📚 Quick Reference

```javascript
// Creating a Signal
const signal = {
  pulses: [pulse1, pulse2, pulse3],
  timestamp: new Date().toISOString()
};

// Getting pulse from Signal
function getPulseFromSignal(signal, promptName) {
  return signal.pulses.find(p => p.prompt === promptName);
}

// Adding pulse to Signal (immutable)
const newSignal = {
  ...signal,
  pulses: [...signal.pulses, newPulse]
};

// Transforming Signal (in Design Node)
const transformedSignal = {
  ...signal,
  pulses: signal.pulses.map(pulse => transformPulse(pulse))
};

// Emitting Signal into Intention Tunnel
emit('INT_TUNNEL_NAME', signal);
```

---

## 🎉 Congratulations!

You've completed **Level 1: Pulse Basics**!

You now understand:
- ✅ What individual pulses are (Ex 1.1)
- ✅ How pulses change over time (Ex 1.2)
- ✅ How pulses travel together as Signals (Ex 1.3)

**You're ready for Level 2: Field as Shared State!**

---

## ➡️ Next Steps

**Level 2** introduces the **Field** - the central state container that holds all Signals and enables the entire Intention Tunnel to work.

**Next**: Level 2 - Field as Shared State

In Level 2, you'll learn:
- What the Field is (React Context + PnR state)
- How Components emit Signals to Field
- How Design Nodes read from Field
- How the Field enables component communication

---

## 🔍 Behind the Scenes: Why This Matters

**You just learned the foundation of Intention Space!**

Every complex flow in Intention Space:
- User interactions → Signals
- Validation logic → Design Nodes transforming Signals
- Data persistence → Objects saving Signals
- Communication → Intention Tunnels transporting Signals

Understanding Signals prepares you for:
- **Level 2**: How Field holds all Signals
- **Level 3**: How Intention Tunnels connect everything
- **Level 4**: How Objects reflect and persist
- **Level 5**: How Design Nodes process business logic
- **Level 6**: Complete CPUX flows

**You've built the conceptual foundation. Everything builds on this!**

---

**Last Updated**: December 24, 2024  
**Exercise Series**: Intention Tunnel for Beginners  
**License**: Educational use
