# Exercise 3.1: What is the Field?

**⏱️ Time**: 10 minutes  
**📚 Level**: 3 - Field as Shared State  
**🎯 Prerequisite**: Level 2 complete (Exercises 2.1-2.4)

---

## 🎯 What You'll Learn

- What the Field is (centralized state container)
- How Field differs from React's useState
- Field as the "whiteboard" everyone can see
- Where Pulses and Intentions live in a running app

---

## 🌍 Real-World Analogy: The Restaurant Whiteboard

Imagine a restaurant kitchen with a **central whiteboard**:

### Without a Whiteboard ❌

```
Chef: "What's the status of Table 5?"
Waiter: "I don't know, ask the cashier"
Cashier: "I don't know, ask the chef"
→ Information scattered everywhere!
→ Everyone confused!
```

### With a Central Whiteboard ✅

```
┌──────────────────────────────────────┐
│     RESTAURANT WHITEBOARD            │
│                                      │
│  Table 5:                            │
│    Order: Biryani x2, Curry x1       │
│    Status: Cooking                   │
│    Total: $44.21                     │
│    Paid: No                          │
│                                      │
│  Table 7:                            │
│    Order: Samosa x3                  │
│    Status: Ready                     │
│    Total: $15.99                     │
│    Paid: Yes                         │
└──────────────────────────────────────┘
        ↓         ↓         ↓
      Chef    Waiter    Cashier
   (all can   (all can  (all can
    see it)    see it)   see it)
```

**Everyone looks at the SAME whiteboard!**
- Chef updates cooking status
- Waiter updates table assignments
- Cashier updates payment status
- All information in ONE place

**This whiteboard = The Field in Intention Tunnel!**

---

## 📖 What is the Field?

The **Field** is a **centralized state container** that holds:
1. **All Pulses** (current data values)
2. **All active Intentions** (what's happening)
3. **Metadata** (timestamps, sources)

### Field Structure (Frontend Intention Tunnel)

```javascript
Field = {
  // All Pulses (the data)
  pulses: Map<string, Pulse>,
  
  // Active Intentions (what's happening)
  intentions: Map<string, Intention>,
  
  // Metadata
  lastUpdated: timestamp,
  updateCount: number
}
```

**Key Insight**: The Field is **passive** - it doesn't DO anything, it just HOLDS state!

---

## 🏗️ Field vs React useState

Let's compare to what you already know:

### Traditional React (Component-Local State)

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('idle');
  
  // Problem: State lives in THIS component only
  // Other components can't see it!
}

function TodoStats() {
  // ❌ Can't access todos from TodoApp!
  // Must pass via props (prop drilling)
}
```

**Issues**:
- State scattered across components
- Props drilling needed to share
- Hard to debug (which component has which state?)

### Intention Tunnel Field (Centralized State)

```javascript
// Field (lives in IntentionTunnelProvider)
Field = {
  pulses: {
    'todos': { 
      prompt: 'todos',
      responses: ['[{"id":1, "text":"Buy milk"}]'],
      trivalence: 'N'
    },
    'todo_count': {
      prompt: 'todo_count',
      responses: ['1'],
      trivalence: 'N'
    },
    'app_status': {
      prompt: 'app_status',
      responses: ['idle'],
      trivalence: 'N'
    }
  }
}

// Any component can access:
function TodoApp() {
  const todos = useFieldPulse('todos'); // ✅ Access Field
}

function TodoStats() {
  const count = useFieldPulse('todo_count'); // ✅ Same Field!
}
```

**Benefits**:
- All state in ONE place (the Field)
- Any component can subscribe
- Easy to debug (just inspect Field)
- No prop drilling!

---

## 🎨 Visual: Where Everything Lives

```
┌─────────────────────────────────────────────────────┐
│          IntentionTunnelProvider                    │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │              FIELD                        │    │
│  │                                           │    │
│  │  Pulses:                                  │    │
│  │    'todos' → [...all todos...]            │    │
│  │    'todo_count' → 5                       │    │
│  │    'active_count' → 2                     │    │
│  │                                           │    │
│  │  Intentions:                              │    │
│  │    'INT_ADD_TODO' → active                │    │
│  │    'INT_TOGGLE_TODO' → active             │    │
│  └───────────────────────────────────────────┘    │
│                       ↓                            │
│        All components can see this!                │
│                       ↓                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │TodoInput │  │TodoList  │  │TodoStats │        │
│  │          │  │          │  │          │        │
│  │subscribes│  │subscribes│  │subscribes│        │
│  │to Field  │  │to Field  │  │to Field  │        │
│  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Example: Todo App Field

### Initial Field State

