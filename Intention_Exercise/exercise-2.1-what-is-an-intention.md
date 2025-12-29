# Exercise 2.1: What is an Intention?

**⏱️ Time**: 10 minutes  
**📚 Level**: 2 - Intentions as Signal Carriers  
**🎯 Prerequisite**: Exercises 1.1-1.3 complete

---

## 🎯 What You'll Learn

- What an Intention is (labeled communication channel)
- How Intentions carry Signals between components
- The relationship between Intentions, Design Nodes, and Objects
- Why Intentions are necessary (not just direct connections)

---

## 🌍 Real-World Analogy: The Restaurant Bell System

Imagine a restaurant kitchen:

### Without Intentions (Direct Connection) ❌
```
Chef finishes cooking
  ↓
Yells "ORDER 42 READY!" into dining room
  ↓
Customer hears... maybe? Chaos!
```

**Problems**:
- No clear channel (who was that for?)
- No persistence (what if customer was in bathroom?)
- No traceability (did the message get through?)

### With Intentions (Labeled Channels) ✅
```
Chef finishes cooking
  ↓
Rings BELL #42 (Intention = labeled channel)
  ↓
Bell holder has order slip (Signal)
  ↓
Waiter picks up slip from bell holder (Object captures state)
  ↓
Delivers to customer
```

