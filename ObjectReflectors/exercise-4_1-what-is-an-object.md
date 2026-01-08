# Exercise 4.1: What is an Object?

## 🎯 What You'll Learn
- Objects receive intentions and reflect them (like a mirror)
- Objects have **temporary persistence** (they hold state while waiting)
- Objects check **gatekeeper conditions** before reflecting
- Reflection is **asynchronous** (happens when ready, not immediately)

## 🌍 Real-World Example: The Delivery Window

Imagine a restaurant kitchen with a **delivery window**:

1. **Kitchen (Design Node)** prepares dishes
2. **Delivery Window (Object)** receives completed dishes
3. **Window checks**: "Is this for Table 3? Are all Table 3 items ready?"
4. **Window reflects**: When conditions met, calls server to Table 3

**Key insight**: The window **holds dishes temporarily** until the right moment to deliver them. It doesn't cook anything—it just receives, holds, checks, and reflects.

---

## 📊 Where We Are

```
✅ Level 1: Pulses (data containers)
✅ Level 2:  Intentions (communication channels)
✅ Level 3: Field (shared state)
👉 Level 4: Objects (reflectors with persistence)
   Level 5: Design Nodes (processors)
   Level 6: Complete CPUX
```

**What's new**: Between "emit intention" and "someone processes it," there's an **Object** that:
- Receives the intention
- Holds it temporarily
- Checks if conditions are met
- Reflects to next destination when ready

---

## 🔧 Starting Point

We'll build a simple restaurant delivery system to see Objects in action.

