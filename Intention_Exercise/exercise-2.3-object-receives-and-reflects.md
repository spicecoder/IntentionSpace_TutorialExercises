# Exercise 2.3: Object Receives and Reflects

**⏱️ Time**: 15 minutes  
**📚 Level**: 2 - Intentions as Signal Carriers  
**🎯 Prerequisite**: Exercises 2.1-2.2 complete

---

## 🎯 What You'll Learn

- How Objects capture emitted Intentions
- What "pure reflection" means (no computation)
- Why Objects provide persistence points
- The difference between DN emit and Object reflect

---

## 🌍 Real-World Analogy: The Waiter's Role

Continuing our restaurant analogy:

### What the Waiter Does (Object)

```
Chef rings BELL #42 "INT_ORDER_READY"
     ↓
Waiter HEARS the bell
     ↓
Waiter PICKS UP the order slip (captures state)
     ↓
Waiter HOLDS the slip (persistence point)
     ↓
Waiter WALKS to table
     ↓
Waiter rings TABLE BELL "INT_DELIVER_ORDER"
     ↓
Customer receives food
```

**Key Observation**: The waiter doesn't:
- ❌ Cook the food (that's the chef's job)
- ❌ Modify the order (doesn't change what's on the slip)
- ❌ Calculate prices (doesn't do math)

The waiter ONLY:
- ✅ Picks up the order slip (captures)
- ✅ Holds it temporarily (persists)
- ✅ Passes it forward (reflects)

**This is what Objects do in Intention Space!**

---

## 📖 What is "Receive and Reflect"?

An **Object** acts as a pure intermediary between Design Nodes:

1. **Receives** (absorbs) an Intention emitted by a DN
2. **Captures** the state (Pulses in the Signal)
3. **Persists** the state temporarily
4. **Reflects** the Intention forward (possibly to different Intention)
5. **NO COMPUTATION** happens inside the Object

### The Object's Purpose

```
Design Node A (does work)
     ↓ emits INT_1
Object (captures state) ← State is safe here!
     ↓ reflects INT_2
Design Node B (does more work)
```

**Why Objects exist**:
- Provide a **persistence point** between DNs
- Enable **retry** without re-running previous DN
- Maintain **state snapshots** at each stage
- Allow **intention mapping** (INT_1 → INT_2)

---

## 🏗️ Anatomy of Receive and Reflect

### Step 1: Object Receives Intention

```
DN_CalculateTotal emits "INT_TOTAL_CALCULATED"
     ↓
Object_OrderState RECEIVES it
```

**What happens**:
```javascript
// Conceptually (not real code yet)
Object_OrderState.receive(intention) {
  // Store the intention
  this.lastReceived = intention;
  
  // Store timestamp
  this.receivedAt = Date.now();
  
  // Store source
  this.receivedFrom = intention.source;
}
```

### Step 2: Object Captures State (Signal)

```javascript
// Object holds the Signal from the Intention
Object_OrderState.capturedSignal = intention.signal;

// The Signal contains all the Pulses:
// - subtotal: "$35.97"
// - tax: "$3.24"
// - shipping: "$5.00"
// - total: "$44.21"
// - status: "calculated"
```

**Key Point**: Object now holds a **snapshot** of state at this moment!

### Step 3: Object Persists State

```
Time: 10:00:00 - DN emits INT_TOTAL_CALCULATED
Time: 10:00:01 - Object receives and captures
Time: 10:00:02 - Object holds state (persistence)
Time: 10:00:03 - Next DN might fail!
Time: 10:00:04 - Object STILL holds state ✅
Time: 10:00:05 - Can retry without re-calculating!
```

**This is why Objects are crucial!**

### Step 4: Object Reflects (Maps Intention)

```javascript
// Object maps received Intention to reflected Intention
Object_OrderState.reflect() {
  // NO COMPUTATION HERE!
  
  // Just map intention names:
  const mappings = {
    "INT_TOTAL_CALCULATED": "INT_PROCESS_PAYMENT"
  };
  
  const reflectedIntentionId = mappings[this.lastReceived.id];
  
  // Reflect with same or modified Signal
  this.emit(reflectedIntentionId, this.capturedSignal);
}
```

**Result**: Object reflects `INT_PROCESS_PAYMENT` with the captured Signal!

---

## 🎨 Visual Flow: Receive → Reflect

```
┌─────────────────────────────────────┐
│      DN_CalculateTotal              │
│                                     │
│  (calculates total = $44.21)        │
│                                     │
│  Emits: INT_TOTAL_CALCULATED        │
└─────────────┬───────────────────────┘
              │
              ↓ Intention flies out
              │
┌─────────────▼───────────────────────┐
│      Object_OrderState               │
│                                     │
│  RECEIVES: INT_TOTAL_CALCULATED     │
│       ↓                             │
│  CAPTURES: Signal with Pulses       │
│    - subtotal: "$35.97"             │
│    - tax: "$3.24"                   │
│    - total: "$44.21"                │
│       ↓                             │
│  PERSISTS: State snapshot           │
│    (stored in Object's memory)      │
│       ↓                             │
│  REFLECTS: INT_PROCESS_PAYMENT      │
│    (maps intention name)            │
│       ↓                             │
│  NO COMPUTATION! Just pass-through  │
└─────────────┬───────────────────────┘
              │
              ↓ Reflected intention
              │
┌─────────────▼───────────────────────┐
│      DN_ProcessPayment              │
│                                     │
│  (receives INT_PROCESS_PAYMENT)     │
│  (gets Signal with total: $44.21)   │
│                                     │
│  Does payment processing...         │
└─────────────────────────────────────┘
```

---

## 📝 Detailed Example: Order State Object

### Scenario
We need an Object between DN_CalculateTotal and DN_ProcessPayment.

### Object Configuration

```javascript
Object_OrderState = {
  name: "Object_OrderState",
  
  // What Intentions can this Object receive?
  accepts: [
    "INT_TOTAL_CALCULATED"
  ],
  
  // How does this Object map Intentions?
  intentionMappings: {
    "INT_TOTAL_CALCULATED": "INT_PROCESS_PAYMENT"
  },
  
  // State storage
  capturedState: null,
  receivedAt: null,
  
  // NO computation functions! ❌
  // Objects don't have perform() or calculate()
}
```

### When DN Emits

```javascript
// DN_CalculateTotal finishes work
const intention = {
  id: "INT_TOTAL_CALCULATED",
  signal: {
    pulses: [
      { prompt: "order_total", responses: ["$44.21"], trivalence: "N" },
      { prompt: "subtotal", responses: ["$35.97"], trivalence: "N" },
      { prompt: "tax", responses: ["$3.24"], trivalence: "N" }
    ]
  },
  timestamp: 1703692800000,
  source: "DN_CalculateTotal"
};

// DN emits it
DN_CalculateTotal.emit(intention);
```

### Object Receives

```javascript
// Object_OrderState receives the Intention
Object_OrderState.receive(intention) {
  // Step 1: Check if we accept this Intention
  if (!this.accepts.includes(intention.id)) {
    return; // Ignore it
  }
  
  // Step 2: Capture the Signal
  this.capturedState = {
    intention: intention.id,
    signal: intention.signal,
    timestamp: Date.now(),
    source: intention.source
  };
  
  // Step 3: Store metadata
  this.receivedAt = Date.now();
  
  console.log("Object captured state:", this.capturedState);
  
  // Step 4: Reflect it forward
  this.reflect();
}
```

### Object Reflects

```javascript
Object_OrderState.reflect() {
  // Step 1: Map the Intention
  const receivedId = this.capturedState.intention;
  const reflectedId = this.intentionMappings[receivedId];
  
  if (!reflectedId) {
    console.log("No mapping for", receivedId);
    return;
  }
  
  // Step 2: Create reflected Intention
  const reflectedIntention = {
    id: reflectedId,  // "INT_PROCESS_PAYMENT"
    signal: this.capturedState.signal,  // Same Signal!
    timestamp: Date.now(),
    source: this.name  // "Object_OrderState"
  };
  
  // Step 3: Emit the reflected Intention
  this.emit(reflectedIntention);
  
  console.log("Object reflected:", reflectedId);
}
```

**Notice**: Object does NO computation! Just:
1. Captures
2. Persists
3. Maps intention name
4. Reflects

---

## 🔄 Why "Pure Reflection" Matters

### Pure Reflection = No Computation

```javascript
// ✅ CORRECT: Pure reflection
Object.reflect() {
  const mappings = {
    "INT_A": "INT_B"
  };
  
  const reflectedId = mappings[receivedId];
  emit(reflectedId, capturedSignal);
  
  // No calculations!
  // No business logic!
  // Just map and pass!
}

// ❌ WRONG: Object doing computation
Object.reflect() {
  // This is WRONG! Don't do this!
  const total = calculateTotal(capturedSignal);  // ❌
  const tax = total * 0.09;  // ❌
  
  // This is DN's job, not Object's!
}
```

**Why keep Objects pure?**

1. **Testability**: Easy to test (just check mapping)
2. **Traceability**: Can see exactly what was reflected
3. **Genericity**: Works across platforms (no platform-specific logic)
4. **Maintainability**: Clear separation of concerns

---

## 🎯 The Retry Capability

This is the KEY benefit of having Objects:

### Without Object (DN → DN directly) ❌

```
DN_CalculateTotal (calculates total: $44.21)
     ↓
DN_ProcessPayment (tries to charge)
     ↓
❌ Network error! Payment fails!
     ↓
Must RE-RUN DN_CalculateTotal (expensive!)
     ↓
Calculate total again (wasted work)
     ↓
Try payment again
```

### With Object (DN → O → DN) ✅

```
DN_CalculateTotal (calculates total: $44.21)
     ↓
Object_OrderState CAPTURES state ← State is safe!
     ↓
DN_ProcessPayment (tries to charge)
     ↓
❌ Network error! Payment fails!
     ↓
Object STILL HOLDS state ← No need to recalculate!
     ↓
Just retry payment with captured state ✅
     ↓
No wasted work!
```

**The Object provides a checkpoint!**

---

## 🎨 Intention Mapping in Objects

Objects can map Intentions in different ways:

### 1. One-to-One Mapping

```javascript
intentionMappings: {
  "INT_TOTAL_CALCULATED": "INT_PROCESS_PAYMENT"
}

// INT_TOTAL_CALCULATED → INT_PROCESS_PAYMENT
```

### 2. Multiple Sources to One Target

```javascript
intentionMappings: {
  "INT_ORDER_VALIDATED": "INT_STORE_ORDER",
  "INT_PAYMENT_CONFIRMED": "INT_STORE_ORDER"
}

// Both map to same reflected Intention
```

### 3. Conditional Mapping (Advanced)

```javascript
// Based on Pulse values (still no computation!)
intentionMappings: {
  "INT_VALIDATION_DONE": (signal) => {
    const validPulse = signal.pulses.find(p => p.prompt === "is_valid");
    return validPulse.responses[0] === "true" 
      ? "INT_PROCEED_ORDER" 
      : "INT_SHOW_ERRORS";
  }
}

// Note: This is just choosing a path, not computing!
```

---

## 💡 Key Takeaways

### ✅ Remember This

1. **Objects Capture State**
   - Receive Intention from DN
   - Store Signal (snapshot of Pulses)
   - Persist until next stage needs it

2. **Objects Reflect (Don't Compute)**
   - Pure pass-through
   - Map Intention names only
   - NO business logic
   - NO calculations

3. **Objects Provide Retry Capability**
   - State is safe at the Object
   - If next DN fails, can retry
   - No need to re-run previous DN

4. **The Pattern: DN → I → O → I → DN**
   - DN emits (after work)
   - Object receives and captures (persistence)
   - Object reflects (mapping)
   - Next DN absorbs (continues work)

### ❌ Common Misconceptions

- ❌ "Objects can do calculations" → No! Only DNs compute
- ❌ "Objects modify Pulse values" → No! Only DNs modify
- ❌ "Reflect = same as emit" → No! Reflect is mapping, emit is creating
- ❌ "We can skip Objects for efficiency" → No! Objects provide critical checkpoints

---

## 🤔 Check Your Understanding

### Question 1
What can an Object do with Pulse values?
- a) Calculate new values
- b) Modify existing values
- c) Capture and hold values
- d) Delete values