**Benefits**:
- ✅ Clear channel (Bell #42 means Order #42)
- ✅ Persistence (slip stays on holder until picked up)
- ✅ Traceability (can see which bells have been rung)

---

## 📖 What is an Intention?

An **Intention** is a **labeled communication channel** that carries a Signal (collection of Pulses) from one component to another.

### Structure
```javascript
Intention = {
  id: string,           // e.g., "INT_ORDER_READY"
  signal: Signal,       // Collection of Pulses
  timestamp: number,    // When it was emitted
  source: string        // Who emitted it (DN or Object)
}
```

### Key Properties

1. **Labeled**: Has a unique ID (e.g., `INT_ORDER_READY`, `INT_PAYMENT_PROCESSED`)
2. **Directional**: Flows from one component to another
3. **Carries Data**: Always includes a Signal (Pulses)
4. **Traceable**: Can see which Intentions were emitted when

---

## 🏗️ The Three Players

Before we dive deeper, let's understand who uses Intentions:

### 1. Design Nodes (DN) - The Workers

```
┌─────────────────────────────┐
│     Design Node (DN)        │
│                             │
│  ┌─────────────────────┐   │
│  │  BLACKBOX PROCESS   │   │ ← Internal workings hidden
│  │  (your code lives   │   │
│  │   here)             │   │
│  └─────────────────────┘   │
│           ↓                 │
│   Sets/modifies Pulses      │ ← This is what DN does
│           ↓                 │
│   Emits Intention           │ ← Sends results out
└─────────────────────────────┘
```

**What DNs Do**:
- Contain your business logic (blackbox to Intention Space)
- Can **setup/modify Pulse response values**
- Emit Intentions carrying Signals (their output)

**Example**:
```
DN_CalculateTotal (blackbox)
  ↓
Modifies: order_total Pulse from "$0" to "$35.97"
  ↓
Emits: INT_TOTAL_CALCULATED
  ↓
Carries Signal with updated order_total Pulse
```

### 2. Objects (O) - The State Capturers

```
┌─────────────────────────────┐
│       Object (O)            │
│                             │
│  Receives Intention         │ ← Captures from DN
│           ↓                 │
│  Captures state snapshot    │ ← Holds the Pulses
│           ↓                 │
│  Reflects Intention         │ ← Passes forward
└─────────────────────────────┘
```

**What Objects Do**:
- **Capture states from DN blackbox processes**
- Use **specific Intentions** as the capture mechanism
- Reflect Intentions forward (pure pass-through)
- NO computation (just state capture and reflection)

**Example**:
```
Object_OrderState
  ↓
Receives: INT_TOTAL_CALCULATED (from DN)
  ↓
Captures: Current state of order_total Pulse
  ↓
Reflects: INT_DISPLAY_TOTAL (to next component)
```

### 3. Intentions (I) - The Communication Channels

```
Design Node → Intention → Object → Intention → Design Node
              ↑                     ↑
         Labeled channel       Labeled channel
         carrying Signal       carrying Signal
```

**What Intentions Do**:
- Provide **labeled channels** for communication
- Carry **Signals** (collections of Pulses)
- Enable **traceability** (can see what flowed when)

---

## 🔄 The Flow Pattern: DN → I → O → I → DN

This is the **fundamental pattern** in Intention Space:

```
┌──────────┐
│   DN_A   │ (Does work, modifies Pulses)
└────┬─────┘
     │ emits
     ↓
┌──────────┐
│   INT_1  │ (Carries Signal with modified Pulses)
└────┬─────┘
     │ absorbed by
     ↓
┌──────────┐
│  Object  │ (Captures state, reflects forward)
└────┬─────┘
     │ reflects
     ↓
┌──────────┐
│   INT_2  │ (Carries Signal, maybe modified)
└────┬─────┘
     │ absorbed by
     ↓
┌──────────┐
│   DN_B   │ (Does more work)
└──────────┘
```

**Why this pattern?**
- **Never DN → DN directly** ❌
- **Always DN → I → O → I → DN** ✅

**Reason**: Object provides **persistence point** for state capture. If DN_B fails, Object still holds the state from DN_A. Can retry without re-running DN_A!

---

## 📝 Example: Order Processing

Let's trace Intentions through a simple order flow:

### Scenario
User orders Biryani. System needs to:
1. Calculate total price
2. Process payment
3. Confirm order

### The Flow

```
User clicks "Place Order"
     ↓
┌─────────────────┐
│ DN_CalculateTotal│ (blackbox: adds prices, applies tax)
└────────┬────────┘
         │ emits
         ↓
    INT_TOTAL_READY (carries Signal with order_total Pulse)
         ↓
┌─────────────────┐
│ Object_OrderState│ (captures total, reflects forward)
└────────┬────────┘
         │ reflects
         ↓
    INT_PROCESS_PAYMENT (carries same Signal)
         ↓
┌─────────────────┐
│ DN_ChargeCard    │ (blackbox: calls payment API)
└────────┬────────┘
         │ emits
         ↓
    INT_PAYMENT_DONE (carries Signal with payment_status Pulse)
         ↓
┌─────────────────┐
│ Object_PaymentState│ (captures payment result)
└────────┬────────┘
         │ reflects
         ↓
    INT_CONFIRM_ORDER (carries updated Signal)
         ↓
┌─────────────────┐
│ DN_SendConfirmation│ (blackbox: sends email)
└─────────────────┘
```

**Notice**:
- Each DN is a blackbox (we don't see inside)
- Each Intention is labeled (INT_TOTAL_READY, INT_PROCESS_PAYMENT, etc.)
- Each Object captures state at that moment
- Signal flows through the entire chain

---

## 🎨 Intention Naming Convention

Intentions are typically named with prefix `INT_` followed by action/state:

```javascript
// Action-based (what's happening)
"INT_ORDER_CREATED"
"INT_PAYMENT_PROCESSING"  
"INT_TOTAL_CALCULATED"

// State-based (what's ready)
"INT_DATA_VALIDATED"
"INT_FORM_SUBMITTED"
"INT_RESULT_READY"

// Target-based (who should act)
"INT_DISPLAY_TOTAL"
"INT_SEND_EMAIL"
"INT_UPDATE_DATABASE"
```

**The name should answer**: "What is the purpose of this communication?"

---

## 🎯 Why Intentions Matter

### Without Intentions (Direct DN → DN)
```
DN_A → DN_B
```

**Problems**:
- ❌ No state capture point (if DN_B fails, must re-run DN_A)
- ❌ No traceability (can't see what was communicated)
- ❌ Tight coupling (DN_A must know about DN_B)

### With Intentions (DN → I → O → I → DN)
```
DN_A → INT_1 → Object → INT_2 → DN_B
```

**Benefits**:
- ✅ State captured at Object (can retry DN_B without re-running DN_A)
- ✅ Full traceability (can see INT_1 was emitted, INT_2 was reflected)
- ✅ Loose coupling (DN_A only knows about INT_1, not DN_B)
- ✅ Clear contracts (Intention name defines the communication purpose)

---

## 💡 Key Takeaways

### ✅ Remember This

1. **Intention = Labeled Communication Channel**
   - Has unique ID (e.g., `INT_ORDER_READY`)
   - Carries a Signal (collection of Pulses)
   - Traceable (can see when it was emitted)

2. **Design Nodes = Blackbox Workers**
   - Contain your business logic (hidden from Intention Space)
   - Can setup/modify Pulse response values
   - Emit Intentions with their results

3. **Objects = State Capturers**
   - Capture states from DN processes
   - Use Intentions as the capture mechanism
   - Pure reflection (NO computation)

4. **The Pattern: DN → I → O → I → DN**
   - Never DN → DN directly ❌
   - Always with Intentions and Objects ✅
   - Object provides persistence point

### ❌ Common Misconceptions

- ❌ "Intentions are just function calls" → No! They're labeled channels with persistence
- ❌ "Objects compute things" → No! They only capture and reflect state
- ❌ "We can skip Objects" → No! They provide critical persistence points

---

## 🤔 Check Your Understanding

### Question 1
Which component can modify Pulse response values?
- a) Intentions
- b) Objects  
- c) Design Nodes
- d) Signals

