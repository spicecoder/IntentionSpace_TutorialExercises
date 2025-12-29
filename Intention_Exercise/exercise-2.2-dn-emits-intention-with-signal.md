# Exercise 2.2: DN Emits Intention with Signal

**⏱️ Time**: 15 minutes  
**📚 Level**: 2 - Intentions as Signal Carriers  
**🎯 Prerequisite**: Exercise 2.1 complete

---

## 🎯 What You'll Learn

- How Design Nodes create and emit Intentions
- What happens during the "emit" moment
- How Signals get attached to Intentions
- The relationship between DN's internal work and its output

---

## 🌍 Real-World Analogy: The Chef Completes an Order

Let's continue our restaurant analogy from Exercise 2.1:

### Inside the Kitchen (DN Blackbox)

```
┌─────────────────────────────────────┐
│        KITCHEN (Design Node)        │
│                                     │
│  Chef receives order:               │
│  - 2x Biryani                       │
│  - 1x Curry                         │
│                                     │
│  [BLACKBOX WORK HAPPENS HERE]       │
│  - Gathers ingredients              │
│  - Cooks dishes                     │
│  - Plates food                      │
│  - Calculates total time            │
│                                     │
│  Chef modifies order slip:          │
│  ✏️  status: "ready"                │
│  ✏️  cook_time: "25 minutes"        │
│  ✏️  quality_check: "passed"        │
│                                     │
└─────────────────────────────────────┘
         ↓
    Chef is done!
         ↓
    What happens next?
```

### The Emit Moment

```
Chef rings BELL #42 
    ↓
Bell labeled "INT_ORDER_READY"
    ↓
Attached to bell: ORDER SLIP (Signal)
    ↓
Order slip contains:
  - dishes (what was made)
  - status (ready/not ready)
  - cook_time (how long it took)
  - quality_check (passed/failed)
```

**This is "emitting an Intention with Signal"!**

---

## 📖 What Does "Emit" Mean?

**Emit** = Send out an Intention carrying a Signal

When a Design Node finishes its work, it:
1. **Prepares the result** (modifies Pulse values)
2. **Packages into Signal** (groups related Pulses)
3. **Attaches to Intention** (labels the communication)
4. **Sends it out** (emits to the system)

### The Emit Process

```
Design Node Internal Work (Blackbox)
         ↓
    Pulses Modified
         ↓
    Pulses Grouped into Signal
         ↓
    Signal Attached to Intention
         ↓
    Intention Emitted
         ↓
    Available for Objects to Capture
```

---

## 🏗️ Anatomy of an Emit

Let's break down what happens when a DN emits:

### Step 1: DN Does Its Work (Blackbox)

```
DN_CalculateTotal (inside the blackbox):
  - Input: cart items
  - Process: sum prices, apply tax, add shipping
  - Output: modified Pulses
```

**Remember**: We don't see inside the DN. It's a blackbox!

### Step 2: DN Modifies Pulse Values

```javascript
// Before DN execution
subtotal_pulse = {
  prompt: "order_subtotal",
  responses: ["$0.00"],
  trivalence: "N"
}

// After DN execution (DN modified it!)
subtotal_pulse = {
  prompt: "order_subtotal",
  responses: ["$35.97"],  // ← DN changed this!
  trivalence: "N"
}
```

**Key Point**: Only DNs can modify Pulse response values!

### Step 3: DN Groups Pulses into Signal

```javascript
// DN creates a Signal with multiple Pulses
const orderSignal = {
  pulses: [
    subtotal_pulse,      // "$35.97"
    tax_pulse,           // "$3.24"
    shipping_pulse,      // "$5.00"
    total_pulse,         // "$44.21"
    order_status_pulse   // "calculated"
  ]
}
```

### Step 4: DN Creates Intention with Signal

```javascript
const intention = {
  id: "INT_TOTAL_CALCULATED",
  signal: orderSignal,
  timestamp: Date.now(),
  source: "DN_CalculateTotal"
}
```

### Step 5: DN Emits the Intention

```javascript
// Conceptually (not real code yet):
DN_CalculateTotal.emit(intention);

// Or more simply:
DN_CalculateTotal.emit("INT_TOTAL_CALCULATED", orderSignal);
```

**Result**: The Intention is now "in flight" and can be captured by an Object!

---

## 🎨 Visual Flow: From Work to Emit