<details>
<summary>Answer</summary>

**c) Capture and hold values**

Objects can ONLY capture and persist Pulse values - they cannot calculate, modify, or delete them. That's the job of Design Nodes.
</details>

### Question 2
Why do we need Objects between Design Nodes?
- a) To do calculations faster
- b) To provide retry capability
- c) To validate data
- d) To render UI

<details>
<summary>Answer</summary>

**b) To provide retry capability**

Objects provide persistence points. If the next DN fails, the Object still holds the state from the previous DN, allowing retry without re-running expensive work.
</details>

### Question 3
What does "pure reflection" mean?
- a) Object mirrors the DN's work
- b) Object passes data without computation
- c) Object checks data quality
- d) Object optimizes performance

<details>
<summary>Answer</summary>

**b) Object passes data without computation**

Pure reflection means the Object just captures, persists, and reflects Intentions/Signals without doing any calculations or business logic.
</details>

### Question 4
When DN emits `INT_TOTAL_CALCULATED`, Object can reflect:
- a) Only `INT_TOTAL_CALCULATED` (same name)
- b) Any Intention name (based on mapping)
- c) Only Intentions that start with "INT_"
- d) Multiple Intentions at once

<details>
<summary>Answer</summary>

**b) Any Intention name (based on mapping)**

