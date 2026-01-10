# Exercise 5-6: Complete Todo Flow - All Concepts Together
## Building Your First Complete Intention Tunnel App

**Note**: This exercise bridges Level 5 (Design Nodes) and Level 6 (Complete CPUX Flows), integrating all concepts from Levels 1-4.

**⏱️ Duration**: 30-40 minutes  
**📚 Prerequisites**: Completed Levels 1-4 (Pulses, Intentions, Field, Objects)  
**🎯 Difficulty**: Intermediate (Capstone Exercise)  
**🏆 Outcome**: Working Todo app with enterprise-grade reliability

---

## 🎯 What You'll Learn

By the end of this exercise, you will:

1. ✅ **Understand the complete DN-I-O-I-DN chain** and why every Intention matters
2. ✅ **Build a working Todo app** that integrates all CPUX concepts
3. ✅ **See Objects as pure reflectors** (no computation, only transformation)
4. ✅ **Experience Design Nodes as logic containers** (testable black boxes)
5. ✅ **Appreciate enterprise patterns** (nonce-based retry, compensation, audit trails)
6. ✅ **Test components in isolation** (DN without Field/React)
7. ✅ **Trace complete flows** from user action to UI update

---

## 📖 The Story So Far

In previous exercises, you learned:

- **Level 1**: Pulses are data containers with trivalence (Y/N/U)
- **Level 2**: Field is centralized state, accessible via React Context
- **Level 3**: Intentions carry Signals between entities
- **Level 4**: Objects reflect intentions with pure PnR operations

**Now**: We bring ALL these concepts together in one working app!

---

## 🌍 PART 1: The Big Picture (5 minutes)

### What We're Building

**A Simple Todo App**:
- User types todo text
- Clicks "Add" button
- Todo appears in list
- Shows total count

**But with a twist**: This isn't just any React app. It's built using **Intention Tunnel** architecture, which means:

✅ **Complete traceability** - Every action has unique address  
✅ **Automatic retry** - Network failures recovered transparently  
✅ **Audit trail** - Can see WHO did WHAT, WHEN  
✅ **Testable logic** - Business logic tested without UI  
✅ **Enterprise-grade** - Patterns used in banking, healthcare, e-commerce

### The Complete CPUX Flow

Here's what happens when you add a todo:

```
┌─────────────────────────────────────────────────────────────────┐
│                    INTENTION TUNNEL                             │
│                   (Frontend CPUX Mode)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 User types "Buy milk" in input field                       │
│      │                                                          │
│      │ (Local React state - transient)                         │
│      │                                                          │
│      ▼                                                          │
│  👤 User clicks "Add" button                                   │
│      │                                                          │
│      ├──► Component emits intention into Field                 │
│      │                                                          │
│      ▼                                                          │
│  emit('INT_ADD_TODO', {text: 'Buy milk'})                      │
│      │                                                          │
│      │ (Crosses boundary: Component → CPUX)                    │
│      │                                                          │
│      ▼                                                          │
│  ┌────────────────────────────────────────┐                    │
│  │            FIELD (Passive)             │                    │
│  │  ┌──────────────────────────────────┐  │                    │
│  │  │ FIS: {INT_ADD_TODO}              │  │                    │
│  │  │ FPS: {text: "Buy milk"}          │  │                    │
│  │  └──────────────────────────────────┘  │                    │
│  │       (React Context - shared)         │                    │
│  └────────────────────────────────────────┘                    │
│      │                                                          │
│      │ (Field notifies all subscribers)                        │
│      │                                                          │
│      ├──────────────┬────────────────┐                         │
│      ▼              ▼                ▼                          │
│  [Component]    [Object]         [DN]                          │
│   subscribes     listens        listens                        │
│                                                                 │
│  🔷 Object (TodoReflector) receives INT_ADD_TODO               │
│      │                                                          │
│      ▼                                                          │
│  🔒 Gatekeeper check:                                          │
│      ├─ Has 'text' pulse in Field? ✅ YES                      │
│      └─ Trivalence = 'Y'? ✅ YES                               │
│      │                                                          │
│      ▼                                                          │
│  📦 Persist to Object-Field with NONCE:                        │
│      nonce: "obj_1705330200_abc123"                            │
│      state: {text: "Buy milk"}                                 │
│      intention_in: "INT_ADD_TODO"                              │
│      intention_out: "INT_PROCESS_TODO"                         │
│      timestamp: "2024-01-15T10:30:00Z"                         │
│      │                                                          │
│      │ (Critical: Object holds state for retry!)               │
│      │                                                          │
│      ▼                                                          │
│  🔧 Pure PnR Operations:                                       │
│      ├─ COPY 'text' → 'todo_text'                             │
│      │  (Same value, new name)                                 │
│      │                                                          │
│      └─ CREATE 'todo_id'                                       │
│         (Generate: "todo_1705330200000")                       │
│      │                                                          │
│      │ (NO computation! Only transformations)                  │
│      │                                                          │
│      ▼                                                          │
│  🔷 Reflect to next Intention:                                 │
│      emit INT_PROCESS_TODO                                     │
│      │                                                          │
│      ▼                                                          │
│  ┌────────────────────────────────────────┐                    │
│  │            FIELD (Updated)             │                    │
│  │  ┌──────────────────────────────────┐  │                    │
│  │  │ FIS: {INT_PROCESS_TODO}          │  │ (INT_ADD_TODO    │
│  │  │ FPS: {todo_id: "todo_...",       │  │  removed)        │
│  │  │       todo_text: "Buy milk"}     │  │                    │
│  │  └──────────────────────────────────┘  │                    │
│  └────────────────────────────────────────┘                    │
│      │                                                          │
│      │ (Field notifies subscribers again)                      │
│      │                                                          │
│      ▼                                                          │
│  🔶 Design Node (TodoManager) receives INT_PROCESS_TODO        │
│      │                                                          │
│      ▼                                                          │
│  🔒 Gatekeeper check:                                          │
│      ├─ Has 'todo_id' pulse? ✅ YES                            │
│      └─ Has 'todo_text' pulse? ✅ YES                          │
│      │                                                          │
│      ▼                                                          │
│  📥 flowin: Extract pulses from Field                          │
│      workingSet = {                                            │
│        todo_id: "todo_1705330200000",                          │
│        todo_text: "Buy milk",                                  │
│        todos: "[]"  (from container)                           │
│      }                                                          │
│      │                                                          │
│      ▼                                                          │
│  ⚙️  perform: BUSINESS LOGIC!                                  │
│      ┌──────────────────────────────────┐                      │
│      │ const todos = JSON.parse(...);   │                      │
│      │ todos.push({                     │                      │
│      │   id: workingSet.todo_id,        │                      │
│      │   text: workingSet.todo_text,    │                      │
│      │   done: false                    │                      │
│      │ });                              │                      │
│      │ return {                         │                      │
│      │   todos: JSON.stringify(todos),  │                      │
│      │   todo_count: todos.length       │                      │
│      │ };                               │                      │
│      └──────────────────────────────────┘                      │
│      │                                                          │
│      │ (This is the ONLY place logic exists!)                  │
│      │                                                          │
│      ▼                                                          │
│  📤 flowout: Emit results back to Field                        │
│      │                                                          │
│      ▼                                                          │
│  ┌────────────────────────────────────────┐                    │
│  │            FIELD (Final)               │                    │
│  │  ┌──────────────────────────────────┐  │                    │
│  │  │ FPS: {                           │  │ (INT_PROCESS_TODO │
│  │  │   todos: '[{id:"...",            │  │  removed)         │
│  │  │          text:"Buy milk",        │  │                    │
│  │  │          done:false}]',          │  │                    │
│  │  │   todo_count: '1'                │  │                    │
│  │  │ }                                │  │                    │
│  │  └──────────────────────────────────┘  │                    │
│  └────────────────────────────────────────┘                    │
│      │                                                          │
│      │ (Field notifies subscribers)                            │
│      │                                                          │
│      ▼                                                          │
│  📺 TodoList component subscribed to 'todos' pulse             │
│      │                                                          │
│      ▼                                                          │
│  ⚛️  React re-renders TodoList                                 │
│      │                                                          │
│      ▼                                                          │
│  👀 User sees new todo "Buy milk" in list!                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

⏱️  Total time: ~50-100ms (human doesn't notice!)
```