```
┌──────────────────────────────────────────┐
│       Design Node: DN_CalculateTotal     │
│                                          │
│  ┌────────────────────────────────┐     │
│  │     BLACKBOX PROCESS           │     │
│  │                                │     │
│  │  1. Receive cart items         │     │
│  │  2. Sum prices                 │     │
│  │  3. Calculate tax              │     │
│  │  4. Add shipping               │     │
│  │  5. Compute total              │     │
│  │                                │     │
│  │  ✏️  Modify Pulse values        │     │
│  └────────────────────────────────┘     │
│               ↓                          │
│  ┌────────────────────────────────┐     │
│  │   Package into Signal          │     │
│  │   - subtotal                   │     │
│  │   - tax                        │     │
│  │   - shipping                   │     │
│  │   - total                      │     │
│  └────────────────────────────────┘     │
│               ↓                          │
│  ┌────────────────────────────────┐     │
│  │   Create Intention             │     │
│  │   ID: "INT_TOTAL_CALCULATED"   │     │
│  │   Signal: orderSignal          │     │
│  └────────────────────────────────┘     │
│               ↓                          │
│          EMIT! 🔔                        │
└──────────────────────────────────────────┘
               ↓
    Intention with Signal flies out
               ↓
    Ready to be captured by Object
```

---

## 📝 Detailed Example: Order Calculation

### Scenario
User has items in cart:
- 2x Biryani @ $12.99 each
- 1x Curry @ $9.99

DN_CalculateTotal needs to:
1. Calculate subtotal
2. Add tax (9%)
3. Add shipping ($5)
4. Compute total

### Before DN Execution

```javascript
// Initial Pulse states (before DN runs)
const pulses_before = {
  subtotal: {
    prompt: "order_subtotal",
    responses: ["$0.00"],
    trivalence: "N"
  },
  tax: {
    prompt: "order_tax",
    responses: ["$0.00"],
    trivalence: "N"
  },
  shipping: {
    prompt: "shipping_cost",
    responses: ["$0.00"],
    trivalence: "N"
  },
  total: {
    prompt: "order_total",
    responses: ["$0.00"],
    trivalence: "N"
  },
  status: {
    prompt: "calculation_status",
    responses: ["pending"],
    trivalence: "UN"  // Unknown/action needed
  }
}
```

### Inside DN Blackbox (We Don't See This!)

```javascript
// This is conceptual - actual code is hidden in blackbox
function DN_CalculateTotal_perform(cartItems) {
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  // subtotal = 12.99*2 + 9.99 = 35.97
  
  // Calculate tax
  const tax = subtotal * 0.09;
  // tax = 35.97 * 0.09 = 3.24
  
  // Add shipping
  const shipping = 5.00;
  
  // Calculate total
  const total = subtotal + tax + shipping;
  // total = 35.97 + 3.24 + 5.00 = 44.21
  
  // Return modified Pulse values
  return {
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total,
    status: "calculated"
  };
}
```

### After DN Execution (Pulses Modified)

```javascript
// DN has modified the Pulse values!
const pulses_after = {
  subtotal: {
    prompt: "order_subtotal",
    responses: ["$35.97"],  // ← Changed!
    trivalence: "N"
  },
  tax: {
    prompt: "order_tax",
    responses: ["$3.24"],   // ← Changed!
    trivalence: "N"
  },
  shipping: {
    prompt: "shipping_cost",
    responses: ["$5.00"],   // ← Changed!
    trivalence: "N"
  },
  total: {
    prompt: "order_total",
    responses: ["$44.21"],  // ← Changed!
    trivalence: "N"
  },
  status: {
    prompt: "calculation_status",
    responses: ["calculated"], // ← Changed!
    trivalence: "N"            // ← Changed (from UN to N)!
  }
}
```

### DN Groups into Signal

```javascript
const calculationSignal = {
  pulses: [
    pulses_after.subtotal,
    pulses_after.tax,
    pulses_after.shipping,
    pulses_after.total,
    pulses_after.status
  ]
}
```

### DN Emits Intention

```javascript
const intention = {
  id: "INT_TOTAL_CALCULATED",
  signal: calculationSignal,
  timestamp: 1703692800000,  // 2024-12-27 10:00:00
  source: "DN_CalculateTotal"
}

// DN emits it!
emit(intention);
```

**Result**: The Intention is now available for an Object to capture!

---

## 🔄 What Happens After Emit?

After a DN emits an Intention:

```
DN emits Intention
     ↓
Intention "flies" through system
     ↓
Object (waiting) captures it
     ↓
Object holds the state snapshot
     ↓
Object reflects to next Intention
     ↓
Next DN can absorb it
```

**In our analogy**:
```
Chef rings bell (emits INT_ORDER_READY)
     ↓
Bell hangs with order slip attached
     ↓
Waiter (Object) picks up slip
     ↓
Waiter holds the order details
     ↓
Waiter rings customer bell (reflects INT_DELIVER_ORDER)
     ↓
Customer (next DN) receives food
```

---

## 🎯 Key Principles of Emit

### 1. Only DNs Can Emit (Initially)

```
Design Node → Emits Intention ✅
Object → Reflects Intention ✅  (but doesn't emit new ones from scratch)
```

**Why?** DNs do the work, Objects just capture and reflect.

### 2. Emit = Completing Work

Emit happens AFTER the DN's work is done:

```
DN starts
  ↓
DN does work (blackbox)
  ↓
DN modifies Pulses
  ↓
DN packages Signal
  ↓
DN emits Intention ← Emit is the LAST step
```

### 3. Signal Must Be Complete

The Signal should contain ALL Pulses that the next stage needs:

```
❌ Bad Emit (incomplete Signal):
{
  id: "INT_TOTAL_CALCULATED",
  signal: {
    pulses: [total_pulse]  // Missing subtotal, tax, shipping!
  }
}

✅ Good Emit (complete Signal):
{
  id: "INT_TOTAL_CALCULATED",
  signal: {
    pulses: [
      subtotal_pulse,
      tax_pulse,
      shipping_pulse,
      total_pulse,
      status_pulse
    ]
  }
}
```

### 4. Intention Name Describes Purpose

The Intention ID should clearly state what just happened:

```
✅ Good Names:
"INT_TOTAL_CALCULATED"      → Total was just calculated
"INT_PAYMENT_PROCESSED"     → Payment processing complete
"INT_ORDER_VALIDATED"       → Validation finished

❌ Bad Names:
"INT_DATA"                  → Too vague
"INT_STEP2"                 → What's step 2?
"INT_DO_SOMETHING"          → What something?
```

---

## 🎨 Multiple DNs Emitting

Different DNs can emit different Intentions:

```
DN_ValidateOrder
     ↓
  (work happens)
     ↓
  emits "INT_ORDER_VALIDATED"
     ↓
  Signal contains: validation_result, error_messages

DN_ProcessPayment
     ↓
  (work happens)
     ↓
  emits "INT_PAYMENT_PROCESSED"
     ↓
  Signal contains: transaction_id, payment_status

DN_SendConfirmation
     ↓
  (work happens)
     ↓
  emits "INT_EMAIL_SENT"
     ↓
  Signal contains: email_address, sent_timestamp
```

Each DN emits when ITS work is complete.

---

## 💡 Key Takeaways

### ✅ Remember This

1. **Emit = Send Out Intention with Signal**
   - Happens AFTER DN completes its work
   - Signal contains all modified Pulses
   - Intention has clear ID describing purpose

2. **Only DNs Modify Pulse Values**
   - DNs are the workers (contain business logic)
   - They change Pulse responses as part of their work
   - Objects never modify - they only capture and reflect

3. **Emit is the Output Stage**
   - DN receives input → does work → emits output
   - The emitted Intention carries the results
   - Next stage can capture these results

4. **Signal Must Be Complete**
   - Include all Pulses needed by next stage
   - Don't leave out important information
   - Group related Pulses together

### ❌ Common Misconceptions

- ❌ "Objects emit Intentions from scratch" → No! Objects reflect, DNs emit
- ❌ "Emit happens during DN work" → No! Emit happens AFTER work is done
- ❌ "Signal can be empty" → No! Signal should have relevant Pulses
- ❌ "Intention names don't matter" → No! Clear names are crucial for understanding flow

---

## 🤔 Check Your Understanding

### Question 1
When does a DN emit an Intention?
- a) Before it starts working
- b) During its work
- c) After it completes its work
- d) Whenever it wants

<details>
<summary>Answer</summary>

**c) After it completes its work**

Emit is the final step. DN does its work (modifies Pulses), then packages the results into a Signal, then emits the Intention with that Signal.
</details>

### Question 2
What can modify Pulse response values?
- a) Intentions
- b) Objects
- c) Design Nodes
- d) Signals

<details>
<summary>Answer</summary>

**c) Design Nodes**