Objects can map received Intentions to different reflected Intentions. For example, `INT_TOTAL_CALCULATED` might reflect as `INT_PROCESS_PAYMENT`.
</details>

---

## 📚 Restaurant Analogy Summary

```
CHEF (Design Node)
    ↓
Rings BELL #42 "INT_ORDER_READY"
    ↓
Order slip attached (Signal with dishes, prices)
    ↓
    
WAITER (Object)
    ↓
Hears bell, picks up slip (receives & captures)
    ↓
HOLDS the slip (persistence point)
  - If customer not ready, waiter waits
  - If delivery fails, waiter still has slip
  - Can retry delivery without asking chef to remake
    ↓
Walks to table (no cooking, no price changes!)
    ↓
Rings TABLE BELL "INT_DELIVER_ORDER" (reflects)
    ↓
    
CUSTOMER (Next Design Node)
    ↓
Receives food
```

**The waiter is a pure intermediary - just like Objects!**

---

## 🎯 Practice: Design an Object

### Scenario: User Registration Flow

```
DN_ValidateEmail
    ↓
  (validates email format)
    ↓
  Emits: INT_EMAIL_VALIDATED
  Signal: { email_valid: "true", email: "user@example.com" }
    ↓
    
Object_??? ← Design this!
    ↓
    
DN_CreateAccount
    ↓
  (creates database record)
    ↓
  Expects: INT_CREATE_USER
```