```javascript
// When app starts, Field is initialized:
const initialField = {
  pulses: {
    'todos': {
      prompt: 'todos',
      responses: ['[]'],  // Empty array (no todos yet)
      trivalence: 'N'
    },
    'todo_count': {
      prompt: 'todo_count',
      responses: ['0'],
      trivalence: 'N'
    },
    'active_count': {
      prompt: 'active_count',
      responses: ['0'],
      trivalence: 'N'
    },
    'done_count': {
      prompt: 'done_count',
      responses: ['0'],
      trivalence: 'N'
    }
  },
  intentions: {},  // No active intentions yet
  lastUpdated: Date.now()
}
```

### After User Adds a Todo

```javascript
// User types "Buy milk" and clicks Add
// Object processes, reflects to Field
// Field now contains:

const updatedField = {
  pulses: {
    'todos': {
      prompt: 'todos',
      responses: ['[{"id":1,"text":"Buy milk","done":false}]'],
      trivalence: 'N'  // Changed!
    },
    'todo_count': {
      prompt: 'todo_count',
      responses: ['1'],  // Changed!
      trivalence: 'N'
    },
    'active_count': {
      prompt: 'active_count',
      responses: ['1'],  // Changed!
      trivalence: 'N'
    },
    'done_count': {
      prompt: 'done_count',
      responses: ['0'],  // Still 0
      trivalence: 'N'
    }
  },
  intentions: {
    'INT_ADD_TODO': {
      id: 'INT_ADD_TODO',
      signal: { pulses: [...] },
      timestamp: 1703692800100
    }
  },
  lastUpdated: 1703692800100  // Updated!
}
```

**All components see this update immediately!**

---

## 🔄 How Field Updates Flow

```
User Action (Button Click)
      ↓
Component emits Intention
      ↓
emit('INT_ADD_TODO', { text: 'Buy milk' })
      ↓
Object receives Intention
      ↓
Object reflects to Field
      ↓
Field.pulses updated
      ↓
Field notifies all subscribers
      ↓
Components re-render with new data
      ↓
User sees updated UI
```

**The Field is the central hub!**

---

## 🎯 Field Properties

### 1. Centralized

All state in one place:
```javascript
// ❌ Bad: State scattered
Component A: [todos]
Component B: [count]
Component C: [status]
→ Hard to track, hard to debug

// ✅ Good: All in Field
Field: {
  todos,
  count,
  status
}
→ Single source of truth!
```

### 2. Passive

Field doesn't execute logic:
```javascript
// Field does NOT do this: ❌
Field.calculateTotal() 
Field.validateInput()
Field.processOrder()

// Field only does this: ✅
Field.setPulse('total', newValue)
Field.getPulse('total')
Field.notifySubscribers()
```

**Business logic lives in DNs, not Field!**

### 3. Observable

Components can subscribe to changes:
```javascript
// Component subscribes to specific pulse
const todos = useFieldPulse('todos');

// When Field.pulses['todos'] changes:
// → Component automatically re-renders
// → Gets new value
// → UI updates
```

### 4. Persistent (in memory during session)

Field survives component unmounts:
```javascript
// Component A unmounts (destroyed)
// Field still holds state ✅

// Component B mounts (created)
// Can read same state from Field ✅
```

---

## 💡 Key Differences from Backend CPUX

Since you're learning Frontend Intention Tunnel:

| Aspect | Backend CPUX | Frontend Intention Tunnel |
|--------|--------------|--------------------------|
| **Field** | Carried by Visitor | Passive React Context |
| **Updates** | Visitor tours members | User emits Intentions |
| **Execution** | Active loop (passes) | Event-driven (reactions) |
| **Who drives?** | Visitor (autonomous) | User (external agent) |
| **Termination** | Golden Pass | User stops interacting |

**In Frontend**: You emit to Field, Field notifies subscribers. Simple!

---

## 🎨 Field as React Context (Implementation Preview)

```javascript
// IntentionTunnelProvider.jsx
function IntentionTunnelProvider({ children }) {
  const [field, setField] = useState({
    pulses: {},
    intentions: {},
    lastUpdated: Date.now()
  });
  
  // Components access Field via Context
  return (
    <FieldContext.Provider value={{ field, setField }}>
      {children}
    </FieldContext.Provider>
  );
}

// Any component can now access Field:
function TodoList() {
  const { field } = useContext(FieldContext);
  const todos = field.pulses['todos']?.responses[0];
  // ...render todos
}
```

**The Field is just React Context under the hood!**

---

## 💡 Key Takeaways

### ✅ Remember This

1. **Field = Centralized State Container**
   - Holds all Pulses (data)
   - Holds active Intentions
   - Single source of truth

2. **Field is Passive**
   - Doesn't execute business logic
   - Just stores and notifies
   - DNs/Objects do the work

3. **Field Enables Sharing**
   - Any component can subscribe
   - No prop drilling needed
   - All see same state

4. **Field as React Context**
   - Implemented using React Context API
   - Components subscribe via hooks
   - Updates trigger re-renders

### ❌ Common Misconceptions