<details>
<summary>Answer</summary>

**c) Design Nodes**

Design Nodes contain the business logic and can setup/modify Pulse response values. Objects only capture and reflect state (no modification). Intentions and Signals just carry data.
</details>

### Question 2
What is the purpose of having an Object between two Design Nodes?
- a) To do calculations
- b) To capture state at that point
- c) To validate data
- d) To display UI

<details>
<summary>Answer</summary>

**b) To capture state at that point**

Objects provide a persistence point. If the second DN fails, the Object still holds the state from the first DN, allowing retry without re-running the first DN.
</details>

### Question 3
Complete this pattern: `DN_A → _____ → Object → _____ → DN_B`

<details>
<summary>Answer</summary>

**`DN_A → Intention → Object → Intention → DN_B`**

Intentions are the communication channels that carry Signals between components.
</details>

---

## 📚 Real-World Metaphor Summary

Think of Intentions like **labeled delivery routes**:

```
Chef (DN)
  ↓
Rings Bell #42 (Intention with ID)
  ↓
Bell holder keeps order slip (Object captures)
  ↓
Rings Bell for table (Intention reflected)
  ↓
Customer (next DN) receives food
```

Each bell is labeled, each slip stays until picked up, each handoff is traceable.

---

## ➡️ Next Exercise

**Exercise 2.2: DN Emits Intention with Signal**

You'll see how Design Nodes create Intentions and attach Signals to communicate their results.

---

## 🎓 Reflection Questions

1. **Why can't we just have DN → DN directly?**  
   Think: What happens if the second DN fails?

2. **What's the difference between an Intention and a Signal?**  
   Hint: Channel vs. Cargo

3. **In a restaurant, what would be the Intentions for:**
   - Chef finishes cooking? → `INT_____`
   - Waiter picks up order? → `INT_____`
   - Customer finishes eating? → `INT_____`

---

**Estimated time**: 10 minutes  
**Concepts introduced**: Intention, DN (blackbox), Object (state capture)  
**Next step**: See how DNs actually emit these Intentions
