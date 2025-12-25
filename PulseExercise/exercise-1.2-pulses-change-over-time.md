# Exercise 1.2: Pulses Change Over Time

**⏱️ Time**: 15 minutes  
**📚 Level**: 1 - Pulse Basics  
**🎯 Prerequisite**: Exercise 1.1 (What is a Pulse?)

---

## 🎯 What You'll Learn

- Pulses are snapshots in time (they represent state at a moment)
- How pulse responses and trivalence change
- Who can change pulses (Design Nodes)
- When pulses DON'T change (during travel)
- Creating functions that transform pulses

---

## 🌍 Real-World Example: A Package Tracking System

Imagine tracking a package as it moves from sender to receiver:

**At Sender's House**:
```
Package status: "packed"
Ready to ship: Unknown
```

**At Warehouse** (processing happens here):
```
Package status: "in_transit"  ← Changed!
Ready to ship: Yes             ← Changed!
```

**During Shipping** (no changes):
```
Package status: "in_transit"  ← Same
Ready to ship: Yes            ← Same
```

**At Receiver's House** (processing happens here):
```
Package status: "delivered"   ← Changed!
Ready to ship: No             ← Changed!
```

**Key insight**: The package only changes at processing points (warehouses), not during transit.

In Intention Space:
- **Processing points** = Design Nodes (where business logic runs)
- **Transit** = Traveling through Intention Tunnels and Objects
- **Package state** = Pulse (with response + trivalence)

---

## 📊 Where We Are

```
┌─────────────────────────────────────────────────┐
│  LEVEL 1: PULSE BASICS                          │
│  ├─ 1.1 What is a Pulse? ✅ COMPLETED          │
│  ├─ 1.2 Pulses Change Over Time ← 🎯 YOU ARE HERE │
│  └─ 1.3 Pulses in React                        │
└─────────────────────────────────────────────────┘
```

---

## 📖 Understanding Pulse Changes

### Pulses Are Snapshots

A pulse represents state **at a specific moment**. As your application runs, pulses capture different states over time.

**Example: Counter Pulse**

```javascript
// Time T1: Initial state
const counterT1 = {
  prompt: "counter_value",
  responses: ["0"],
  trivalence: "Y"
};

// Time T2: After user clicks "increment"
const counterT2 = {
  prompt: "counter_value",
  responses: ["1"],    // ← Changed!
  trivalence: "Y"
};

// Time T3: After clicking again
const counterT3 = {
  prompt: "counter_value",
  responses: ["2"],    // ← Changed!
  trivalence: "Y"
};
```

**Key point**: Same prompt (`"counter_value"`), different responses over time.

---

## 🔧 What Can Change in a Pulse?

### 1. Response Values

The most common change: the actual data changes.

```javascript
// Before
{
  prompt: "light_switch_state",
  responses: ["off"],
  trivalence: "Y"
}

// After
{
  prompt: "light_switch_state",
  responses: ["on"],   // ← Response changed
  trivalence: "Y"
}
```

### 2. Trivalence (State Indicator)

The usage state can change.

```javascript
// Before validation
{
  prompt: "email_valid",
  responses: [""],
  trivalence: "UN"     // Unknown - not validated yet
}

// After validation (valid email)
{
  prompt: "email_valid",
  responses: ["true"],
  trivalence: "Y"      // ← Trivalence changed to Yes
}

// After validation (invalid email)
{
  prompt: "email_valid",
  responses: ["false"],
  trivalence: "N"      // ← Trivalence changed to No
}
```

### 3. Both Response AND Trivalence

Often, both change together.

```javascript
// Before form submission
{
  prompt: "form_status",
  responses: [""],
  trivalence: "UN"     // Unknown/Action - ready to submit
}

// After successful submission
{
  prompt: "form_status",
  responses: ["submitted"],  // ← Response changed
  trivalence: "N"            // ← Trivalence changed (read-only now)
}
```

### 4. Structured Pulse Changes

For structured pulses, field values can change.

```javascript
// Before updating dish
{
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "availability"],
    ["Biryani", "$12.99", "in_stock"]
  ],
  trivalence: "Y"
}

// After dish sold out
{
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "availability"],
    ["Biryani", "$12.99", "sold_out"]  // ← availability changed
  ],
  trivalence: "N"  // ← Now read-only (can't order)
}
```

---

## ⚙️ Who Changes Pulses?

### ✅ Design Nodes Change Pulses

