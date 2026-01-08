# Exercise 4.3: Aggregating Multiple Orders (CSV Pattern)

## 🎯 What You'll Learn
- How Objects accumulate multiple intentions
- CSV aggregation through string concatenation (pure operation)
- Why treating values as "opaque strings" maintains purity
- Pattern: Multiple inputs → Single aggregated output

## 🌍 Real-World Example: The Order Window

Imagine a restaurant delivery window that collects orders one by one:

1. **Kitchen finishes dishes individually**: "Pasta for Alice", "Salad for Bob", "Burger for Carol"
2. **Delivery Window (Object)**: Holds each order as it arrives
3. **When ready**: Aggregates all orders into a single list for the server
4. **Format**: CSV (Comma-Separated Values) - one line per order

**Key insight**: The Object doesn't understand what "Pasta" or "Alice" means. It just appends strings: `"row1\nrow2\nrow3"`.

## ⚠️ CRITICAL PRINCIPLE: Opaque String Handling

**Objects treat pulse values as opaque strings:**

```javascript
// ✅ PURE: String concatenation
pulse1: "Pasta,Alice,3"
pulse2: "Salad,Bob,3"
    ↓ Object appends
result: "Pasta,Alice,3\nSalad,Bob,3"

// Object doesn't know what these strings mean!
// It's just: string1 + "\n" + string2
```

**vs**

```javascript
// ❌ IMPURE: Parsing and interpreting
pulse1: "Pasta,Alice,3"
    ↓ Object parses CSV
dish: "Pasta", customer: "Alice", table: 3
    ↓ Object interprets
if (dish === "Pasta") { translate to "Fideos" }
```

**The rule**: If Object needs to UNDERSTAND the value, it's computation!

## 📊 Where We Are

```
✅ Level 1: Pulses (data containers)
✅ Level 2: Field (shared state)
✅ Level 3: Intentions (communication channels)
✅ Level 4.1: Objects receive, hold, reflect
✅ Level 4.2: Objects do PURE pulse-to-pulse operations
👉 Level 4.3: Objects aggregate multiple intentions (CSV)
   Level 4.4: Objects vs Design Nodes
```

**What's new**: Multiple intentions held → Process ALL → Aggregate into single output

---

## 🎨 Interactive Demo