**Your Task**: Design the Object in between.

```javascript
Object_UserValidation = {
  name: "Object_UserValidation",
  
  // 🔧 TODO: What Intentions can this Object receive?
  accepts: [
    // ???
  ],
  
  // 🔧 TODO: How should this Object map Intentions?
  intentionMappings: {
    // "INT_???" : "INT_???"
  },
  
  // State storage (already provided)
  capturedState: null,
  receivedAt: null
}
```

<details>
<summary>Solution</summary>

```javascript
Object_UserValidation = {
  name: "Object_UserValidation",
  
  accepts: [
    "INT_EMAIL_VALIDATED"
  ],
  
  intentionMappings: {
    "INT_EMAIL_VALIDATED": "INT_CREATE_USER"
  },
  
  capturedState: null,
  receivedAt: null
}
```

**Explanation**:
- Accepts `INT_EMAIL_VALIDATED` from DN_ValidateEmail
- Captures the state (email, validation result)
- Reflects as `INT_CREATE_USER` for DN_CreateAccount
- NO computation - just pure mapping!

**Benefit**: If DN_CreateAccount fails (database down), Object_UserValidation still holds the validated email. Can retry account creation without re-validating!
</details>

---

## ➡️ Next Exercise

**Exercise 2.4: Why Never DN → DN Directly**

You'll learn the architectural principle behind the DN → I → O → I → DN pattern and why skipping Objects breaks the system's reliability.

---

## 🎓 Reflection Questions

1. **What would happen if Objects could do calculations?**  
   Think: Purity, testability, traceability

2. **Why is the captured state called a "snapshot"?**  
   Hint: It's a moment in time

3. **Can an Object receive multiple different Intentions?**  
   Think: Multiple DNs might emit to same Object

4. **In colab.kitchen, what might these Objects capture?**
   - Object_CartState → Captures: ???
   - Object_OrderValidation → Captures: ???
   - Object_PaymentState → Captures: ???

---

**Estimated time**: 15 minutes  
**Concepts reinforced**: Object purity, state capture, reflection  
**New concept**: Objects as persistence checkpoints  
**Next step**: Understand why DN → DN directly is architecturally wrong