### The Critical Structure: DN-I-O-I-DN

Notice the pattern:

```
Design Node → Intention → Object → Intention → Design Node
    (DN)         (I)        (O)        (I)         (DN)
```

**Why BOTH Intentions are required:**

```
❌ WRONG (Missing Intention):
DN_UserInput → Object → DN_TodoManager
               ↑
          If DN_TodoManager fails, what do we retry?
          Object has data but no labeled request!

✅ CORRECT (With Intention):
DN_UserInput → INT_PROCESS_TODO → Object → INT_EXECUTE → DN_TodoManager
                                    ↑
                     If DN_TodoManager fails:
                     - Object knows: "Someone wants INT_EXECUTE"
                     - Has nonce: "obj_abc123" 
                     - Re-emit INT_EXECUTE with same data
                     - TodoManager retries automatically
                     - User sees "Syncing..." then success
```

**Key Insight**: The Intention between Object and DN is the **contract** that enables:
- ✅ Retry on failure (re-emit same Intention)
- ✅ Idempotency (same nonce = don't duplicate)
- ✅ Traceability (intention labels show purpose)
- ✅ Accountability (audit trail of what was requested)

---

## 🏢 PART 2: Enterprise vs Social Apps (10 minutes)

### Why This Architecture Matters

Before we build, let's understand **why** Intention Tunnel architecture exists.

#### Scenario 1: Social Messaging App (WhatsApp)

**User Experience**:
```
You: Types "Hello!" in WhatsApp
You: Clicks send
     ↓
     Network error! ❌
     ↓
You: Sees red "!" icon
You: Clicks retry manually
     ↓
     Network error again! ❌
     ↓
You: Gives up, types message again later
```

**Characteristics**:
- ✅ Ephemeral interactions (message lost = acceptable)
- ✅ Human handles errors (you retry manually)
- ✅ No compensation needed (can't "unsend" easily)
- ✅ Weak accountability (who cares if message delayed?)

**This is OK** because:
- Messages aren't financial transactions
- Users understand "internet issues"
- Can always retype

---

#### Scenario 2: Enterprise App (Bank Transfer)

**User Experience**:
```
You: Transfer $1,000 to friend
You: Click "Transfer"
     ↓
     Network error! ❌
     ↓
     System internally:
     - Object has validated transfer (nonce: "txn_abc123")
     - Re-emits INT_EXECUTE_TRANSFER with same nonce
     - Retries automatically (3 attempts)
     - Succeeds on attempt 2
     ↓
You: See "Transfer complete" (never knew it failed!)
```

**Characteristics**:
- ✅ Persistent transactions (MUST complete)
- ✅ System handles errors (transparent to user)
- ✅ Compensation mandatory (rollback if permanent failure)
- ✅ Critical accountability (audit trail required by law)

**This is REQUIRED** because:
- Money can't be "lost in network"
- User shouldn't retype $1,000 amount
- Regulators need complete audit trail
- Must prove WHO transferred WHAT, WHEN

---

### How Intention Tunnel Enables Enterprise Requirements

#### 1. Nonce-Based Persistence (Idempotency)

**The Problem**:
```
User transfers $100
Network times out
User clicks "Transfer" again
System processes $200! 💸 (duplicated!)
```

**The Solution** (Intention Tunnel):
```javascript
// Object persists with unique nonce
OBJ_TransferState: {
  nonce: "transfer_xyz789",  // Unique identifier
  timestamp: "2024-01-15T10:30:00Z",
  pnr_snapshot: {
    from_account: "12345",
    to_account: "67890", 
    amount: "100.00"
  },
  intention: "INT_EXECUTE_TRANSFER"
}

// If user clicks again:
// System checks: "Already have nonce transfer_xyz789"
// → Don't execute again
// → Return previous result
// → User sees "Transfer already completed"
```

**Key Benefit**: Same nonce = same operation (executed only once)

---

#### 2. Automatic Retry Without Re-Validation

**Traditional Approach**:
```
User enters card number: 1234-5678-9012-3456
Validates format ✅ (expensive API call)
Validates with bank ✅ (expensive API call)
Submits payment → NETWORK ERROR ❌

User must:
1. Re-enter card number
2. Re-validate format (cost $0.01)
3. Re-validate with bank (cost $0.50)
4. Re-submit

Total: $1.02 wasted + frustrated user
```

**Intention Tunnel Approach**:
```
User enters card number
  ↓
OBJ_InputState persists (nonce: "input_abc")
  ↓
DN_ValidateFormat executes
  ↓
OBJ_ValidatedState persists (nonce: "valid_def")
  ↓
DN_ValidateBank executes
  ↓
OBJ_BankValidatedState persists (nonce: "bank_ghi")
  ↓
DN_ProcessPayment fails → NETWORK ERROR ❌
  ↓
System automatically:
1. Re-emit INT_PROCESS with nonce "bank_ghi"
2. DN_ProcessPayment receives same validated data
3. Retries payment (no re-validation!)
4. User sees "Processing..." then "Success!"

Total: $0.51 cost + user never noticed failure
```

**Key Benefit**: Object persistence = no duplicate expensive operations

---

#### 3. Compensation and Rollback

**Multi-Step Transaction Example**:

```javascript
CPUX_BookFlight: {
  links: [
    // Step 1: Reserve seat
    "DN_CheckAvailability → INT_Available → OBJ_AvailState → INT_Reserve → DN_ReserveSeat",
    
    // Step 2: Charge card  
    "DN_ReserveSeat → INT_Reserved → OBJ_ReserveState → INT_Charge → DN_ChargeCard",
    
    // Step 3: Send confirmation
    "DN_ChargeCard → INT_Charged → OBJ_ChargeState → INT_Confirm → DN_SendTicket"
  ]
}

// If DN_ChargeCard FAILS (card declined):
// 
// OBJ_ReserveState has record:
// {
//   nonce: "reserve_jkl",
//   seat_number: "12A",
//   flight: "UA123",
//   user: "john@example.com"
// }
//
// System issues compensating transaction:
// 1. Read OBJ_ReserveState with nonce "reserve_jkl"
// 2. Emit INT_UNRESERVE with same data
// 3. DN_UnreserveSeat releases seat 12A
// 4. User sees "Payment failed, seat released"
//
// NOT: "You owe us $500 but have no ticket!"
```

**Key Benefit**: Complete rollback capability using persisted state

---

#### 4. Complete Audit Trail (Regulatory Compliance)

**Every Object persistence creates audit entry:**

```
Audit Trail for Transfer #xyz789:

2024-01-15 10:30:00.000 - CPUX_Transfer:1:O:InputState:1
  nonce: input_abc123
  user_id: user_12345
  action: User entered transfer details
  data: {from: "12345", to: "67890", amount: "100.00"}

2024-01-15 10:30:00.150 - CPUX_Transfer:2:O:ValidState:1  
  nonce: valid_def456
  user_id: user_12345
  action: Validation passed
  data: {from_valid: true, to_valid: true, amount_valid: true}

2024-01-15 10:30:00.300 - CPUX_Transfer:3:O:DebitState:1
  nonce: debit_ghi789
  user_id: user_12345  
  action: Debit executed
  data: {from_balance_before: 500.00, from_balance_after: 400.00}

2024-01-15 10:30:00.450 - CPUX_Transfer:4:O:CreditState:1
  nonce: credit_jkl012
  user_id: user_12345
  action: Credit FAILED - network timeout
  data: {to_balance: unknown, error: "TIMEOUT"}

2024-01-15 10:30:00.500 - CPUX_Transfer:3:O:DebitState:1
  nonce: debit_ghi789  (SAME NONCE - compensation!)
  user_id: user_12345
  action: Compensation - reverse debit
  data: {from_balance_before: 400.00, from_balance_after: 500.00}

2024-01-15 10:30:00.600 - CPUX_Transfer:5:O:ErrorState:1
  nonce: error_mno345
  user_id: user_12345
  action: User notified of failure
  data: {message: "Transfer failed - refunded"}
```

**Auditor can see**:
- ✅ WHO: user_12345 initiated transfer
- ✅ WHAT: Each operation with data snapshots
- ✅ WHEN: Exact timestamps (millisecond precision)
- ✅ WHY: Intention labels show purpose
- ✅ HOW: Can replay entire sequence
- ✅ PROOF: Nonces prove operations executed

**This is legally required** for:
- Banking (Sarbanes-Oxley)
- Healthcare (HIPAA)
- E-commerce (PCI-DSS)
- Government (various regulations)

---

### Why Todo App Benefits From Enterprise Patterns

**Scenario**: User adds 10 todos, network glitches on #8

**Traditional React**:
```
❌ Problem:
- setState batches updates
- Network fails midway
- State is inconsistent
- User loses todos #8-10
- Has to remember and retype
- Frustrating experience

User thinks:
"This app is buggy, I'll use Google Keep instead"
```

**Intention Tunnel**:
```
✅ Solution:
- OBJ_TodoState persists todos #1-7 (nonce: "batch_001")
- Todo #8 fails to save to server
- System detects failure
- Re-emits INT_ADD with nonce "todo_008"
- Retries automatically (3 attempts)
- User sees "Syncing..." spinner
- Succeeds on attempt 2
- User never knows it failed!

User thinks:
"Wow, this app works even on slow internet!"
```

**Result**: Professional app behavior from simple architecture

---

## 💡 Key Insight

> **Enterprise patterns aren't just for banks.** 
> 
> Even simple apps benefit from:
> - Transparent error recovery
> - No data loss
> - Professional UX
> - User trust
>
> Intention Tunnel makes this **easy** by design.

---

## 🛠️ PART 3: Building the Todo App (15 minutes)

Now let's build it! We'll create each component step-by-step.

### Step 1: Project Structure

```
todo-app/
├── src/
│   ├── components/
│   │   ├── TodoInput.jsx       # User input (Human proxy)
│   │   └── TodoList.jsx        # Display todos
│   ├── core/
│   │   ├── Field.js            # Centralized state
│   │   ├── Objects.js          # Pure reflectors
│   │   └── DesignNodes.js      # Business logic
│   ├── hooks/
│   │   └── useIntentionTunnel.js  # React hooks
│   ├── App.js                  # Main app
│   └── index.js                # Entry point
└── test/
    └── design-nodes/
        └── TodoManager.test.js # Unit tests
```

---

### Step 2: Field (Centralized State Container)

**File**: `src/core/Field.js`

```javascript
/**
 * Field - Centralized State Container
 * 
 * In Intention Tunnel (Frontend), the Field is PASSIVE:
 * - No active Visitor loop
 * - Members subscribe and react to changes
 * - React Context for sharing
 * 
 * Holds:
 * - FIS: Field Intention Set (active intentions)
 * - FPS: Field Pulse Set (all pulse data)
 */

class Field {
  constructor() {
    // Field Pulse Set (FPS)
    this.pulses = new Map();  // Map<pulseName, {name, value, trivalence, timestamp}>
    
    // Field Intention Set (FIS)
    this.intentions = new Set();  // Set<intentionId>
    
    // Subscribers (for React re-renders)
    this.subscribers = new Map();  // Map<pulseName, Set<callback>>
    
    // Debug mode
    this.debug = true;
  }
  
  /**
   * Add intention to Field (called by emit())
   */
  addIntention(intentionId, pulseData) {
    // Add to FIS
    this.intentions.add(intentionId);
    
    // Add pulses to FPS
    Object.entries(pulseData).forEach(([name, value]) => {
      this.setPulseValue(name, value);
    });
    
    if (this.debug) {
      console.log(`[Field] Added intention: ${intentionId}`, {
        pulses: Object.keys(pulseData)
      });
    }
    
    // Notify all subscribers
    this.notifySubscribers();
  }
  
  /**
   * Set pulse value in FPS
   */
  setPulseValue(name, value) {
    this.pulses.set(name, {
      name,
      value,
      trivalence: 'Y',  // Assume 'Y' for simplicity
      timestamp: Date.now()
    });
  }
  
  /**
   * Get pulse value from FPS
   */
  getPulseValue(name) {
    return this.pulses.get(name)?.value;
  }
  
  /**
   * Remove intention from FIS (after processing)
   */
  removeIntention(intentionId) {
    this.intentions.delete(intentionId);
    
    if (this.debug) {
      console.log(`[Field] Removed intention: ${intentionId}`);
    }
  }
  
  /**
   * Check if intention exists (for gatekeeper)
   */
  hasIntention(intentionId) {
    return this.intentions.has(intentionId);
  }
  
  /**
   * Check if pulse exists (for gatekeeper)
   */
  hasPulse(pulseName) {
    return this.pulses.has(pulseName);
  }
  
  /**
   * Subscribe to pulse changes (for React components)
   */
  subscribe(pulseName, callback) {
    if (!this.subscribers.has(pulseName)) {
      this.subscribers.set(pulseName, new Set());
    }
    this.subscribers.get(pulseName).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(pulseName)?.delete(callback);
    };
  }
  
  /**
   * Notify all subscribers (trigger React re-renders)
   */
  notifySubscribers() {
    this.subscribers.forEach((callbacks, pulseName) => {
      const pulse = this.pulses.get(pulseName);
      callbacks.forEach(callback => {
        try {
          callback(pulse?.value);
        } catch (error) {
          console.error(`[Field] Subscriber error for ${pulseName}:`, error);
        }
      });
    });
  }
  
  /**
   * Get debug snapshot (for tracing)
   */
  getDebugSnapshot() {
    return {
      intentions: Array.from(this.intentions),
      pulses: Array.from(this.pulses.entries()).map(([name, pulse]) => ({
        name,
        value: pulse.value,
        trivalence: pulse.trivalence
      }))
    };
  }
}

export default Field;
```

**Key Points**:
- ✅ Field is passive (no active loop)
- ✅ Pub/sub pattern for React re-renders
- ✅ Supports gatekeeper checks (hasIntention, hasPulse)
- ✅ Debug logging for tracing

---

### Step 3: Object (Pure Reflector)

**File**: `src/core/Objects.js`

```javascript
import Field from './Field';

/**
 * TodoReflector - Object that reflects ADD_TODO intentions
 * 
 * CRITICAL RULE: Objects are PURE reflectors
 * - NO computation (no calculations, no business logic)
 * - ONLY transformations (copy, create, map pulses)
 * - MUST persist state with nonce
 * 
 * What Objects CAN do:
 * ✅ COPY pulse A to pulse B
 * ✅ CREATE pulse with static/opaque value
 * ✅ FILTER pulses (subset selection)
 * ✅ Persist state (for retry)
 * 
 * What Objects CANNOT do:
 * ❌ Validate (that's DN's job)
 * ❌ Calculate (that's DN's job)
 * ❌ Make decisions (that's DN's job)
 */

class TodoReflector {
  constructor() {
    this.id = 'OBJ_001';
    this.name = 'TodoReflector';
    
    // Gatekeeper: Entry conditions
    // (What must exist in Field before reflecting?)
    this.gatekeeper = {
      'INT_ADD_TODO': {
        'text': [null, 'Y']  // Must have 'text' pulse with TV='Y'
      }
    };
    
    // Object-Field: Internal persistence
    this.objectField = {
      nonce: null,
      intentions: new Set(),
      pulses: new Map(),
      history: []  // For audit trail
    };
  }
  
  /**
   * Listen to Field (called on Field changes)
   */
  listen(field, setField) {
    // Check if INT_ADD_TODO exists in Field
    if (!field.hasIntention('INT_ADD_TODO')) {
      return;  // Nothing to do
    }
    
    console.log(`[${this.name}] Detected INT_ADD_TODO in Field`);
    
    // Gatekeeper check (syncTest)
    if (!this.canReflect(field, 'INT_ADD_TODO')) {
      console.log(`[${this.name}] ❌ Gatekeeper BLOCKED (missing required pulses)`);
      return;
    }
    
    console.log(`[${this.name}] ✅ Gatekeeper PASSED`);
    
    // Persist state to Object-Field (with nonce)
    this.persistState(field, 'INT_ADD_TODO');
    
    // Perform PURE operations (no computation!)
    const transformedPulses = this.performPureOperations(field);
    
    // Reflect to next intention
    this.reflect(field, setField, transformedPulses);
  }
  
  /**
   * Gatekeeper: Check if can reflect (syncTest)
   */
  canReflect(field, intentionId) {
    const requirements = this.gatekeeper[intentionId];
    if (!requirements) {
      console.log(`[${this.name}] No gatekeeper for ${intentionId}`);
      return false;
    }
    
    // Check all required pulses exist in Field
    for (const [pulseName, [expectedValue, expectedTV]] of Object.entries(requirements)) {
      if (!field.hasPulse(pulseName)) {
        console.log(`[${this.name}] Missing pulse: ${pulseName}`);
        return false;
      }
      
      // Check trivalence if specified
      const pulse = field.pulses.get(pulseName);
      if (expectedTV && pulse.trivalence !== expectedTV) {
        console.log(`[${this.name}] Trivalence mismatch: ${pulseName} (expected ${expectedTV}, got ${pulse.trivalence})`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Persist state to Object-Field (for retry/compensation)
   */
  persistState(field, intentionId) {
    // Generate unique nonce
    this.objectField.nonce = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Record intention
    this.objectField.intentions.add(intentionId);
    
    // Snapshot relevant pulses
    const text = field.getPulseValue('text');
    this.objectField.pulses.set('text', text);
    
    // Add to history (audit trail)
    this.objectField.history.push({
      nonce: this.objectField.nonce,
      intention: intentionId,
      timestamp: new Date().toISOString(),
      pulses: {text}
    });
    
    console.log(`[${this.name}] 📦 Persisted with nonce: ${this.objectField.nonce}`);
    console.log(`[${this.name}] State:`, {text});
  }
  
  /**
   * Pure PnR Operations (NO COMPUTATION!)
   * 
   * Reference: PHASE3-ROADMAP.md - Mathematical Mapping Functions
   */
  performPureOperations(field) {
    const text = field.getPulseValue('text');
    
    console.log(`[${this.name}] 🔧 Performing PURE operations on:`, {text});
    
    // Operation 1: COPY 'text' to 'todo_text'
    // (Same value, different name)
    const todo_text = text;
    
    // Operation 2: CREATE 'todo_id' 
    // (Generate opaque identifier - not computation!)
    const todo_id = `todo_${Date.now()}`;
    
    console.log(`[${this.name}] ✅ Transformed pulses:`, {
      todo_id,
      todo_text
    });
    
    // Return transformed PnR set
    return {
      todo_id,
      todo_text
    };
  }
  
  /**
   * Reflect to next intention
   */
  reflect(field, setField, transformedPulses) {
    console.log(`[${this.name}] 🔷 Reflecting to INT_PROCESS_TODO`);
    
    // Update Field
    setField(prev => {
      const newField = new Field();
      
      // Copy existing pulses
      prev.pulses.forEach((pulse, name) => {
        newField.pulses.set(name, {...pulse});
      });
      
      // Copy existing intentions (except absorbed one)
      prev.intentions.forEach(intent => {
        if (intent !== 'INT_ADD_TODO') {
          newField.intentions.add(intent);
        }
      });
      
      // Copy subscribers
      newField.subscribers = prev.subscribers;
      
      // Add reflected intention with transformed pulses
      newField.addIntention('INT_PROCESS_TODO', transformedPulses);
      
      return newField;
    });
  }
}

export default TodoReflector;
```

**Key Points**:
- ✅ Gatekeeper checks Field before reflecting
- ✅ Persists state with nonce (for retry)
- ✅ Pure operations: COPY and CREATE only
- ❌ NO business logic (no validation, calculation)
- ✅ Reflects to next intention (labeled communication)

---

### Step 4: Design Node (Business Logic)

**File**: `src/core/DesignNodes.js`

```javascript
import Field from './Field';

/**
 * TodoManager - Design Node that processes todos
 * 
 * Design Nodes are BLACK BOXES containing business logic:
 * - Absorb Intention+Signal via gatekeeper
 * - Execute: flowin → perform → flowout
 * - Emit results back to Field
 * 
 * CRITICAL: perform() must be PURE FUNCTION
 * - Testable in isolation (no Field/React)
 * - Input → Business Logic → Output
 * - No side effects
 */

class TodoManager {
  constructor() {
    this.id = 'DN_001';
    this.name = 'TodoManager';
    
    // Gatekeeper: Entry conditions
    // (What must exist in Field before executing?)
    this.gatekeeper = {
      'INT_PROCESS_TODO': {
        'todo_id': [null, 'Y'],
        'todo_text': [null, 'Y']
      }
    };
    
    // flowin: Which pulses to extract from Field?
    this.flowin = ['todo_id', 'todo_text', 'todos'];
    
    // flowout: Which pulses to emit back to Field?
    this.flowout = ['todos', 'todo_count'];
    
    // Container PnR: Static design-time values
    this.containerPnR = {
      'todos': ['[]', 'Y']  // Initial empty array
    };
  }
  
  /**
   * Listen to Field (called on Field changes)
   */
  listen(field, setField) {
    // Check if INT_PROCESS_TODO exists
    if (!field.hasIntention('INT_PROCESS_TODO')) {
      return;
    }
    
    console.log(`[${this.name}] Detected INT_PROCESS_TODO in Field`);
    
    // Gatekeeper check (syncTest)
    if (!this.canExecute(field, 'INT_PROCESS_TODO')) {
      console.log(`[${this.name}] ❌ Gatekeeper BLOCKED`);
      return;
    }
    
    console.log(`[${this.name}] ✅ Gatekeeper PASSED`);
    
    // Execute: flowin → perform → flowout
    this.execute(field, setField);
  }
  
  /**
   * Gatekeeper: Check if can execute (syncTest)
   */
  canExecute(field, intentionId) {
    const requirements = this.gatekeeper[intentionId];
    if (!requirements) return false;
    
    // Check all required pulses exist
    for (const [pulseName, [expectedValue, expectedTV]] of Object.entries(requirements)) {
      if (!field.hasPulse(pulseName)) {
        console.log(`[${this.name}] Missing pulse: ${pulseName}`);
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Execute DN: flowin → perform → flowout
   */
  execute(field, setField) {
    console.log(`[${this.name}] ⚙️  Executing DN...`);
    
    // Step 1: flowin (extract pulses from Field)
    const workingSet = this.extractFlowin(field);
    console.log(`[${this.name}] 📥 flowin:`, workingSet);
    
    // Step 2: perform (BUSINESS LOGIC!)
    const result = this.perform(workingSet);
    console.log(`[${this.name}] ⚙️  perform result:`, result);
    
    // Step 3: flowout (emit results to Field)
    this.applyFlowout(field, setField, result);
    console.log(`[${this.name}] 📤 flowout complete`);
  }
  
  /**
   * flowin: Extract pulses from Field
   */
  extractFlowin(field) {
    const workingSet = {};
    
    this.flowin.forEach(pulseName => {
      const value = field.getPulseValue(pulseName);
      
      if (value !== undefined) {
        // Get from Field
        workingSet[pulseName] = value;
      } else if (this.containerPnR[pulseName]) {
        // Use default from container
        workingSet[pulseName] = this.containerPnR[pulseName][0];
      }
    });
    
    return workingSet;
  }
  
  /**
   * perform: PURE BUSINESS LOGIC
   * 
   * THIS IS THE ONLY PLACE COMPUTATION HAPPENS!
   * 
   * Must be testable in isolation:
   * - No Field dependencies
   * - No React dependencies
   * - Pure function: input → output
   */
  perform(workingSet) {
    console.log(`[${this.name}] 💼 BUSINESS LOGIC: Adding todo...`);
    
    // Parse existing todos
    const todos = JSON.parse(workingSet.todos || '[]');
    
    // ADD NEW TODO (this is the actual business logic!)
    todos.push({
      id: workingSet.todo_id,
      text: workingSet.todo_text,
      done: false
    });
    
    // Return updated state
    return {
      todos: JSON.stringify(todos),
      todo_count: todos.length
    };
  }
  
  /**
   * flowout: Emit results to Field
   */
  applyFlowout(field, setField, result) {
    setField(prev => {
      const newField = new Field();
      
      // Copy existing pulses
      prev.pulses.forEach((pulse, name) => {
        newField.pulses.set(name, {...pulse});
      });
      
      // Remove absorbed intention
      prev.intentions.forEach(intent => {
        if (intent !== 'INT_PROCESS_TODO') {
          newField.intentions.add(intent);
        }
      });
      
      // Copy subscribers
      newField.subscribers = prev.subscribers;
      
      // Add flowout pulses
      this.flowout.forEach(pulseName => {
        if (result[pulseName] !== undefined) {
          newField.setPulseValue(pulseName, result[pulseName]);
        }
      });
      
      // Notify subscribers
      newField.notifySubscribers();
      
      return newField;
    });
  }
  
  /**
   * Standalone execution (for testing)
   * 
   * This allows testing perform() without Field/React!
   */
  executeStandalone(input) {
    return this.perform(input);
  }
}

export default TodoManager;
```

**Key Points**:
- ✅ Gatekeeper checks Field before executing
- ✅ flowin extracts pulses from Field
- ✅ perform() is PURE FUNCTION (testable!)
- ✅ ALL business logic in perform()
- ✅ flowout emits results back to Field
- ✅ executeStandalone() for testing

---

### Step 5: React Hooks (Field Access)

**File**: `src/hooks/useIntentionTunnel.js`

```javascript
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Field from '../core/Field';
import TodoReflector from '../core/Objects';
import TodoManager from '../core/DesignNodes';

/**
 * IntentionTunnelContext - Provides Field access to all components
 */
const IntentionTunnelContext = createContext(null);

/**
 * IntentionTunnelProvider - Wraps app with Field + CPUX infrastructure
 */
export function IntentionTunnelProvider({ children }) {
  // Create Field instance
  const [field, setField] = useState(() => new Field());
  
  // Create Object and DN instances
  const { object, designNode } = useMemo(() => ({
    object: new TodoReflector(),
    designNode: new TodoManager()
  }), []);
  
  // Effect: Object listens to Field
  useEffect(() => {
    object.listen(field, setField);
  }, [field, object]);
  
  // Effect: DN listens to Field  
  useEffect(() => {
    designNode.listen(field, setField);
  }, [field, designNode]);
  
  // emit: Component → Field
  const emit = (intentionId, pulseData) => {
    console.log(`[IntentionTunnel] Component emitting: ${intentionId}`, pulseData);
    
    setField(prev => {
      const newField = new Field();
      
      // Copy existing state
      prev.pulses.forEach((pulse, name) => {
        newField.pulses.set(name, {...pulse});
      });
      prev.intentions.forEach(intent => {
        newField.intentions.add(intent);
      });
      newField.subscribers = prev.subscribers;
      
      // Add new intention
      newField.addIntention(intentionId, pulseData);
      
      return newField;
    });
  };
  
  // subscribe: Component → Field pulse
  const subscribe = (pulseName, callback) => {
    return field.subscribe(pulseName, callback);
  };
  
  // Get current pulse value
  const getFieldPulse = (pulseName) => {
    return field.getPulseValue(pulseName);
  };
  
  return (
    <IntentionTunnelContext.Provider value={{ field, emit, subscribe, getFieldPulse }}>
      {children}
    </IntentionTunnelContext.Provider>
  );
}

/**
 * useIntentionTunnel - Access Field from any component
 */
export function useIntentionTunnel() {
  const context = useContext(IntentionTunnelContext);
  
  if (!context) {
    throw new Error('useIntentionTunnel must be used within IntentionTunnelProvider');
  }
  
  return context;
}

/**
 * useFieldPulse - Subscribe to specific pulse (auto re-render)
 */
export function useFieldPulse(pulseName) {
  const { subscribe, getFieldPulse } = useIntentionTunnel();
  const [value, setValue] = useState(() => getFieldPulse(pulseName));
  
  useEffect(() => {
    const unsubscribe = subscribe(pulseName, setValue);
    return unsubscribe;
  }, [pulseName, subscribe]);
  
  return value;
}
```

**Key Points**:
- ✅ Provides Field via React Context
- ✅ emit() for Component → Field
- ✅ useFieldPulse() for automatic re-renders
- ✅ Object and DN listen to Field automatically

---

### Step 6: TodoInput Component (Human Proxy)

**File**: `src/components/TodoInput.jsx`

```javascript
import React, { useState } from 'react';
import { useIntentionTunnel } from '../hooks/useIntentionTunnel';

/**
 * TodoInput - User input component
 * 
 * CRITICAL: Components are OUTSIDE the CPUX!
 * - Not a Design Node
 * - Not an Object
 * - External driver (human proxy)
 * 
 * Responsibilities:
 * ✅ Render UI
 * ✅ Capture user input (local state)
 * ✅ Emit intentions into Field
 * 
 * NOT responsible for:
 * ❌ Business logic
 * ❌ Validation
 * ❌ Data transformation
 */

function TodoInput() {
  const { emit } = useIntentionTunnel();
  
  // LOCAL state (transient, not in Field)
  const [text, setText] = useState('');
  
  const handleAdd = () => {
    if (text.trim()) {
      console.log(`[TodoInput] User clicked Add with text: "${text}"`);
      
      // EMIT intention into Field
      // (This crosses the boundary: Component → CPUX)
      emit('INT_ADD_TODO', { text: text.trim() });
      
      // Clear input
      setText('');
    }
  };
  
  return (
    <div style={styles.container}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="What needs to be done?"
        style={styles.input}
      />
      <button 
        onClick={handleAdd}
        style={styles.button}
      >
        Add Todo
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '4px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default TodoInput;
```

**Key Points**:
- ✅ Component is OUTSIDE CPUX
- ✅ Local state for transient UI (text being typed)
- ✅ emit() sends intention to Field
- ❌ NO computation (doesn't validate, process)

---

### Step 7: TodoList Component (Display)

**File**: `src/components/TodoList.jsx`

```javascript
import React from 'react';
import { useFieldPulse } from '../hooks/useIntentionTunnel';

/**
 * TodoList - Display component
 * 
 * Responsibilities:
 * ✅ Subscribe to 'todos' pulse
 * ✅ Render list when Field changes
 * ✅ React auto re-renders
 * 
 * NOT responsible for:
 * ❌ Business logic
 * ❌ Data transformation
 */

function TodoList() {
  // Subscribe to 'todos' pulse from Field
  const todosJson = useFieldPulse('todos');
  const todoCount = useFieldPulse('todo_count');
  
  // Parse todos
  const todos = todosJson ? JSON.parse(todosJson) : [];
  
  console.log(`[TodoList] Re-rendering with ${todos.length} todos`);
  
  return (
    <div style={styles.container}>
      <h3 style={styles.header}>
        Todos ({todoCount || 0})
      </h3>
      
      {todos.length === 0 ? (
        <p style={styles.empty}>No todos yet. Add one above!</p>
      ) : (
        <ul style={styles.list}>
          {todos.map(todo => (
            <li key={todo.id} style={styles.item}>
              <span>{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px'
  },
  header: {
    marginBottom: '10px',
    color: '#333'
  },
  empty: {
    color: '#999',
    fontStyle: 'italic'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  item: {
    padding: '10px',
    marginBottom: '5px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px'
  }
};

export default TodoList;
```

**Key Points**:
- ✅ useFieldPulse() automatically subscribes
- ✅ React re-renders on Field changes
- ✅ NO manual prop drilling

---

### Step 8: Main App

**File**: `src/App.js`

```javascript
import React from 'react';
import { IntentionTunnelProvider } from './hooks/useIntentionTunnel';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <IntentionTunnelProvider>
      <div style={styles.app}>
        <header style={styles.header}>
          <h1>Todo App</h1>
          <p style={styles.subtitle}>Built with Intention Tunnel</p>
        </header>
        
        <main style={styles.main}>
          <TodoInput />
          <TodoList />
        </main>
        
        <footer style={styles.footer}>
          <p>Open console to see CPUX flow! 🚀</p>
        </footer>
      </div>
    </IntentionTunnelProvider>
  );
}

const styles = {
  app: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px'
  },
  main: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#999',
    fontSize: '12px'
  }
};

export default App;
```

---

## 🧪 PART 4: Testing (5 minutes)

### Testing Design Nodes in Isolation

**File**: `test/design-nodes/TodoManager.test.js`

```javascript
import TodoManager from '../../src/core/DesignNodes';

describe('TodoManager', () => {
  let dn;
  
  beforeEach(() => {
    dn = new TodoManager();
  });
  
  test('adds todo to empty list', () => {
    // Arrange
    const input = {
      todo_id: 'test_123',
      todo_text: 'Buy milk',
      todos: '[]'
    };
    
    // Act
    const result = dn.executeStandalone(input);
    
    // Assert
    const todos = JSON.parse(result.todos);
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe('test_123');
    expect(todos[0].text).toBe('Buy milk');
    expect(todos[0].done).toBe(false);
    expect(result.todo_count).toBe(1);
  });
  
  test('appends to existing todos', () => {
    // Arrange
    const existing = [
      { id: '1', text: 'First todo', done: false }
    ];
    
    const input = {
      todo_id: '2',
      todo_text: 'Second todo',
      todos: JSON.stringify(existing)
    };
    
    // Act
    const result = dn.executeStandalone(input);
    
    // Assert
    const todos = JSON.parse(result.todos);
    expect(todos).toHaveLength(2);
    expect(todos[0].text).toBe('First todo');
    expect(todos[1].text).toBe('Second todo');
    expect(result.todo_count).toBe(2);
  });
  
  test('handles malformed todos gracefully', () => {
    // Arrange
    const input = {
      todo_id: 'test',
      todo_text: 'Test',
      todos: 'invalid json'
    };
    
    // Act & Assert
    // Should handle error gracefully (or throw, then catch in DN)
    expect(() => dn.executeStandalone(input)).not.toThrow();
  });
});
```

**Run tests**:
```bash
npm test
```

**Expected output**:
```
PASS  test/design-nodes/TodoManager.test.js
  TodoManager
    ✓ adds todo to empty list (5ms)
    ✓ appends to existing todos (2ms)
    ✓ handles malformed todos gracefully (1ms)

Tests: 3 passed, 3 total
```

**Key Benefits**:
- ✅ Test DN without Field
- ✅ Test DN without React
- ✅ Fast (<1ms per test)
- ✅ Pure functions = easy testing

---

## 🔍 PART 5: Tracing Complete Flow (5 minutes)

### Console Output When Adding Todo

When you add "Buy milk", here's what appears in console:

```
[IntentionTunnel] Component emitting: INT_ADD_TODO {text: "Buy milk"}

[Field] Added intention: INT_ADD_TODO {pulses: ["text"]}

[TodoReflector] Detected INT_ADD_TODO in Field
[TodoReflector] ✅ Gatekeeper PASSED
[TodoReflector] 📦 Persisted with nonce: obj_1705330200_abc123
[TodoReflector] State: {text: "Buy milk"}
[TodoReflector] 🔧 Performing PURE operations on: {text: "Buy milk"}
[TodoReflector] ✅ Transformed pulses: {
  todo_id: "todo_1705330200000",
  todo_text: "Buy milk"
}
[TodoReflector] 🔷 Reflecting to INT_PROCESS_TODO

[Field] Removed intention: INT_ADD_TODO
[Field] Added intention: INT_PROCESS_TODO {pulses: ["todo_id", "todo_text"]}

[TodoManager] Detected INT_PROCESS_TODO in Field
[TodoManager] ✅ Gatekeeper PASSED
[TodoManager] ⚙️  Executing DN...
[TodoManager] 📥 flowin: {
  todo_id: "todo_1705330200000",
  todo_text: "Buy milk",
  todos: "[]"
}
[TodoManager] 💼 BUSINESS LOGIC: Adding todo...
[TodoManager] ⚙️  perform result: {
  todos: '[{"id":"todo_1705330200000","text":"Buy milk","done":false}]',
  todo_count: 1
}
[TodoManager] 📤 flowout complete

[Field] Removed intention: INT_PROCESS_TODO

[TodoList] Re-rendering with 1 todos
```

**This shows**:
1. ✅ Component emits
2. ✅ Field receives
3. ✅ Object reflects (pure operations)
4. ✅ DN processes (business logic)
5. ✅ Field updates
6. ✅ Component re-renders

**Complete traceability!**

---

## 🎓 PART 6: Key Takeaways (5 minutes)

### What You Learned

#### 1. Complete CPUX Architecture

```
Component (Human) → Field → Object → Field → DN → Field → Component
     (emit)         (FIS)  (reflect) (FIS)  (process) (FPS) (subscribe)
```

Every piece has a purpose:
- **Component**: External driver (human proxy)
- **Field**: Centralized state (passive context)
- **Object**: Pure reflector (transformations only)
- **DN**: Business logic (testable black box)
- **Intentions**: Labeled communication (contracts)

#### 2. Why DN-I-O-I-DN Structure Matters

**WITHOUT Intentions**:
```
DN → Object → DN
     ↑
If DN fails, Object has data but doesn't know:
❌ What was being requested
❌ How to retry
❌ What nonce to use
```

**WITH Intentions**:
```
DN → INT_VALIDATED → Object → INT_SUBMIT → DN
                       ↑
Object knows:
✅ Intention label: "INT_SUBMIT" (what's being requested)
✅ Nonce: "obj_abc123" (unique identifier)
✅ Can re-emit if DN fails
✅ Complete audit trail
```

#### 3. Enterprise Patterns You Now Understand

| Pattern | Benefit | Example |
|---------|---------|---------|
| **Nonce-based persistence** | Idempotency, no duplicates | Bank transfer executed once |
| **Automatic retry** | Transparent recovery | User never knows network failed |
| **Compensation** | Rollback on error | Flight seat released if payment fails |
| **Audit trail** | Accountability | Can prove WHO did WHAT, WHEN |

#### 4. Objects vs Design Nodes

| Aspect | Object | Design Node |
|--------|--------|-------------|
| **Role** | Pure reflector | Business logic processor |
| **Operations** | COPY, CREATE, FILTER | Validate, calculate, decide |
| **Testability** | Hard to test (pure I/O) | Easy (pure function) |
| **Computation** | ❌ NEVER | ✅ ONLY here |
| **Example** | Copy 'text' to 'todo_text' | Add todo to list |

#### 5. Frontend vs Backend CPUX

| Aspect | Frontend (Intention Tunnel) | Backend (Autonomous CPUX) |
|--------|----------------------------|---------------------------|
| **Orchestrator** | Passive Field | Active Visitor |
| **Driver** | User interactions | Trigger Intention |
| **Execution** | Event-driven (reactive) | Loop-based (active touring) |
| **Termination** | Implicit (user stops) | Golden Pass detection |
| **Use Case** | Web apps, mobile apps | Services, workflows |

**Same formal model, different orchestration!**

---

### Common Misconceptions (Corrected)

| ❌ Misconception | ✅ Reality |
|-----------------|-----------|
| "Components are in CPUX" | Components are OUTSIDE, emit into Field |
| "Objects compute" | Objects only transform (pure operations) |
| "DNs handle UI" | DNs only process logic, Components render |
| "Field actively tours" | Field is passive (Frontend mode) |
| "Can skip Intentions" | REQUIRED for retry, nonce, traceability |
| "Todo app doesn't need enterprise patterns" | WRONG! Users expect reliability |

---

## ✍️ PART 7: Practice Exercise (Self-Guided)

### Extend the Todo App: Add Toggle Feature

**Your Task**: Add ability to mark todos as done/undone

**Requirements**:
1. ✅ TodoList shows checkbox for each todo
2. ✅ Clicking checkbox emits `INT_TOGGLE_TODO`
3. ✅ Object reflects with pure operations (COPY 'id' only)
4. ✅ DN updates `todo.done` property (business logic)
5. ✅ TodoList re-renders with strikethrough for done todos

**Expected Flow**:
```
User clicks checkbox on "Buy milk"
  ↓
emit('INT_TOGGLE_TODO', {id: 'todo_123'})
  ↓
Field receives INT_TOGGLE_TODO
  ↓
Object gatekeeper: has 'id'? YES
  ↓
Object persists with nonce "obj_def456"
  ↓
Object: COPY 'id' → 'toggle_id' (NO computation!)
  ↓
Reflect INT_PROCESS_TOGGLE
  ↓
DN gatekeeper: has 'toggle_id' AND 'todos'? YES
  ↓
DN: find todo by ID, toggle done property (business logic!)
  ↓
flowout: emit updated 'todos'
  ↓
TodoList re-renders with strikethrough
```

**Hints**:
- Follow same pattern as ADD_TODO
- Object: pure COPY operation only
- DN: find todo, toggle `done` boolean
- Don't forget gatekeepers at both levels!

**Solution** (try yourself first!):

<details>
<summary>Click to reveal solution</summary>

```javascript
// In Objects.js - Add to TodoReflector
this.gatekeeper = {
  'INT_ADD_TODO': {
    'text': [null, 'Y']
  },
  'INT_TOGGLE_TODO': {  // NEW
    'id': [null, 'Y']
  }
};

// Add method to handle toggle
handleToggle(field, setField) {
  if (!field.hasIntention('INT_TOGGLE_TODO')) return;
  
  if (!this.canReflect(field, 'INT_TOGGLE_TODO')) {
    console.log('Gatekeeper blocked toggle');
    return;
  }
  
  // Persist
  this.persistState(field, 'INT_TOGGLE_TODO');
  
  // Pure operation: COPY 'id' to 'toggle_id'
  const id = field.getPulseValue('id');
  const transformedPulses = {
    toggle_id: id  // Just COPY, no computation!
  };
  
  // Reflect
  this.reflect(field, setField, transformedPulses, 'INT_PROCESS_TOGGLE');
}

// In DesignNodes.js - Add to TodoManager
this.gatekeeper = {
  'INT_PROCESS_TODO': {
    'todo_id': [null, 'Y'],
    'todo_text': [null, 'Y']
  },
  'INT_PROCESS_TOGGLE': {  // NEW
    'toggle_id': [null, 'Y']
  }
};

// Add perform method for toggle
performToggle(workingSet) {
  const todos = JSON.parse(workingSet.todos || '[]');
  
  // Find and toggle (BUSINESS LOGIC!)
  const todo = todos.find(t => t.id === workingSet.toggle_id);
  if (todo) {
    todo.done = !todo.done;
  }
  
  return {
    todos: JSON.stringify(todos),
    todo_count: todos.length
  };
}

// In TodoList.jsx - Add checkbox
<li key={todo.id} style={styles.item}>
  <input
    type="checkbox"
    checked={todo.done}
    onChange={() => handleToggle(todo.id)}
  />
  <span style={todo.done ? {textDecoration: 'line-through'} : {}}>
    {todo.text}
  </span>
</li>

function handleToggle(id) {
  emit('INT_TOGGLE_TODO', {id});
}
```

</details>

---

## 🤔 Test Your Understanding

### Question 1
**Why can't we skip the Intention between Object and Design Node?**

<details>
<summary>Answer</summary>

The Intention provides **two critical layers of value**:

#### 1. Operational Reliability (Runtime Benefits)
Without the Intention, we lose:
- ✅ **Retry capability**: Object doesn't know what to do if DN fails
- ✅ **Nonce identity**: Can't track unique operations
- ✅ **Traceability**: No labeled communication (audit trail broken)
- ✅ **Idempotency**: Can't prevent duplicates (same nonce = same operation)

#### 2. Developer Scaffold (Development Benefits)

**Cognitive Granularity**:
Traditional functions carry parameters:
```javascript
// Traditional approach
processOrder(orderId, items, userId, paymentMethod)
validateOrder(orderId, items, userId)
chargePayment(userId, paymentMethod, amount)
```
- Each function is isolated
- Parameters repeated across functions
- No natural grouping of related operations

**Intentions carry Signals to Design Nodes**:
```javascript
// Intention Tunnel approach
INT_PROCESS_ORDER → DN_OrderProcessor
  ├─ validateOrder(workingSet)
  ├─ calculateTotals(workingSet)
  ├─ applyDiscounts(workingSet)
  └─ prepareForPayment(workingSet)

INT_CHARGE_PAYMENT → DN_PaymentProcessor
  ├─ authorizeCard(workingSet)
  ├─ processTransaction(workingSet)
  └─ recordPayment(workingSet)
```

**Key Advantages**:

1. **Affinity**: Intention creates natural grouping
   - All order-processing functions belong to `DN_OrderProcessor`
   - All payment functions belong to `DN_PaymentProcessor`
   - Signal carries ALL needed data (not scattered parameters)
   
2. **Granularity**: DN provides boundary for related operations
   - Can have multiple helper functions inside one DN
   - All share same `workingSet` (Signal data)
   - Don't need to pass parameters between helpers
   
3. **Development Clarity**: 
   - Developer knows: "If I'm handling INT_PROCESS_ORDER, work in DN_OrderProcessor"
   - All related code in one place
   - Signal structure documents what data is needed
   
4. **Testing in Isolation**:
   ```javascript
   // Test entire DN with one Signal
   const dn = new OrderProcessor();
   const signal = {
     order_id: '123',
     items: [...],
     user_id: 'user_456'
   };
   const result = dn.executeStandalone(signal);
   ```
   - One test covers all related functions
   - Signal provides complete context
   - No mocking needed (pure function)
   
5. **Debugging Scaffold**:
   - Intention label: "What operation is being attempted?"
   - Signal contents: "What data is being processed?"
   - DN boundary: "Where should I look for the bug?"
   - Can trace: Component → INT_X → Object → INT_Y → DN_Z
   
**Contrast with traditional debugging**:
```
Traditional:
- Bug in order processing
- Where is the code? (scattered across files)
- What data is wrong? (parameters passed through call stack)
- How did we get here? (trace through function calls)

Intention Tunnel:
- Bug in order processing
- Where is the code? → DN_OrderProcessor (one place)
- What data is wrong? → Look at Signal in Object-Field
- How did we get here? → Trace Intentions: INT_PROCESS_ORDER
```

**The Intention is both**:
- **Runtime contract** (enables reliability)
- **Development scaffold** (enables clarity, grouping, testing, debugging)

Without it, you lose not just operational benefits, but the entire **cognitive framework** that makes CPUX development tractable.
</details>

---

### Question 2
**What's the difference between Object operations and DN logic?**

<details>
<summary>Answer</summary>

**Object (Pure transformations)**:
- ✅ COPY pulse A to pulse B
- ✅ CREATE pulse with opaque value
- ✅ FILTER pulses (subset selection)
- ❌ NO interpretation of values
- ❌ NO calculations

**Design Node (Business logic)**:
- ✅ Validate (check email format)
- ✅ Calculate (price × quantity)
- ✅ Decide (if premium user, give discount)
- ✅ Transform (lowercase, trim)
- ✅ Interpret values (understand what they mean)

**Key**: Objects reshape containers, DNs fill containers.
</details>

---

### Question 3
**Why is nonce-based persistence critical in enterprise apps?**

<details>
<summary>Answer</summary>

Nonce enables:

1. **Automatic retry** on failure
   - System can re-execute without user re-input
   
2. **Idempotency** (no duplicates)
   - Same nonce = same operation (executed once even if retried)
   
3. **Audit trail** (accountability)
   - Can prove WHO did WHAT, WHEN with unique identifiers
   
4. **Compensation** (rollback)
   - Can identify and reverse specific operations

**Example**: Bank transfer fails midway → system can retry with same nonce → won't charge twice → complete audit trail for regulators.
</details>

---

### Question 4
**Can you test a Design Node without the Field or React?**

<details>
<summary>Answer</summary>

**YES!** That's the point!

```javascript
const dn = new TodoManager();

const input = {
  todo_id: '123',
  todo_text: 'Test todo',
  todos: '[]'
};

const result = dn.executeStandalone(input);

expect(result.todo_count).toBe(1);
```

**Why this matters**:
- ✅ Fast tests (<1ms each)
- ✅ No infrastructure setup
- ✅ Pure function = easy testing
- ✅ Can test business logic in isolation

This is a **fundamental benefit** of CPUX architecture.
</details>

---

## 📚 What's Next?

Congratulations! You've built a complete Intention Tunnel app with enterprise-grade patterns.

**You now understand**:
- ✅ Complete DN-I-O-I-DN chain
- ✅ Field as centralized context
- ✅ Objects as pure reflectors
- ✅ Design Nodes as logic containers
- ✅ Enterprise reliability patterns
- ✅ Testing in isolation

**Advanced Topics** (future learning):
1. **Multiple DNs in parallel** - Process multiple intentions simultaneously
2. **Conditional flows** - Branch based on Field state
3. **Multi-step wizards** - Chain DNs for complex workflows
4. **Persistent Field** - Save to localStorage
5. **Backend CPUX integration** - Connect frontend to backend
6. **GridLookout rendering** - Generate UI from schema

**Keep Building!** 🚀

---

## 📖 Glossary

| Term | Definition |
|------|------------|
| **Pulse** | Atomic data unit: `{name, value, trivalence}` |
| **Signal** | Collection of Pulses |
| **Intention** | Labeled communication channel |
| **Field** | Centralized state (FIS + FPS) |
| **Object** | Pure reflector (transformations only) |
| **Design Node** | Business logic processor |
| **Gatekeeper** | Entry condition (syncTest) |
| **Nonce** | Unique operation ID (for idempotency) |
| **flowin** | DN input pattern (extract from Field) |
| **flowout** | DN output pattern (emit to Field) |
| **CPUX** | Complete execution chain |
| **Intention Tunnel** | Frontend CPUX (passive Field) |

---

## 📋 Exercise Completion Checklist

By the end, you should have:

- [x] Built TodoInput (emits intentions)
- [x] Built TodoList (subscribes to pulses)
- [x] Implemented Field (centralized context)
- [x] Implemented TodoReflector Object (pure operations)
- [x] Implemented TodoManager DN (business logic)
- [x] Tested DN in isolation (`executeStandalone`)
- [x] Traced complete flow (console logs)
- [x] Understood DN-I-O-I-DN structure
- [x] Understood nonce-based persistence
- [x] Understood enterprise vs social app requirements

---

## 🎉 Congratulations!

You've completed the capstone exercise! You can now:

✅ Build complete Intention Tunnel apps  
✅ Test components in isolation  
✅ Understand enterprise reliability patterns  
✅ Trace CPUX flows  
✅ Appreciate why architecture matters  

**You're ready to build professional-grade applications!** 🚀

---

**End of Exercise 5.5/6.1**