**Setup**: Create a new file `exercise-4-1-object-mirror.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exercise 4.1: Object as Mirror</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 800px; 
      margin: 50px auto;
      padding: 20px;
    }
    .section {
      border: 2px solid #ddd;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .kitchen { background-color: #fff3cd; }
    .window { background-color: #d1ecf1; }
    .table { background-color: #d4edda; }
    
    .item {
      background: white;
      padding: 10px;
      margin: 10px 0;
      border-left: 4px solid #007bff;
      border-radius: 4px;
    }
    
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 10px;
    }
    .status.waiting { background-color: #ffc107; color: black; }
    .status.ready { background-color: #28a745; color: white; }
    .status.delivered { background-color: #6c757d; color: white; }
    
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover { background-color: #0056b3; }
    
    .concept-box {
      background-color: #e7f3ff;
      border-left: 4px solid #007bff;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    // 🔧 STEP 1: Define what an Object looks like
    class DeliveryWindow {
      constructor() {
        // Objects have TEMPORARY PERSISTENCE
        this.heldItems = [];  // Holds dishes until ready to reflect
      }

      // Objects RECEIVE intentions
      receive(intention) {
        console.log('📥 Window received:', intention);
        
        // Store temporarily (PERSISTENCE)
        this.heldItems.push({
          ...intention,
          receivedAt: new Date().toLocaleTimeString()
        });
      }

      // Objects CHECK gatekeeper before reflecting
      checkGatekeeper(tableNumber) {
        // Gatekeeper condition: "Are all items for this table ready?"
        const tableItems = this.heldItems.filter(
          item => item.tableNumber === tableNumber
        );
        
        const allReady = tableItems.every(item => item.status === 'ready');
        
        console.log(`🚪 Gatekeeper check for Table ${tableNumber}:`, 
          allReady ? '✅ PASS' : '❌ WAIT');
        
        return allReady;
      }

      // Objects REFLECT when gatekeeper passes
      reflect(tableNumber, onReflected) {
        // Check gatekeeper first
        if (!this.checkGatekeeper(tableNumber)) {
          console.log(`⏳ Not ready to reflect to Table ${tableNumber}`);
          return null;
        }

        // Gatekeeper passed - reflect!
        const itemsToReflect = this.heldItems.filter(
          item => item.tableNumber === tableNumber
        );

        console.log(`✨ Reflecting to Table ${tableNumber}:`, itemsToReflect);

        // Remove from held items (reflection complete)
        this.heldItems = this.heldItems.filter(
          item => item.tableNumber !== tableNumber
        );

        // ASYNCHRONOUS: Callback happens later
        if (onReflected) {
          onReflected(itemsToReflect);
        }

        return itemsToReflect;
      }

      // Helper: mark item as ready
      markReady(itemName) {
        const item = this.heldItems.find(i => i.dishName === itemName);
        if (item) {
          item.status = 'ready';
          console.log(`✅ ${itemName} marked ready`);
        }
      }

      // Get current state (for display)
      getState() {
        return [...this.heldItems];
      }
    }

    // 🔧 STEP 2: Create the Object instance
    const deliveryWindow = new DeliveryWindow();

    // 🔧 STEP 3: Build the UI
    function RestaurantSystem() {
      const [windowState, setWindowState] = useState([]);
      const [deliveredItems, setDeliveredItems] = useState([]);
      const [log, setLog] = useState([]);

      const addLog = (message) => {
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
      };

      // Simulate kitchen finishing a dish
      const finishDish = (dishName, tableNumber) => {
        // Kitchen sends intention to Object
        const intention = {
          intentionId: 'INT_DISH_READY',
          dishName,
          tableNumber,
          status: 'waiting'  // Not ready for reflection yet
        };

        deliveryWindow.receive(intention);
        setWindowState(deliveryWindow.getState());
        addLog(`Kitchen sent ${dishName} to window (Table ${tableNumber})`);
      };

      // Simulate item being marked ready
      const markItemReady = (dishName) => {
        deliveryWindow.markReady(dishName);
        setWindowState(deliveryWindow.getState());
        addLog(`${dishName} marked READY`);

        // Automatically try to reflect
        setTimeout(() => tryReflect(), 100);
      };

      // Try reflection (checks gatekeeper)
      const tryReflect = () => {
        // Get unique table numbers from window
        const currentState = deliveryWindow.getState();
        const tables = [...new Set(currentState.map(item => item.tableNumber))];

        if (tables.length === 0) {
          addLog('ℹ️ No items in window to reflect');
          return;
        }

        tables.forEach(tableNum => {
          const tableItems = currentState.filter(i => i.tableNumber === tableNum);
          const canReflect = deliveryWindow.checkGatekeeper(tableNum);
          
          if (canReflect) {
            // Gatekeeper passed - reflect!
            const reflected = deliveryWindow.reflect(tableNum, (items) => {
              setDeliveredItems(prev => [...prev, ...items]);
              addLog(`✨ REFLECTED ${items.length} items to Table ${tableNum} (Gatekeeper PASSED)`);
            });

            if (reflected) {
              setWindowState(deliveryWindow.getState());
            }
          } else {
            // Gatekeeper failed - log why
            const readyCount = tableItems.filter(i => i.status === 'ready').length;
            const totalCount = tableItems.length;
            addLog(`🚪 Table ${tableNum} Gatekeeper BLOCKED: ${readyCount}/${totalCount} items ready`);
          }
        });
      };

      return (
        <div>
          <h1>🪞 Exercise 4.1: Object as Mirror</h1>
          
          <div className="concept-box">
            <strong>Key Concept:</strong> The Delivery Window is an <strong>Object</strong>.
            <ul>
              <li>✅ Receives intentions from Kitchen</li>
              <li>✅ Holds them temporarily (persistence)</li>
              <li>✅ Checks gatekeeper (all items ready?)</li>
              <li>✅ Reflects when condition met (async)</li>
              <li>❌ Does NOT cook (no computation)</li>
            </ul>
          </div>

          {/* Kitchen Section */}
          <div className="section kitchen">
            <h2>🍳 Kitchen (sends intentions)</h2>
            <button onClick={() => finishDish('Pasta', 3)}>
              Finish Pasta (Table 3)
            </button>
            <button onClick={() => finishDish('Salad', 3)}>
              Finish Salad (Table 3)
            </button>
            <button onClick={() => finishDish('Burger', 5)}>
              Finish Burger (Table 5)
            </button>
          </div>

          {/* Delivery Window (Object) */}
          <div className="section window">
            <h2>🪟 Delivery Window (Object)</h2>
            <p><strong>Held Items:</strong> {windowState.length}</p>
            
            {windowState.length === 0 ? (
              <p style={{color: '#666'}}>No items waiting...</p>
            ) : (
              windowState.map((item, idx) => (
                <div key={idx} className="item">
                  <strong>{item.dishName}</strong> → Table {item.tableNumber}
                  <span className={`status ${item.status}`}>
                    {item.status === 'waiting' ? 'WAITING' : 'READY'}
                  </span>
                  
                  {item.status === 'waiting' && (
                    <button onClick={() => markItemReady(item.dishName)}>
                      Mark Ready
                    </button>
                  )}
                  
                  <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                    Received: {item.receivedAt}
                  </div>
                </div>
              ))
            )}

            <div style={{marginTop: '20px'}}>
              <strong>Gatekeeper Status:</strong>
              <ul>
                {[...new Set(windowState.map(i => i.tableNumber))].map(table => {
                  const tableItems = windowState.filter(i => i.tableNumber === table);
                  const allReady = tableItems.every(i => i.status === 'ready');
                  return (
                    <li key={table}>
                      Table {table}: {allReady ? '✅ Can reflect' : '⏳ Waiting'}
                    </li>
                  );
                })}
              </ul>
            </div>

            <button 
              onClick={tryReflect}
              style={{
                backgroundColor: windowState.length === 0 ? '#ccc' : '#28a745',
                cursor: windowState.length === 0 ? 'not-allowed' : 'pointer'
              }}
              disabled={windowState.length === 0}
            >
              🔄 Test Gatekeeper & Reflect
            </button>
            <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
              ℹ️ Reflection happens automatically when items are marked ready, 
              but you can also test manually with this button.
            </p>
          </div>

          {/* Table Section */}
          <div className="section table">
            <h2>🍽️ Tables (received reflections)</h2>
            {deliveredItems.length === 0 ? (
              <p style={{color: '#666'}}>No deliveries yet...</p>
            ) : (
              deliveredItems.map((item, idx) => (
                <div key={idx} className="item">
                  <strong>{item.dishName}</strong> delivered to Table {item.tableNumber}
                  <span className="status delivered">DELIVERED</span>
                </div>
              ))
            )}
          </div>

          {/* Event Log */}
          <div className="section">
            <h2>📋 Event Log</h2>
            <div style={{
              maxHeight: '200px', 
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              background: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px'
            }}>
              {log.map((entry, idx) => (
                <div key={idx}>{entry}</div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    ReactDOM.render(<RestaurantSystem />, document.getElementById('root'));
  </script>
</body>
</html>
```