Only Design Nodes contain business logic and can modify Pulse values. Objects just capture and reflect state - they don't compute or modify.
</details>

### Question 3
What should an Intention's ID describe?
- a) How the work was done
- b) What just happened (purpose)
- c) What will happen next
- d) Who did the work

<details>
<summary>Answer</summary>

**b) What just happened (purpose)**

The Intention ID should clearly state the purpose or what was just accomplished. Examples: "INT_TOTAL_CALCULATED", "INT_ORDER_VALIDATED", "INT_PAYMENT_PROCESSED"
</details>

### Question 4
A DN calculates a total ($44.21) and tax ($3.24). What should it emit?
- a) Just the total in a Signal
- b) Just the tax in a Signal
- c) Both total and tax in a Signal
- d) Nothing (Objects do the emitting)

<details>
<summary>Answer</summary>

**c) Both total and tax in a Signal**

The Signal should be complete - include all relevant Pulses that were modified. In this case, both total AND tax should be in the Signal.
</details>

---

## 📚 Restaurant Analogy Summary

```
KITCHEN (Design Node)
    ↓
Chef cooks food (blackbox work)
    ↓
Chef marks order slip (modifies Pulses)
  - status: "ready"
  - cook_time: "25 min"
  - dishes: "Biryani x2, Curry x1"
    ↓
Chef rings BELL #42 (emits Intention)
  - Bell label: "INT_ORDER_READY"
  - Attached slip: order details (Signal)
    ↓
Waiter (Object) hears bell, picks up slip
    ↓
Waiter holds the order (captures state)
```

The "emit" is the bell ring - the moment the work is announced as complete!

---

## 🎯 Practice: Identify the Emit

### Scenario 1: User Registration

```
DN_ValidateEmail
  ↓
(checks if email format is valid)
  ↓
Modifies Pulses:
  - email_valid: "true"
  - validation_message: "Email format OK"
  ↓
Should emit: ???
```

**Question**: What Intention should DN_ValidateEmail emit?

<details>
<summary>Answer</summary>

```javascript
{
  id: "INT_EMAIL_VALIDATED",
  signal: {
    pulses: [
      {
        prompt: "email_valid",
        responses: ["true"],
        trivalence: "N"
      },
      {
        prompt: "validation_message",
        responses: ["Email format OK"],
        trivalence: "N"
      }
    ]
  }
}
```

The Intention name describes what just happened ("EMAIL_VALIDATED"), and the Signal contains the validation results.
</details>

### Scenario 2: Payment Processing

```
DN_ChargeCard
  ↓
(calls payment API, charges card)
  ↓
Modifies Pulses:
  - transaction_id: "txn_abc123"
  - payment_status: "approved"
  - amount_charged: "$44.21"
  - card_last4: "4242"
  ↓
Should emit: ???
```

**Question**: What should DN_ChargeCard emit?

<details>
<summary>Answer</summary>

```javascript
{
  id: "INT_PAYMENT_PROCESSED",
  signal: {
    pulses: [
      {
        prompt: "transaction_id",
        responses: ["txn_abc123"],
        trivalence: "N"
      },
      {
        prompt: "payment_status",
        responses: ["approved"],
        trivalence: "N"
      },
      {
        prompt: "amount_charged",
        responses: ["$44.21"],
        trivalence: "N"
      },
      {
        prompt: "card_last4",
        responses: ["4242"],
        trivalence: "N"
      }
    ]
  }
}
```

Include ALL relevant payment information in the Signal!
</details>

---

## ➡️ Next Exercise

**Exercise 2.3: Object Receives and Reflects**

You'll learn how Objects capture the emitted Intention, hold the state, and reflect it forward - all without doing any computation!

---

## 🎓 Reflection Questions

1. **Why does emit happen AFTER the DN's work, not during?**  
   Think: When is the result ready to share?

2. **What's the difference between "emit" and "reflect"?**  
   Hint: Who does each action, and what's the source?

3. **If a DN forgets to include a Pulse in its Signal, what happens?**  
   Think: What information is lost downstream?

4. **In colab.kitchen, what Intentions might these DNs emit?**
   - DN_SearchDishes → `INT_____`
   - DN_AddToCart → `INT_____`
   - DN_PlaceOrder → `INT_____`

---

**Estimated time**: 15 minutes  
**Concepts reinforced**: DN blackbox, Pulse modification, Emit process  
**New concept**: How DNs output their work through Intentions  
**Next step**: See how Objects capture these emitted Intentions