**Setup**: Create a new file `exercise-4-3-csv-aggregation.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exercise 4.3: CSV Aggregation</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 1200px; 
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
    .window { background-color: #e3f2fd; }
    .server { background-color: #d4edda; }
    
    .pulse-box {
      background: white;
      padding: 12px;
      margin: 8px 0;
      border-left: 4px solid #2196F3;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    
    .pulse-name {
      font-weight: bold;
      color: #1976D2;
    }
    
    .pulse-value {
      color: #333;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 8px;
    }
    
    .csv-row {
      background: #f5f5f5;
      padding: 8px;
      margin: 4px 0;
      border-left: 3px solid #4CAF50;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    button {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover { background-color: #1976D2; }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .status-box {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 15px 0;
    }
    
    .held-count {
      display: inline-block;
      background: #ff9800;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: bold;
      margin-left: 10px;
    }
    
    .operation-log {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
      max-height: 300px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    .log-entry {
      margin: 4px 0;
      padding: 4px;
    }
    
    .log-entry.receive { color: #2196F3; }
    .log-entry.aggregate { color: #4CAF50; }
    .log-entry.reflect { color: #9C27B0; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    // ========================================
    // Order Aggregation Object (CSV Pattern)
    // ========================================
    class OrderAggregator {
      constructor() {
        this.heldIntentions = [];
        this.log = [];
      }

      // Receive an order (holds it)
      receive(intention) {
        this.heldIntentions.push(intention);
        this.addLog('receive', `Received order: ${intention.pulses.item_dish} for ${intention.pulses.customer_name}`);
      }

      // Pure CSV aggregation
      aggregateToCSV(intentions) {
        this.addLog('aggregate', `Aggregating ${intentions.length} orders...`);
        
        const csvRows = intentions.map(intention => {
          const { item_dish, customer_name, table_num } = intention.pulses;
          // Build CSV row: "dish,customer,table"
          return `${item_dish},${customer_name},${table_num}`;
        });

        // Join with newlines
        const csvString = csvRows.join('\n');
        
        this.addLog('aggregate', `CSV result:\n${csvString}`);
        
        return csvString;
      }

      // Reflect: Process ALL held intentions
      reflect(onReflected) {
        if (this.heldIntentions.length === 0) {
          return null;
        }

        this.addLog('reflect', `Processing ${this.heldIntentions.length} held intentions`);

        // Extract table number (assume all same table for this demo)
        const tableNum = this.heldIntentions[0].pulses.table_num;
        
        // Aggregate ALL intentions into CSV
        const csvString = this.aggregateToCSV(this.heldIntentions);
        
        // Create aggregated pulse
        const aggregatedPulses = {
          [`table_${tableNum}_orders`]: csvString,
          order_count: String(this.heldIntentions.length)
        };

        // Also keep individual pulses (immutable)
        this.heldIntentions.forEach((intention, idx) => {
          Object.entries(intention.pulses).forEach(([key, value]) => {
            aggregatedPulses[`order_${idx+1}_${key}`] = value;
          });
        });

        this.addLog('reflect', `Reflected ${this.heldIntentions.length} orders to server`);

        // Clear held intentions
        this.heldIntentions = [];
        
        // Callback with result
        onReflected(aggregatedPulses);
        
        return aggregatedPulses;
      }

      getState() {
        return {
          heldCount: this.heldIntentions.length,
          log: this.log
        };
      }

      addLog(type, message) {
        this.log.push({ type, message, timestamp: new Date().toLocaleTimeString() });
      }

      clearLog() {
        this.log = [];
      }
    }

    // ========================================
    // UI Component
    // ========================================
    function AggregationDemo() {
      const [aggregator] = useState(() => new OrderAggregator());
      const [heldCount, setHeldCount] = useState(0);
      const [inputPulses, setInputPulses] = useState({});
      const [outputPulses, setOutputPulses] = useState({});
      const [log, setLog] = useState([]);

      const updateState = () => {
        const state = aggregator.getState();
        setHeldCount(state.heldCount);
        setLog([...state.log]);
      };

      const sendOrder = (dish, customer, table) => {
        const pulses = {
          item_dish: dish,
          customer_name: customer,
          table_num: String(table)
        };

        setInputPulses(pulses);
        
        aggregator.receive({
          intentionId: 'INT_ORDER',
          pulses
        });
        
        updateState();
      };

      const reflectOrders = () => {
        aggregator.reflect((pulses) => {
          setOutputPulses(pulses);
          updateState();
        });
      };

      const reset = () => {
        aggregator.heldIntentions = [];
        aggregator.clearLog();
        setHeldCount(0);
        setInputPulses({});
        setOutputPulses({});
        setLog([]);
      };

      const renderPulses = (pulses) => {
        return Object.entries(pulses).map(([key, value]) => (
          <div key={key} className="pulse-box">
            <span className="pulse-name">{key}:</span>
            <span className="pulse-value">{value}</span>
          </div>
        ));
      };

      const renderCSV = (csvString) => {
        return csvString.split('\n').map((row, idx) => (
          <div key={idx} className="csv-row">
            {row}
          </div>
        ));
      };

      return (
        <div>
          <h1>📦 Exercise 4.3: CSV Aggregation Pattern</h1>
          
          <div className="status-box">
            <strong>💡 How It Works:</strong>
            <ol style={{margin: '10px 0', paddingLeft: '20px'}}>
              <li>Kitchen sends orders ONE AT A TIME</li>
              <li>Object HOLDS each order (accumulates)</li>
              <li>When ready, Object AGGREGATES all into CSV string</li>
              <li>Server receives single CSV with all orders</li>
            </ol>
            <strong>Key:</strong> Object treats values as opaque strings (no parsing!)
          </div>

          <div className="section kitchen">
            <h3>🍳 Kitchen (Sends Orders)</h3>
            <button onClick={() => sendOrder('Pasta', 'Alice', 3)}>
              Send: Pasta for Alice (Table 3)
            </button>
            <button onClick={() => sendOrder('Salad', 'Bob', 3)}>
              Send: Salad for Bob (Table 3)
            </button>
            <button onClick={() => sendOrder('Burger', 'Carol', 3)}>
              Send: Burger for Carol (Table 3)
            </button>
            <button onClick={() => sendOrder('Pizza', 'Dave', 5)}>
              Send: Pizza for Dave (Table 5)
            </button>
            
            {Object.keys(inputPulses).length > 0 && (
              <div style={{marginTop: '15px'}}>
                <strong>Last Order Sent:</strong>
                {renderPulses(inputPulses)}
              </div>
            )}
          </div>

          <div className="section window">
            <h3>📦 Delivery Window (Object)</h3>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '15px'}}>
              <strong>Held Orders:</strong>
              <span className="held-count">{heldCount}</span>
            </div>
            
            <button 
              onClick={reflectOrders} 
              disabled={heldCount === 0}
              style={{
                backgroundColor: heldCount > 0 ? '#4CAF50' : '#ccc'
              }}
            >
              🔄 Aggregate & Reflect to Server
            </button>
            
            <button onClick={reset} style={{backgroundColor: '#f44336'}}>
              🔄 Reset
            </button>

            {heldCount > 0 && (
              <div className="status-box" style={{marginTop: '15px', background: '#fff3e0'}}>
                <strong>✨ Ready to aggregate {heldCount} order(s)</strong>
                <p style={{margin: '10px 0 0 0', fontSize: '14px'}}>
                  Will create CSV: "dish,customer,table" (one row per order)
                </p>
              </div>
            )}
          </div>

          <div className="section server">
            <h3>👨‍🍳 Server (Receives Aggregated Orders)</h3>
            {Object.keys(outputPulses).length > 0 ? (
              <div>
                <strong>Received Pulses:</strong>
                {renderPulses(outputPulses)}
                
                {outputPulses.table_3_orders && (
                  <div style={{marginTop: '20px'}}>
                    <strong>📋 Table 3 Orders (CSV):</strong>
                    {renderCSV(outputPulses.table_3_orders)}
                    <div style={{
                      background: '#e8f5e9',
                      padding: '15px',
                      borderRadius: '4px',
                      marginTop: '15px',
                      border: '2px solid #4CAF50'
                    }}>
                      <strong style={{color: '#4CAF50'}}>✅ Pure Aggregation:</strong>
                      <ul>
                        <li>Object did NOT parse CSV</li>
                        <li>Just concatenated strings with "\n"</li>
                        <li>Treated values as opaque text</li>
                        <li>ALL original pulses preserved (order_1_*, order_2_*, etc.)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{color: '#666'}}>Waiting for orders...</p>
            )}
          </div>

          <div className="section">
            <h3>📋 Operation Log</h3>
            <div className="operation-log">
              {log.length === 0 ? (
                <div style={{color: '#999'}}>No operations yet...</div>
              ) : (
                log.map((entry, idx) => (
                  <div key={idx} className={`log-entry ${entry.type}`}>
                    [{entry.timestamp}] {entry.message}
                  </div>
                ))
              )}
            </div>
            <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
              💡 Watch how multiple orders accumulate then aggregate into CSV
            </p>
          </div>
        </div>
      );
    }

    ReactDOM.render(<AggregationDemo />, document.getElementById('root'));
  </script>
</body>
</html>
```