---

## 📝 Step-by-Step Instructions

### **Step 1: Try the Basic Flow**

1. Open the HTML file in your browser
2. Click **"Finish Pasta (Table 3)"**
3. **Observe**: Item appears in Delivery Window as "WAITING"
4. Click **"Mark Ready"** on the Pasta
5. **Observe**: Status changes to "READY" but item stays in window
6. Click **"Check & Reflect"**
7. **Observe**: Item disappears from window and appears at Table 3

**Question**: Why didn't it reflect immediately when marked ready?  
**Answer**: The Object checks **gatekeeper conditions** before reflecting.

---

### **Step 2: See Gatekeeper in Action**

1. Click **"Finish Pasta (Table 3)"**
2. Click **"Finish Salad (Table 3)"**
3. **Observe**: Both items in window, both "WAITING"
4. Mark **only Pasta** ready
5. Click **"Check & Reflect"**
6. **Observe**: Nothing reflects! Gatekeeper says "⏳ Waiting"
7. Mark **Salad** ready too
8. Click **"Check & Reflect"**
9. **Observe**: NOW both items reflect together to Table 3

**Key Concept**: Object waits until **all conditions met** before reflecting.

---

### **Step 3: Multiple Tables**

1. Send Pasta to Table 3, Salad to Table 3, Burger to Table 5
2. Mark all Table 3 items ready
3. **Observe**: Table 3 gatekeeper shows "✅ Can reflect"
4. **Observe**: Table 5 gatekeeper shows "⏳ Waiting" (burger not ready)
5. Click "Check & Reflect"
6. **Observe**: Only Table 3 items reflect, Burger stays in window

**Key Concept**: Each table has **independent gatekeeper conditions**.

---

## ✅ Check Your Understanding

After completing the exercise, you should be able to:

- [ ] Explain what "temporary persistence" means
- [ ] Describe when an Object reflects an intention
- [ ] Identify the difference between "receive" and "reflect"
- [ ] Explain why reflection is asynchronous
- [ ] Understand what a "gatekeeper condition" is

**Test yourself**: What happens if you send items but never mark them ready?  
**Answer**: They stay in the Object indefinitely (temporary persistence). Object waits for gatekeeper conditions.

---

## 🎯 What Did We Learn?

### **Objects are NOT like Components**

| Component | Object |
|-----------|--------|
| Renders UI | No UI (invisible) |
| Responds to clicks immediately | Waits for conditions |
| Updates own state | Holds state temporarily |
| Shows data | Passes data through |

### **Objects are Mirrors with Rules**

```
Kitchen → Intention → Object → (waits) → Gatekeeper checks → Reflects → Table
                         ↓
                   Held temporarily
                   (persistence)
```

### **Three Key Properties**

1. **Receive**: Accept intentions from anywhere
2. **Persist**: Hold state temporarily while waiting
3. **Reflect**: Pass through when gatekeeper conditions met

---

## 💡 Key Takeaways

### 🔑 **What Makes Objects Special**

1. **Asynchronous by Design**
   - Don't reflect immediately
   - Wait for right conditions
   - Hold state in between

2. **Gatekeeper Pattern**
   ```javascript
   if (checkGatekeeper()) {
     reflect();  // Only when ready
   } else {
     hold();     // Keep waiting
   }
   ```

3. **Temporary Persistence**
   - Not permanent storage (like database)
   - Not transient (like function variable)
   - Held "for now" until conditions met

4. **Pure Reflection**
   - Objects don't compute
   - They don't add/modify dish names
   - They just hold, check, pass through

---

## 🔗 Connection to Field

Remember from Level 3: Intentions flow through the Field.

**Now we see**: Objects are like "waiting rooms" in that flow:

```
Component → emit to Field → Object receives → (holds) → 
→ Gatekeeper checks → Object reflects → Field updates → Next step
```

The **Field** is the shared space.  
The **Object** is a checkpoint in that space.

---

## 🎨 Visual Summary

```
┌─────────────────────────────────────────┐
│          DELIVERY WINDOW                │
│           (Object)                      │
├─────────────────────────────────────────┤
│                                         │
│  📥 RECEIVE                             │
│  ├─ Pasta (Table 3) - waiting          │
│  └─ Salad (Table 3) - ready            │
│                                         │
│  🚪 GATEKEEPER                          │
│  └─ Table 3: ⏳ Not all ready          │
│                                         │
│  ⏳ PERSIST (hold items)                │
│                                         │
│  ✨ REFLECT (when ready)                │
│  └─ (waiting for gatekeeper...)        │
│                                         │
└─────────────────────────────────────────┘
```

---

## ➡️ Next Exercise

**Exercise 4.2: Objects Transform Data (Pure Reflection)**

Now that you understand Objects receive and hold, we'll explore:
- How Objects transform pulse data (copy, map, filter)
- Why transformations must be "pure" (no computation)
- The difference between Object transformation and DN processing

**Preview**: What if Table 3 ordered in English but the kitchen uses Spanish? The Object can **map** dish names without computing anything...

---

## 🤔 Think About It

Before moving on, consider:

1. Why do you think Objects hold state temporarily instead of immediately reflecting?
2. What problems might occur if Objects reflected immediately without checking conditions?
3. How is this different from a React component's `useState`?

**Hint**: Think about coordinating multiple kitchen stations preparing different parts of an order...

---

**Great job!** 🎉 You've learned the foundation of Objects. In the next exercise, we'll dive deeper into how Objects transform data through pure PnR operations.

---

## 📚 Additional Resources

**Key Concepts Introduced:**
- Object as reflector
- Temporary persistence
- Gatekeeper conditions
- Asynchronous reflection

**Related Documentation:**
- CPUX Reference Manual: Section 1.4 (Object)
- CPUX Reference Manual: Section 1.10 (Gatekeeper)
- Intention Tunnel Conceptual Model: Section 2.3

**Next Level Preview:**
- Exercise 4.2: Pure PnR transformations
- Exercise 4.3: Multiple gatekeeper conditions
- Exercise 4.4: Objects vs Design Nodes (critical distinction)