**Design Nodes (DNs)** are the ONLY place where business logic runs and pulses change.

```javascript
// Inside a Design Node
function incrementCounter(pulse) {
  // This is business logic running inside a DN
  const currentValue = parseInt(getSimpleValue(pulse));
  const newValue = currentValue + 1;
  
  // Return changed pulse
  return {
    prompt: pulse.prompt,
    responses: [String(newValue)],  // Changed!
    trivalence: pulse.trivalence
  };
}
```

**Think of DNs as**: Processing stations where work happens.

---

### ❌ Pulses DON'T Change During Travel

When pulses travel from one place to another (through Intention Tunnels and Objects), they **do NOT change**.

```javascript
// At Component (User clicks "Submit")
const submittedPulse = {
  prompt: "user_input",
  responses: ["Hello"],
  trivalence: "Y"
};

// Traveling through Intention Tunnel INT_SUBMIT
// ... (no change) ...

// Arrives at Object
// ... (pulse is SAME) ...

// Traveling to Design Node
// ... (no change) ...

// Arrives at Design Node DN_Process
const receivedPulse = submittedPulse;  // ← Exactly the same!
```

**Analogy**: Like a sealed package during shipping - contents don't change until it reaches a processing warehouse (Design Node).

---

## 🎨 Example: Traffic Light Simulation

Let's create a function that changes a traffic light pulse:

```javascript
// Helper function to change traffic light
function changeTrafficLight(currentPulse) {
  const currentColor = getSimpleValue(currentPulse);
  
  // Traffic light cycle: red → yellow → green → red
  let nextColor;
  if (currentColor === "red") {
    nextColor = "yellow";
  } else if (currentColor === "yellow") {
    nextColor = "green";
  } else {
    nextColor = "red";
  }
  
  // Return new pulse with changed response
  return {
    prompt: currentPulse.prompt,
    responses: [nextColor],
    trivalence: "N"  // Read-only (automatic light)
  };
}

// Usage
const lightT1 = {
  prompt: "traffic_light_color",
  responses: ["red"],
  trivalence: "N"
};

console.log("Time 1:", getSimpleValue(lightT1));  // "red"

const lightT2 = changeTrafficLight(lightT1);
console.log("Time 2:", getSimpleValue(lightT2));  // "yellow"

const lightT3 = changeTrafficLight(lightT2);
console.log("Time 3:", getSimpleValue(lightT3));  // "green"

const lightT4 = changeTrafficLight(lightT3);
console.log("Time 4:", getSimpleValue(lightT4));  // "red" (cycle complete)
```

---

## 🔧 Your Turn: Create Pulse Transformation Functions

### Challenge 1: Toggle Switch

Create a function that toggles a light switch pulse between "on" and "off".

```javascript
// 🔧 YOUR TASK: Implement this function
function toggleSwitch(pulse) {
  // TODO: Get current value ("on" or "off")
  // TODO: Toggle to opposite value
  // TODO: Return new pulse with changed response
}

// Test it
const switchOff = {
  prompt: "light_switch_state",
  responses: ["off"],
  trivalence: "Y"
};

const switchOn = toggleSwitch(switchOff);
console.log(getSimpleValue(switchOn));  // Should print "on"

const switchOffAgain = toggleSwitch(switchOn);
console.log(getSimpleValue(switchOffAgain));  // Should print "off"
```

<details>
<summary>Solution</summary>

```javascript
function toggleSwitch(pulse) {
  const currentValue = getSimpleValue(pulse);
  const newValue = currentValue === "on" ? "off" : "on";
  
  return {
    prompt: pulse.prompt,
    responses: [newValue],
    trivalence: pulse.trivalence  // Keep same trivalence
  };
}
```

</details>

---

### Challenge 2: Validate Email

Create a function that validates an email pulse and changes both response AND trivalence.

```javascript
// 🔧 YOUR TASK: Implement this function
function validateEmail(pulse) {
  // TODO: Get email from pulse
  // TODO: Check if valid (contains @ and .)
  // TODO: Return new pulse with:
  //       - responses: ["true"] or ["false"]
  //       - trivalence: "Y" if valid, "N" if invalid
}

// Test it
const emailBefore = {
  prompt: "user_email",
  responses: ["alice@example.com"],
  trivalence: "UN"  // Unknown - not validated yet
};

const emailAfter = validateEmail(emailBefore);
console.log(getSimpleValue(emailAfter));  // Should print "true"
console.log(emailAfter.trivalence);       // Should print "Y"

const invalidEmailBefore = {
  prompt: "user_email",
  responses: ["not-an-email"],
  trivalence: "UN"
};

const invalidEmailAfter = validateEmail(invalidEmailBefore);
console.log(getSimpleValue(invalidEmailAfter));  // Should print "false"
console.log(invalidEmailAfter.trivalence);       // Should print "N"
```