---

## 📝 Step-by-Step Instructions

### **Step 1: Send Multiple Orders**

1. Open the HTML file in your browser
2. Click **"Send: Pasta for Alice (Table 3)"**
3. **Observe**: "Held Orders: 1"
4. Click **"Send: Salad for Bob (Table 3)"**
5. **Observe**: "Held Orders: 2"
6. Click **"Send: Burger for Carol (Table 3)"**
7. **Observe**: "Held Orders: 3"

**What's happening?**
- Each click sends ONE intention
- Object HOLDS each one (accumulates)
- No reflection yet!

---

### **Step 2: Aggregate & Reflect**

1. With 3 orders held, click **"Aggregate & Reflect to Server"**
2. **Check the log**: See aggregation happening
3. **Observe Server section**: Shows CSV output:
   ```
   Pasta,Alice,3
   Salad,Bob,3
   Burger,Carol,3
   ```

**What happened?**
- Object processed ALL 3 held intentions
- Created CSV string: row1 + "\n" + row2 + "\n" + row3
- This is just string concatenation (pure!)

---

### **Step 3: See Individual Pulses Preserved**

1. Look at "Received Pulses" in Server section
2. **Observe**: You'll see:
   ```
   table_3_orders: "Pasta,Alice,3\nSalad,Bob,3\nBurger,Carol,3"
   order_count: "3"
   order_1_item_dish: "Pasta"
   order_1_customer_name: "Alice"
   order_1_table_num: "3"
   order_2_item_dish: "Salad"
   order_2_customer_name: "Bob"
   order_2_table_num: "3"
   order_3_item_dish: "Burger"
   order_3_customer_name: "Carol"
   order_3_table_num: "3"
   ```

**Key insight**: ALL original pulses preserved! Immutable!

---

### **Step 4: Multiple Tables**

1. Click **Reset**
2. Send 2 orders to Table 3
3. Aggregate & reflect
4. **Reset again**
5. Send 2 orders to Table 5
6. Aggregate & reflect

**Observe**: Each table gets its own CSV pulse (`table_3_orders`, `table_5_orders`)

---

## ✅ Check Your Understanding

After completing the exercise, you should be able to:

- [ ] Explain how Objects accumulate multiple intentions
- [ ] Describe CSV aggregation as pure string concatenation
- [ ] Understand why "opaque string handling" maintains purity
- [ ] Explain the difference between aggregating vs parsing

**Test yourself**:

**Q1**: The Object receives 3 orders. How many times does it process them?  
**A**: Once! It holds all 3, then processes them together when reflect() is called.

**Q2**: Is `"row1\nrow2\nrow3"` creation pure or impure?  
**A**: PURE! It's just string concatenation. Object doesn't understand what "row1" means.

**Q3**: What if Object parsed CSV to extract dish name?  
**A**: That's IMPURE! Parsing means understanding the structure = computation.