- ❌ "Field does calculations" → No! DNs compute, Field stores
- ❌ "Field is like Redux" → Similar idea, different mechanics
- ❌ "Each component has its own Field" → No! ONE Field for whole app
- ❌ "Field tours members" → No! That's Backend CPUX Visitor

---

## 🤔 Check Your Understanding

### Question 1
What does the Field hold?
- a) Only Pulses
- b) Only Intentions
- c) Both Pulses and Intentions
- d) React components

<details>
<summary>Answer</summary>

**c) Both Pulses and Intentions**

The Field is the central container for ALL state: Pulses (data values) and active Intentions (what's happening).
</details>

### Question 2
How many Fields does a Frontend Intention Tunnel app have?
- a) One per component
- b) One per DN/Object
- c) One for the entire app
- d) Unlimited

<details>
<summary>Answer</summary>

**c) One for the entire app**

There is ONE centralized Field (React Context) that all components share. Single source of truth!
</details>

### Question 3
What does the Field NOT do?
- a) Store Pulses
- b) Execute business logic
- c) Notify subscribers
- d) Track Intentions

<details>
<summary>Answer</summary>

**b) Execute business logic**

The Field is passive - it only stores state and notifies subscribers. Business logic lives in Design Nodes, NOT in the Field.
</details>

### Question 4
In Frontend Intention Tunnel, who drives Field updates?
- a) Visitor (touring members)
- b) User interactions (external)
- c) Automatic timer
- d) Background process

<details>
<summary>Answer</summary>

**b) User interactions (external)**

In Frontend Intention Tunnel, the user is the external driver. User actions emit Intentions into the Field, triggering updates. (This differs from Backend CPUX where Visitor is the internal driver.)
</details>

---

## 📚 Restaurant Whiteboard Summary

```
WHITEBOARD (Field)
    ↓
Holds all order info (Pulses)
Holds all active tasks (Intentions)
    ↓
    
CHEF (DN) can read it
WAITER (Object) can read it
CASHIER (DN) can read it
    ↓
    
When status changes:
    ↓
Whiteboard updated
    ↓
Everyone sees update
    ↓
Everyone reacts accordingly
```

**One whiteboard, everyone synchronized!**

---

## 🎯 Practice: Identify Field Contents

### Scenario: Shopping Cart App

User adds items to cart. What should the Field contain?

```javascript
// 🔧 TODO: Design the Field structure

Field = {
  pulses: {
    'cart_items': {
      // What goes here?
    },
    'cart_total': {
      // What goes here?
    },
    'item_count': {
      // What goes here?
    }
  },
  intentions: {
    // Active intentions?
  }
}
```

<details>
<summary>Solution</summary>

```javascript
Field = {
  pulses: {
    'cart_items': {
      prompt: 'cart_items',
      responses: ['[{"id":1,"name":"Biryani","price":12.99,"qty":2}]'],
      trivalence: 'N'
    },
    'cart_total': {
      prompt: 'cart_total',
      responses: ['25.98'],
      trivalence: 'N'
    },
    'item_count': {
      prompt: 'item_count',
      responses: ['2'],
      trivalence: 'N'
    }
  },
  intentions: {
    'INT_ADD_TO_CART': {
      id: 'INT_ADD_TO_CART',
      signal: { pulses: [...] },
      timestamp: Date.now()
    }
  },
  lastUpdated: Date.now()
}
```

**All cart state in Field!**
- Cart items (what's in cart)
- Cart total (computed by DN)
- Item count (computed by DN)
- Active intentions (what's happening)
</details>

---

## Special Note On Objects
  There is a reason why Intention gets reflected by an Object before reaching the Field , in summary it fufills three purposes:
  1. It allows the Object to react to the Intention before it is reflected in the Field.
  2. It allows the Object to "filter" and map the Intention, so correct Intentions are reflected to the Field, but still carrying the original response received by the Object.
  3. It allows the Object to reflect compensatory Intention, to undo previous reflected Intention.

  At this point you may just muse over these thoughts and we shall revist these concepts in real detail when we cover Objects exercise
  
## ➡️ Next Exercise

**Exercise 3.2: Multiple Components, One Field**

You'll see how different components subscribe to the SAME Field and all stay synchronized automatically.

---

## 🎓 Reflection Questions

1. **How is Field different from useState in each component?**  
   Hint: Centralized vs. scattered

2. **Why is Field "passive"?**  
   Think: Who does the work?

3. **What happens when a Pulse in Field changes?**  
   Think: Subscribers, re-renders

4. **In colab.kitchen, what Pulses would the Field hold?**
   - User's location? → Pulse: ???
   - Available dishes? → Pulse: ???
   - Cart items? → Pulse: ???
   - Order status? → Pulse: ???

---

**Estimated time**: 10 minutes  
**Concepts introduced**: Field as centralized passive state container  
**Next step**: See how multiple components use the same Field