<details>
<summary>Solution</summary>

```javascript
function validateEmail(pulse) {
  const email = getSimpleValue(pulse);
  
  // Simple email validation (contains @ and .)
  const isValid = email.includes("@") && email.includes(".");
  
  return {
    prompt: pulse.prompt,
    responses: [isValid ? "true" : "false"],
    trivalence: isValid ? "Y" : "N"
  };
}
```

</details>

---

### Challenge 3: Update Dish Availability

Create a function that changes a structured pulse (dish availability).

```javascript
// 🔧 YOUR TASK: Implement this function
function markDishSoldOut(pulse) {
  // TODO: Get current dish data as object
  // TODO: Change "availability" field to "sold_out"
  // TODO: Change trivalence to "N" (read-only)
  // TODO: Return new pulse
}

// Test it
const dishInStock = {
  prompt: "dish_selected",
  responses: [
    ["META", "name", "price", "availability"],
    ["Biryani", "$12.99", "in_stock"]
  ],
  trivalence: "Y"
};

const dishSoldOut = markDishSoldOut(dishInStock);
console.log(getFieldValue(dishSoldOut, "availability"));  // Should print "sold_out"
console.log(dishSoldOut.trivalence);                      // Should print "N"
```

<details>
<summary>Solution</summary>

```javascript
function markDishSoldOut(pulse) {
  // Keep META row the same
  const meta = pulse.responses[0];
  
  // Get current data
  const currentData = pulse.responses[1];
  
  // Find availability field index
  const availabilityIndex = meta.indexOf("availability") - 1;  // -1 for "META"
  
  // Create new data row with updated availability
  const newData = [...currentData];
  newData[availabilityIndex] = "sold_out";
  
  return {
    prompt: pulse.prompt,
    responses: [meta, newData],
    trivalence: "N"  // Now read-only
  };
}
```

</details>

---

## 💡 Key Concepts: Immutability

**Important**: In the examples above, we **create new pulse objects** rather than modifying existing ones.

```javascript
// ❌ BAD - Modifying original pulse
function badToggle(pulse) {
  pulse.responses[0] = "on";  // Mutates original!
  return pulse;
}

// ✅ GOOD - Creating new pulse
function goodToggle(pulse) {
  return {
    prompt: pulse.prompt,
    responses: ["on"],          // New array
    trivalence: pulse.trivalence
  };
}
```

**Why?** Immutability helps with:
- Debugging (can see before/after)
- Undo/redo features
- React rendering optimization
- Avoiding unexpected side effects

---

## ✅ Check Your Understanding

**Question 1**: Where do pulses change?
<details>
<summary>Click to reveal answer</summary>

Pulses change **inside Design Nodes** (DNs), where business logic executes. They do NOT change while traveling through Intention Tunnels or resting at Objects.
</details>

**Question 2**: What are the three things that can change in a pulse?
<details>
<summary>Click to reveal answer</summary>

1. **Response values** - the actual data
2. **Trivalence** - the state indicator (Y/N/UN)
3. **Both** - response and trivalence together (most common)
</details>

**Question 3**: Why don't we modify the original pulse object?
<details>
<summary>Click to reveal answer</summary>

We create **new pulse objects** (immutability) to:
- Make debugging easier (can see before/after)
- Enable undo/redo
- Optimize React rendering
- Avoid unexpected side effects
</details>

---

## 🎯 Complete Exercise: Counter with History

Let's build a complete example that tracks pulse changes over time.