**Q4**: Are original pulses lost after aggregation?  
**A**: NO! Object creates NEW pulses (`table_3_orders`) while preserving originals (`order_1_*`, `order_2_*`).

---

## 🎯 What Did We Learn?

### **Aggregation Pattern: Multiple → Single**

```javascript
// Input: Multiple intentions held
Intention 1: {item_dish: "Pasta", customer_name: "Alice", table_num: "3"}
Intention 2: {item_dish: "Salad", customer_name: "Bob", table_num: "3"}
Intention 3: {item_dish: "Burger", customer_name: "Carol", table_num: "3"}

// Object aggregates (pure string operation)
↓ Concatenate: "Pasta,Alice,3" + "\n" + "Salad,Bob,3" + "\n" + "Burger,Carol,3"

// Output: Single aggregated pulse
{
  table_3_orders: "Pasta,Alice,3\nSalad,Bob,3\nBurger,Carol,3",
  order_count: "3",
  // ALL originals preserved
  order_1_item_dish: "Pasta",
  order_1_customer_name: "Alice",
  ...
}
```

### **Why This is Pure**

| Aspect | Pure Aggregation | Impure Alternative |
|--------|------------------|-------------------|
| **Operation** | String concatenation | Parse CSV, extract fields |
| **Understanding** | Treats as opaque text | Interprets structure |
| **Logic** | `string1 + "\n" + string2` | `if (dish === "X") {...}` |
| **Computation** | None | Value-based decisions |

### **Key Principle: Opaque Values**

The Object doesn't know:
- What "Pasta" means
- That "Alice" is a name
- That "3" is a table number

It just knows:
- These are strings
- Concatenate them with ","
- Join rows with "\n"

**No interpretation = No computation = PURE!**

---

## 💡 Key Takeaways

### 🔑 **Accumulation Pattern**

1. **Receive Phase**
   - Object holds intentions one by one
   - No processing yet
   - Just accumulates in array

2. **Aggregate Phase**
   - When ready (all orders in)
   - Process ALL held intentions together
   - Create single aggregated output

3. **Reflect Phase**
   - Emit aggregated result
   - Preserve all originals (immutable)
   - Clear held intentions

### 🚀 **When to Use CSV Aggregation**

✅ **Use this pattern when:**
- Multiple related items need grouping
- Order matters (sequential rows)
- Simple text format acceptable
- No complex structure needed

❌ **Don't use when:**
- Need to query/search aggregated data (use Design Node)
- Need to validate individual items (use Design Node)
- Need to transform values (use Design Node)

### 🎯 **Pure vs Impure Aggregation**

```javascript
// ✅ PURE: String append
rows.join('\n')  // Just concatenation

// ❌ IMPURE: Parse and process
rows.map(r => {
  const [dish, customer, table] = r.split(',');
  if (dish === 'Pasta') return translate(dish);  // Computation!
})
```

---

## 🎨 Visual Summary

```
Kitchen sends orders one-by-one
┌──────────────────────────┐
│ Order 1: Pasta for Alice │
│ Order 2: Salad for Bob   │
│ Order 3: Burger for Carol│
└──────────────────────────┘
           │
           ↓
┌────────────────────────────────────┐
│   Delivery Window (Object)         │
├────────────────────────────────────┤
│  Held: [Order1, Order2, Order3]    │
│                                    │
│  When ready:                       │
│  1. Extract values                 │
│  2. Format: "dish,customer,table"  │
│  3. Join: row1 + "\n" + row2 + ... │
│                                    │
│  ✅ Pure string concatenation!     │
└────────────────────────────────────┘
           │
           ↓
Server receives aggregated CSV
┌────────────────────────────────────┐
│ table_3_orders:                    │
│   "Pasta,Alice,3\n                 │
│    Salad,Bob,3\n                   │
│    Burger,Carol,3"                 │
│                                    │
│ + All individual pulses preserved  │
└────────────────────────────────────┘
```

---

## 🔗 Connection to Previous Exercises

**Exercise 4.1**: Objects receive, hold, check gatekeeper  
**Exercise 4.2**: Objects map pulse → pulse (immutable)  
**Exercise 4.3**: Objects aggregate multiple → single (CSV)  

**Next**: Exercise 4.4 will show Objects vs Design Nodes - when to aggregate (Object) vs when to process (DN)

---

## ➡️ Next Exercise

**Exercise 4.4: Objects vs Design Nodes - The Critical Distinction**

Now that you've seen Objects aggregate, we'll explore:
- When aggregation belongs in Object (pure string concat)
- When processing belongs in Design Node (interpretation)
- Complete example: Object aggregates → DN processes → Object reflects

**Preview**: What if we need to translate "Pasta" → "Fideos" in the CSV? That's NOT aggregation - it's transformation! We'll see how Design Nodes handle that while Objects stay pure.