```javascript
// counter-with-history.js

// Copy helper functions from Exercise 1.1
// [isSimplePulse, getSimpleValue, etc.]

// Function to increment counter (runs inside a Design Node)
function incrementCounter(pulse) {
  const currentValue = parseInt(getSimpleValue(pulse));
  return {
    prompt: pulse.prompt,
    responses: [String(currentValue + 1)],
    trivalence: pulse.trivalence
  };
}

// Function to decrement counter (runs inside a Design Node)
function decrementCounter(pulse) {
  const currentValue = parseInt(getSimpleValue(pulse));
  return {
    prompt: pulse.prompt,
    responses: [String(currentValue - 1)],
    trivalence: pulse.trivalence
  };
}

// Simulate pulse changes over time
const history = [];

// Initial state
let counter = {
  prompt: "counter_value",
  responses: ["0"],
  trivalence: "Y"
};
history.push({ time: "T0", pulse: counter, action: "initial" });

// User clicks increment
counter = incrementCounter(counter);
history.push({ time: "T1", pulse: counter, action: "increment" });

// User clicks increment again
counter = incrementCounter(counter);
history.push({ time: "T2", pulse: counter, action: "increment" });

// User clicks decrement
counter = decrementCounter(counter);
history.push({ time: "T3", pulse: counter, action: "decrement" });

// Display history
console.log("=== Counter History ===");
history.forEach(entry => {
  console.log(
    `${entry.time}: ${entry.action} → value=${getSimpleValue(entry.pulse)}`
  );
});

// Output:
// === Counter History ===
// T0: initial → value=0
// T1: increment → value=1
// T2: increment → value=2
// T3: decrement → value=1
```

**Run this code** to see pulses changing over time!

---

## 💡 Key Takeaways

After completing this exercise, you should understand:

✅ **Pulses are snapshots** - they represent state at a specific moment

✅ **Pulses change in Design Nodes** - where business logic executes

✅ **Pulses DON'T change during travel** - through Intention Tunnels/Objects

✅ **Three things can change**:
- Response values
- Trivalence
- Both together

✅ **Immutability is important** - create new pulses, don't modify originals

✅ **Changes are transformations** - input pulse → function → output pulse

---

## 🎨 Visual Summary

```
PULSE LIFECYCLE

Time T1:  [Pulse A]
            ↓
          Design Node (processes)
            ↓
Time T2:  [Pulse B]  ← Response/TV changed
            ↓
          Intention Tunnel (travels)
            ↓
Time T3:  [Pulse B]  ← Still same (no change during travel)
            ↓
          Object (persists)
            ↓
Time T4:  [Pulse B]  ← Still same (no change at Object)
            ↓
          Design Node (processes)
            ↓
Time T5:  [Pulse C]  ← Response/TV changed again
```

**Key**: Pulses only change at Design Nodes (processing points).

---

## 🧪 Run Your Code

Save your solutions and run them:

```bash
# Save as counter-with-history.js
node counter-with-history.js
```

---

## 📚 Quick Reference

```javascript
// Creating changed pulse (immutable)
function changePulse(originalPulse) {
  return {
    prompt: originalPulse.prompt,        // Keep same
    responses: ["new_value"],            // Change response
    trivalence: "Y"                      // Change trivalence
  };
}

// For simple pulses
const value = getSimpleValue(pulse);
const newPulse = {
  prompt: pulse.prompt,
  responses: [newValue],
  trivalence: newTrivalence
};

// For structured pulses
const meta = pulse.responses[0];
const data = pulse.responses[1];
const newData = [...data];  // Copy and modify
newData[fieldIndex] = newValue;
const newPulse = {
  prompt: pulse.prompt,
  responses: [meta, newData],
  trivalence: newTrivalence
};
```

---

## ➡️ Next Exercise

Now that you understand how pulses change over time, let's see how **multiple pulses travel together** as groups called **Signals**.

**Next**: [Exercise 1.3: Pulses Travel as Signals](./exercise-1.3-pulses-travel-as-signals.md)

In the next exercise, you'll learn:
- What a Signal is (bundle of pulses)
- How pulses travel together
- Why grouping matters
- The form submission analogy

---

## 🔍 Preview: Signals

You've learned:
- Exercise 1.1: What individual pulses are
- Exercise 1.2: How pulses change over time ← **You are here**

**Coming next**:
- Exercise 1.3: Pulses travel in groups (Signals)
- Exercise 1.4: Signals move through Intention Tunnels

This builds toward understanding how complete forms work in Intention Space!

---

**🎉 Congratulations!** You've completed Exercise 1.2. You now understand:
- Pulses are snapshots that change over time
- Changes happen inside Design Nodes
- How to create transformation functions
- Why immutability matters

**You're ready for Exercise 1.3!**

---

**Last Updated**: December 24, 2024  
**Exercise Series**: Intention Tunnel for Beginners  
**License**: Educational use
