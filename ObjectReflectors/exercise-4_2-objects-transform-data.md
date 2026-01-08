# Exercise 4.2: Pure Pulse-to-Pulse Operations (The Right Way)

## 🎯 What You'll Learn
- Objects perform **pulse-to-pulse mapping** (NOT value transformation)
- The critical difference between "mapping pulses" and "transforming values"
- Why changing pulse values breaks CPUX purity
- Pure operations: COPY pulse, FILTER pulses, AGGREGATE pulses

## 🌍 Real-World Example: The Order Aggregation Window

Imagine a restaurant delivery window that collects individual orders:

1. **Kitchen finishes dishes one by one**: "Pasta for Table 3", "Salad for Table 3"
2. **Delivery Window (Object)**: Groups items by table number
3. **Server receives**: All Table 3 items together

**Key insight**: The window **doesn't change dish names** or **calculate anything**. It just **groups pulses** by table.

## ⚠️ CRITICAL ARCHITECTURAL PRINCIPLE

**Objects map PULSES to PULSES, NOT values to values!**

```javascript
// ✅ RIGHT: Pulse-to-pulse mapping
{
  "item_1_dish": ["Pasta", "Y"]     // Original pulse
}
↓ Object copies to new pulse name
{
  "item_1_dish": ["Pasta", "Y"],    // Original (unchanged)
  "table_3_dish": ["Pasta", "Y"]    // NEW pulse, SAME value
}

// ❌ WRONG: Value transformation
{
  "dish_name": ["Pasta", "Y"]
}
↓ Object changes the value
{
  "dish_name": ["Fideos", "Y"]      // Value changed! (breaks purity)
}
```

**Why this matters**: Once you allow Objects to change values, where do you stop? Is `toLowerCase()` okay? `formatDate()`? `calculate()`? The line becomes blurry.

**The rule**: Objects **NEVER change pulse response values**. Only Design Nodes can create new values.

---

## 📊 Where We Are

```
✅ Level 1: Pulses (data containers)
✅ Level 2: Field (shared state)
✅ Level 3: Intentions (communication channels)
✅ Level 4.1: Objects receive, hold, reflect
👉 Level 4.2: Objects do PURE pulse-to-pulse operations
   Level 4.3: Multiple gatekeeper conditions
   Level 4.4: Objects vs Design Nodes
```

**What's new**: Objects don't transform values—they map **pulses to pulses**. Original pulses stay **immutable**. Only **pulse names** change, never values.

---

## 🔧 Starting Point

We'll build a translation system to see pure transformations in action.

**Setup**: Create a new file `exercise-4-2-pure-pulse-mapping.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exercise 4.2: Pure Pulse Mapping</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 1000px; 
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
    
    .example-box {
      border: 3px solid;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .example-box.wrong { 
      border-color: #f44336; 
      background-color: #ffebee;
    }
    .example-box.right { 
      border-color: #4CAF50; 
      background-color: #e8f5e9;
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
    
    .concept-box {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
    }
    
    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    
    .tab-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .tab-button {
      flex: 1;
      padding: 15px;
      border: 2px solid #ddd;
      background: white;
      cursor: pointer;
      border-radius: 8px 8px 0 0;
      font-weight: bold;
    }
    
    .tab-button.active {
      border-bottom: none;
      background: #e3f2fd;
      border-color: #2196F3;
    }
    
    .tab-button.wrong { border-color: #f44336; }
    .tab-button.wrong.active { background: #ffebee; }
    .tab-button.right { border-color: #4CAF50; }
    .tab-button.right.active { background: #e8f5e9; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    // ========================================
    // WRONG APPROACH: Value Transformation
    // ========================================
    class ImpureObject {
      constructor() {
        this.heldIntentions = [];
        this.dishTranslations = {
          'Pasta': 'Fideos',
          'Salad': 'Ensalada',
          'Burger': 'Hamburguesa'
        };
      }

      receive(intention) {
        this.heldIntentions.push(intention);
      }

      // ❌ WRONG: Transforms pulse VALUES
      transformValues(pulses) {
        console.log('❌ IMPURE: Transforming pulse values...');
        
        return {
          ...pulses,
          dish_name: this.dishTranslations[pulses.dish_name] || pulses.dish_name
        };
      }

      reflect(onReflected) {
        if (this.heldIntentions.length === 0) return null;
        
        const intention = this.heldIntentions[0];
        const transformed = this.transformValues(intention.pulses);
        
        this.heldIntentions = [];
        onReflected({ ...intention, pulses: transformed });
        return transformed;
      }

      getState() {
        return { heldCount: this.heldIntentions.length };
      }
    }

    // ========================================
    // RIGHT APPROACH: Pulse-to-Pulse Mapping
    // ========================================
    class PureObject {
      constructor() {
        this.heldIntentions = [];
      }

      receive(intention) {
        this.heldIntentions.push(intention);
      }

      // ✅ RIGHT: Maps PULSES to PULSES (values unchanged)
      mapPulses(pulses) {
        console.log('✅ PURE: Mapping pulse to pulse...');
        console.log('   Original pulses:', pulses);
        
        // COPY operation: Create new pulse with SAME value
        const mapped = {
          ...pulses,  // Keep originals (immutable!)
          'table_dish': pulses['item_dish'],        // Copy pulse
          'table_customer': pulses['customer_name'], // Copy pulse
          'table_number': pulses['table_num']        // Copy pulse
        };
        
        console.log('   After mapping:', mapped);
        console.log('   Notice: ALL original pulses still present!');
        console.log('   Notice: Values UNCHANGED!');
        
        return mapped;
      }

      // ✅ AGGREGATE: Combine multiple pulses (CSV append)
      aggregatePulses(existingPulses, newPulses) {
        console.log('✅ PURE: Aggregating pulses...');
        
        const tableKey = `table_${newPulses.table_num}_orders`;
        const newLine = `${newPulses.item_dish},${newPulses.customer_name}`;
        
        const existing = existingPulses[tableKey] || '';
        const aggregated = existing ? `${existing}\n${newLine}` : newLine;
        
        console.log('   Appended:', newLine);
        console.log('   Result:', aggregated);
        
        return {
          ...existingPulses,
          [tableKey]: aggregated
        };
      }

      reflect(onReflected, existingAggregated = {}) {
        if (this.heldIntentions.length === 0) return null;
        
        const intention = this.heldIntentions[0];
        let mapped = this.mapPulses(intention.pulses);
        mapped = this.aggregatePulses(existingAggregated, intention.pulses);
        
        this.heldIntentions = [];
        onReflected({ ...intention, pulses: mapped });
        return mapped;
      }

      getState() {
        return { heldCount: this.heldIntentions.length };
      }
    }

    // ========================================
    // UI Component
    // ========================================
    function ComparisonDemo() {
      const [activeTab, setActiveTab] = useState('wrong');
      const [impureObj] = useState(() => new ImpureObject());
      const [pureObj] = useState(() => new PureObject());
      
      const [wrongInput, setWrongInput] = useState({});
      const [wrongOutput, setWrongOutput] = useState({});
      const [rightInput, setRightInput] = useState({});
      const [rightOutput, setRightOutput] = useState({});
      const [aggregated, setAggregated] = useState({});
      const [log, setLog] = useState([]);

      const addLog = (message) => {
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
      };

      // Wrong approach
      const sendOrderWrong = (dish, customer, table) => {
        const pulses = {
          dish_name: dish,
          customer_name: customer,
          table_num: String(table)
        };

        setWrongInput(pulses);
        impureObj.receive({ intentionId: 'INT_ORDER', pulses });
        addLog(`❌ WRONG: Sent order (${dish})`);
      };

      const reflectWrong = () => {
        impureObj.reflect((intention) => {
          setWrongOutput(intention.pulses);
          addLog(`❌ Object CHANGED value: ${wrongInput.dish_name} → ${intention.pulses.dish_name}`);
        });
      };

      // Right approach
      const sendOrderRight = (dish, customer, table) => {
        const pulses = {
          item_dish: dish,
          customer_name: customer,
          table_num: String(table)
        };

        setRightInput(pulses);
        pureObj.receive({ intentionId: 'INT_ORDER', pulses });
        addLog(`✅ RIGHT: Sent order (${dish})`);
      };

      const reflectRight = () => {
        pureObj.reflect((intention) => {
          setRightOutput(intention.pulses);
          setAggregated(intention.pulses);
          addLog(`✅ Object mapped pulses (values unchanged)`);
        }, aggregated);
      };

      const renderPulses = (pulses, highlight = []) => {
        return Object.entries(pulses).map(([key, value]) => (
          <div 
            key={key} 
            className="pulse-box"
            style={{
              borderColor: highlight.includes(key) ? '#4CAF50' : '#2196F3',
              backgroundColor: highlight.includes(key) ? '#e8f5e9' : 'white'
            }}
          >
            <span className="pulse-name">{key}:</span>
            <span className="pulse-value">{value}</span>
          </div>
        ));
      };

      return (
        <div>
          <h1>🪞 Exercise 4.2: Pure Pulse Mapping</h1>
          
          <div className="concept-box">
            <strong>⚠️ Critical Rule:</strong> Objects map <strong>PULSES to PULSES</strong>, NOT values to values!
            <ul>
              <li>✅ Original pulses remain <strong>immutable</strong></li>
              <li>✅ Create <strong>new pulse names</strong> with same values</li>
              <li>❌ NEVER change pulse response values</li>
              <li>❌ Value transformation = computation (belongs in DN)</li>
            </ul>
          </div>

          <div className="tab-buttons">
            <button 
              className={`tab-button wrong ${activeTab === 'wrong' ? 'active' : ''}`}
              onClick={() => setActiveTab('wrong')}
            >
              ❌ WRONG: Value Transformation
            </button>
            <button 
              className={`tab-button right ${activeTab === 'right' ? 'active' : ''}`}
              onClick={() => setActiveTab('right')}
            >
              ✅ RIGHT: Pulse-to-Pulse Mapping
            </button>
          </div>

          {activeTab === 'wrong' && (
            <div className="example-box wrong">
              <h2>❌ Anti-Pattern: Object Changes Pulse Values</h2>
              <p><strong>Why this is wrong:</strong> Object transforms "Pasta" → "Fideos". This is computation!</p>

              <div className="section kitchen">
                <h3>Kitchen (Input)</h3>
                <button onClick={() => sendOrderWrong('Pasta', 'Alice', 3)}>
                  Send Pasta Order
                </button>
                <button onClick={() => sendOrderWrong('Salad', 'Bob', 3)}>
                  Send Salad Order
                </button>
                
                {Object.keys(wrongInput).length > 0 && (
                  <div style={{marginTop: '15px'}}>
                    <strong>Input Pulses:</strong>
                    {renderPulses(wrongInput)}
                  </div>
                )}
              </div>

              <div className="section window">
                <h3>Object (Transforms Values)</h3>
                <button onClick={reflectWrong} disabled={impureObj.getState().heldCount === 0}>
                  🔄 Transform & Reflect
                </button>
                <div style={{color: '#f44336', marginTop: '10px', fontWeight: 'bold'}}>
                  ⚠️ This Object CHANGES the value!
                </div>
              </div>

              <div className="section server">
                <h3>Server (Output)</h3>
                {Object.keys(wrongOutput).length > 0 ? (
                  <div>
                    <strong>Output Pulses:</strong>
                    {renderPulses(wrongOutput)}
                    <div style={{
                      background: '#ffebee',
                      padding: '15px',
                      borderRadius: '4px',
                      marginTop: '15px',
                      border: '2px solid #f44336'
                    }}>
                      <strong style={{color: '#f44336'}}>❌ Problem:</strong>
                      <ul>
                        <li>Value CHANGED: "Pasta" became "Fideos"</li>
                        <li>Original pulse value LOST</li>
                        <li>Object performed COMPUTATION (lookup)</li>
                        <li>Breaks immutability principle</li>
                        <li>Where does it stop? Format dates? Calculate totals?</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#666'}}>Waiting for reflection...</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'right' && (
            <div className="example-box right">
              <h2>✅ Correct Pattern: Object Maps Pulse Names Only</h2>
              <p><strong>Why this is right:</strong> Object creates NEW pulses with SAME values. Immutable!</p>

              <div className="section kitchen">
                <h3>Kitchen (Input)</h3>
                <button onClick={() => sendOrderRight('Pasta', 'Alice', 3)}>
                  Send Pasta Order
                </button>
                <button onClick={() => sendOrderRight('Salad', 'Bob', 3)}>
                  Send Salad Order
                </button>
                <button onClick={() => sendOrderRight('Burger', 'Carol', 5)}>
                  Send Burger Order
                </button>
                
                {Object.keys(rightInput).length > 0 && (
                  <div style={{marginTop: '15px'}}>
                    <strong>Input Pulses:</strong>
                    {renderPulses(rightInput)}
                  </div>
                )}
              </div>

              <div className="section window">
                <h3>Object (Maps Pulses)</h3>
                <button onClick={reflectRight} disabled={pureObj.getState().heldCount === 0}>
                  🔄 Map Pulses & Reflect
                </button>
                <div style={{
                  background: '#e8f5e9',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px',
                  border: '2px solid #4CAF50'
                }}>
                  <strong style={{color: '#4CAF50'}}>✅ Pure Operations:</strong>
                  <ol style={{margin: '10px 0', paddingLeft: '20px'}}>
                    <li>COPY: item_dish → table_dish</li>
                    <li>COPY: customer_name → table_customer</li>
                    <li>COPY: table_num → table_number</li>
                    <li>AGGREGATE: Append to table_N_orders (CSV)</li>
                  </ol>
                </div>
              </div>

              <div className="section server">
                <h3>Server (Output)</h3>
                {Object.keys(rightOutput).length > 0 ? (
                  <div>
                    <strong>Output Pulses:</strong>
                    {renderPulses(rightOutput, ['table_dish', 'table_customer', 'table_number'])}
                    <div style={{
                      background: '#e8f5e9',
                      padding: '15px',
                      borderRadius: '4px',
                      marginTop: '15px',
                      border: '2px solid #4CAF50'
                    }}>
                      <strong style={{color: '#4CAF50'}}>✅ Correct:</strong>
                      <ul>
                        <li>ALL original pulses still present (immutable)</li>
                        <li>NEW pulses created (highlighted in green)</li>
                        <li>Values UNCHANGED: "Pasta" is still "Pasta"</li>
                        <li>Object did NO computation</li>
                        <li>Aggregated orders in CSV format (simple append)</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p style={{color: '#666'}}>Waiting for reflection...</p>
                )}
              </div>
            </div>
          )}

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
              {log.length === 0 ? (
                <div style={{color: '#999'}}>No events yet...</div>
              ) : (
                log.map((entry, idx) => (
                  <div key={idx}>{entry}</div>
                ))
              )}
            </div>
            <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
              💡 Open browser console (F12) to see detailed operation logs
            </p>
          </div>
        </div>
      );
    }

    ReactDOM.render(<ComparisonDemo />, document.getElementById('root'));
  </script>
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exercise 4.2: Pure Transformations</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      max-width: 900px; 
      margin: 50px auto;
      padding: 20px;
    }
    .section {
      border: 2px solid #ddd;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .customer { background-color: #e8f5e9; }
    .translation { background-color: #fff3e0; }
    .kitchen { background-color: #e3f2fd; }
    
    .pulse-box {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #2196F3;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    
    .pulse-label {
      font-weight: bold;
      color: #1976D2;
      margin-bottom: 5px;
    }
    
    .pulse-value {
      color: #333;
      padding: 5px;
      background: #f5f5f5;
      border-radius: 3px;
      display: inline-block;
    }
    
    .arrow {
      text-align: center;
      font-size: 24px;
      color: #666;
      margin: 10px 0;
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
    
    .concept-box {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
    }
    
    .operation-type {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
    }
    .op-copy { background-color: #4CAF50; color: white; }
    .op-map { background-color: #2196F3; color: white; }
    .op-combine { background-color: #9C27B0; color: white; }
    
    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }
    
    .comparison-item {
      padding: 15px;
      border-radius: 8px;
    }
    .comparison-item.good { background-color: #e8f5e9; border: 2px solid #4CAF50; }
    .comparison-item.bad { background-color: #ffebee; border: 2px solid #f44336; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    // 🔧 STEP 1: Define Pure PnR Operations
    class PnROperations {
      // COPY: Duplicate a pulse value to another pulse
      static copy(inputPulses, fromPulse, toPulse) {
        return {
          ...inputPulses,
          [toPulse]: inputPulses[fromPulse]
        };
      }

      // MAP: Transform a pulse value using a lookup table
      static map(inputPulses, pulseName, mappingTable) {
        const currentValue = inputPulses[pulseName];
        const mappedValue = mappingTable[currentValue] || currentValue;
        
        return {
          ...inputPulses,
          [pulseName]: mappedValue
        };
      }

      // COMBINE: Merge multiple pulse values into one
      static combine(inputPulses, sourcePulses, targetPulse, separator = ' ') {
        const values = sourcePulses.map(p => inputPulses[p]).filter(v => v);
        const combined = values.join(separator);
        
        return {
          ...inputPulses,
          [targetPulse]: combined
        };
      }

      // FILTER: Keep only specified pulses
      static filter(inputPulses, keepPulses) {
        const filtered = {};
        keepPulses.forEach(pulseName => {
          if (inputPulses[pulseName] !== undefined) {
            filtered[pulseName] = inputPulses[pulseName];
          }
        });
        return filtered;
      }
    }

    // 🔧 STEP 2: Translation Object (Pure Reflector)
    class TranslationWindow {
      constructor() {
        this.heldIntentions = [];
        
        // Translation mapping (data, not computation!)
        this.dishTranslations = {
          'Pasta': 'Fideos',
          'Salad': 'Ensalada',
          'Burger': 'Hamburguesa',
          'Pizza': 'Pizza', // Same in both languages
          'Soup': 'Sopa'
        };
      }

      receive(intention) {
        console.log('📥 Translation Window received:', intention);
        this.heldIntentions.push({
          ...intention,
          receivedAt: new Date().toLocaleTimeString()
        });
      }

      checkGatekeeper() {
        // Simple gatekeeper: has at least one intention
        return this.heldIntentions.length > 0;
      }

      // PURE TRANSFORMATION - No computation, just PnR operations
      transform(pulses) {
        let transformed = { ...pulses };
        
        console.log('🔄 Starting transformation...');
        console.log('   Input pulses:', transformed);

        // Operation 1: COPY customer_name to order_name
        transformed = PnROperations.copy(
          transformed, 
          'customer_name', 
          'order_name'
        );
        console.log('   After COPY:', transformed);

        // Operation 2: MAP dish_english to dish_spanish
        transformed = PnROperations.map(
          transformed,
          'dish_name',
          this.dishTranslations
        );
        console.log('   After MAP:', transformed);

        // Operation 3: COMBINE order info
        transformed = PnROperations.combine(
          transformed,
          ['order_name', 'dish_name', 'table_number'],
          'order_summary',
          ' - '
        );
        console.log('   After COMBINE:', transformed);

        console.log('✅ Transformation complete');
        return transformed;
      }

      reflect(onReflected) {
        if (!this.checkGatekeeper()) {
          console.log('⏳ Gatekeeper blocked (no intentions)');
          return null;
        }

        const intention = this.heldIntentions[0];
        
        // Apply PURE transformations
        const transformedPulses = this.transform(intention.pulses);

        // Clear held intentions
        this.heldIntentions = [];

        // Reflect with transformed pulses
        if (onReflected) {
          onReflected({
            ...intention,
            pulses: transformedPulses
          });
        }

        return transformedPulses;
      }

      getState() {
        return {
          heldCount: this.heldIntentions.length,
          intentions: [...this.heldIntentions]
        };
      }
    }

    // 🔧 STEP 3: Build the UI
    function TranslationSystem() {
      const [translationWindow] = useState(() => new TranslationWindow());
      const [windowState, setWindowState] = useState({ heldCount: 0, intentions: [] });
      const [inputPulses, setInputPulses] = useState({});
      const [outputPulses, setOutputPulses] = useState({});
      const [log, setLog] = useState([]);

      const addLog = (message) => {
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
      };

      // Customer places order
      const placeOrder = (customerName, dishName, tableNumber) => {
        const pulses = {
          customer_name: customerName,
          dish_name: dishName,
          table_number: String(tableNumber)
        };

        const intention = {
          intentionId: 'INT_CUSTOMER_ORDER',
          pulses
        };

        setInputPulses(pulses);
        translationWindow.receive(intention);
        setWindowState(translationWindow.getState());
        addLog(`Customer ${customerName} ordered ${dishName} (Table ${tableNumber})`);
      };

      // Reflect with transformation
      const doReflect = () => {
        const result = translationWindow.reflect((transformedIntention) => {
          setOutputPulses(transformedIntention.pulses);
          addLog(`✨ Order reflected to kitchen (transformed)`);
        });

        if (result) {
          setWindowState(translationWindow.getState());
        } else {
          addLog('🚪 Gatekeeper blocked - no orders to reflect');
        }
      };

      return (
        <div>
          <h1>🌐 Exercise 4.2: Pure Transformations</h1>
          
          <div className="concept-box">
            <strong>Key Concept:</strong> Objects perform <strong>pure transformations</strong>:
            <ul>
              <li>✅ COPY pulse values</li>
              <li>✅ MAP values using lookup tables</li>
              <li>✅ COMBINE multiple pulses</li>
              <li>✅ FILTER pulse subsets</li>
              <li>❌ NO computation (no math, no business logic)</li>
            </ul>
          </div>

          {/* Customer Section */}
          <div className="section customer">
            <h2>👤 Customer (sends order)</h2>
            <button onClick={() => placeOrder('Alice', 'Pasta', 3)}>
              Alice orders Pasta (Table 3)
            </button>
            <button onClick={() => placeOrder('Bob', 'Salad', 5)}>
              Bob orders Salad (Table 5)
            </button>
            <button onClick={() => placeOrder('Carol', 'Burger', 7)}>
              Carol orders Burger (Table 7)
            </button>

            {Object.keys(inputPulses).length > 0 && (
              <div style={{marginTop: '20px'}}>
                <strong>Order Pulses (English):</strong>
                {Object.entries(inputPulses).map(([key, value]) => (
                  <div key={key} className="pulse-box">
                    <div className="pulse-label">{key}:</div>
                    <div className="pulse-value">{value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Translation Window (Object) */}
          <div className="section translation">
            <h2>🌐 Translation Window (Object)</h2>
            <p><strong>Held Intentions:</strong> {windowState.heldCount}</p>

            {windowState.heldCount > 0 && (
              <div style={{marginTop: '15px'}}>
                <strong>🔄 Will Apply Transformations:</strong>
                <ol>
                  <li>
                    <strong>COPY</strong> 
                    <span className="operation-type op-copy">COPY</span>
                    <br/>
                    <code>customer_name → order_name</code>
                  </li>
                  <li>
                    <strong>MAP</strong> 
                    <span className="operation-type op-map">MAP</span>
                    <br/>
                    <code>dish_name (English → Spanish)</code>
                  </li>
                  <li>
                    <strong>COMBINE</strong> 
                    <span className="operation-type op-combine">COMBINE</span>
                    <br/>
                    <code>order_name + dish_name + table_number → order_summary</code>
                  </li>
                </ol>
              </div>
            )}

            <button 
              onClick={doReflect}
              disabled={windowState.heldCount === 0}
            >
              ✨ Transform & Reflect to Kitchen
            </button>
          </div>

          {/* Kitchen Section */}
          <div className="section kitchen">
            <h2>🍳 Kitchen (receives transformed order)</h2>
            
            {Object.keys(outputPulses).length === 0 ? (
              <p style={{color: '#666'}}>Waiting for orders...</p>
            ) : (
              <div>
                <strong>Received Pulses (Spanish):</strong>
                {Object.entries(outputPulses).map(([key, value]) => (
                  <div key={key} className="pulse-box">
                    <div className="pulse-label">{key}:</div>
                    <div className="pulse-value">{value}</div>
                  </div>
                ))}
              </div>
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
              {log.length === 0 ? (
                <div style={{color: '#999'}}>No events yet...</div>
              ) : (
                log.map((entry, idx) => (
                  <div key={idx}>{entry}</div>
                ))
              )}
            </div>
            <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
              💡 Open browser console (F12) to see detailed transformation steps
            </p>
          </div>
        </div>
      );
    }

    ReactDOM.render(<TranslationSystem />, document.getElementById('root'));
  </script>
</body>
</html>
```

---

## 📝 Step-by-Step Instructions

### **Step 1: See the WRONG Approach First**

1. Open the HTML file in your browser
2. Click the **"❌ WRONG: Value Transformation"** tab
3. Open browser console (F12) to see logs
4. Click **"Send Pasta Order"**
5. **Observe**: Input shows `dish_name: "Pasta"`
6. Click **"Transform & Reflect"**
7. **Check console**: See transformation happening
8. **Observe**: Output shows `dish_name: "Fideos"`

**What happened?** 
- Object **CHANGED** the pulse value
- "Pasta" became "Fideos"
- Original value is LOST
- This is **value transformation** (breaks purity!)

**Why is this wrong?**
- Object performed computation (dictionary lookup)
- Pulse values are supposed to be immutable
- Opens door to: `toLowerCase()`, `formatDate()`, `calculate()`, etc.
- No clear line between "allowed transformations" and "computation"

---

### **Step 2: See the RIGHT Approach**

1. Click the **"✅ RIGHT: Pulse-to-Pulse Mapping"** tab
2. Click **"Send Pasta Order"**
3. **Observe**: Input shows:
   ```
   item_dish: "Pasta"
   customer_name: "Alice"
   table_num: "3"
   ```
4. Click **"Map Pulses & Reflect"**
5. **Check console**: See pure operations
6. **Observe**: Output shows:
   ```
   item_dish: "Pasta"           [original - unchanged]
   customer_name: "Alice"       [original - unchanged]
   table_num: "3"              [original - unchanged]
   table_dish: "Pasta"         [NEW - copied from item_dish]
   table_customer: "Alice"     [NEW - copied from customer_name]
   table_number: "3"           [NEW - copied from table_num]
   table_3_orders: "Pasta,Alice" [NEW - aggregated CSV]
   ```

**What happened?**
- Object created NEW pulses
- Original pulses still present (immutable!)
- All values UNCHANGED
- This is **pulse-to-pulse mapping** (pure!)

**Key difference**: 
- ❌ Wrong: Changed `dish_name` value from "Pasta" to "Fideos"
- ✅ Right: Created `table_dish` pulse with value "Pasta" (same as original)

---

### **Step 3: See Aggregation (CSV Append)**

1. Stay on the RIGHT tab
2. Click **"Send Pasta Order"** (Alice, Table 3)
3. Click **"Map Pulses & Reflect"**
4. **Observe**: `table_3_orders: "Pasta,Alice"`
5. Click **"Send Salad Order"** (Bob, Table 3)
6. Click **"Map Pulses & Reflect"**
7. **Observe**: `table_3_orders: "Pasta,Alice\nSalad,Bob"`

**What happened?**
- Object APPENDED to existing pulse value
- Simple string concatenation (CSV format)
- No parsing, no computation
- Just: `existing + "\n" + new_line`

**This is pure!** Object treats values as opaque strings, doesn't interpret them.

---

### **Step 4: Multiple Tables**

1. Send Pasta to Table 3
2. Send Burger to Table 5
3. Reflect both
4. **Observe**:
   ```
   table_3_orders: "Pasta,Alice"
   table_5_orders: "Burger,Carol"
   ```

**Key insight**: Object aggregates by table number (pulse name changes), not by parsing values!

---

## ✅ Check Your Understanding

After completing the exercise, you should be able to:

- [ ] Explain the difference between "pulse mapping" and "value transformation"
- [ ] Identify why changing pulse values breaks CPUX purity
- [ ] Understand why Objects should NEVER modify pulse response values
- [ ] Describe what "pulse-to-pulse" mapping means
- [ ] Explain why CSV aggregation (string append) is pure

**Test yourself**: 

**Q1**: Can an Object change "Pasta" to "Fideos"?  
**A**: ❌ NO! That's value transformation. Object would need a translation lookup table = computation.

**Q2**: Can an Object create a new pulse `kitchen_dish` with the same value as `customer_dish`?  
**A**: ✅ YES! That's pulse-to-pulse COPY. Value unchanged, just new pulse name.

**Q3**: Can an Object append "Salad,Bob" to existing CSV "Pasta,Alice"?  
**A**: ✅ YES! That's simple string concatenation. Object treats it as opaque string (no parsing).

**Q4**: Can an Object map "large" → "L"?  
**A**: ❌ NO! That's value transformation. If you allow this, where do you stop? `toLowerCase()`? `formatDate()`?

**Critical Rule**: If an Object needs to understand or interpret pulse values, it's doing computation (belongs in DN).

---

## 🎯 What Did We Learn?

### **The Fundamental Rule**

**Objects map PULSES, not VALUES.**

```javascript
// ✅ RIGHT: Pulse-to-pulse
original_pulse: ["value", "Y"]
      ↓ Object copies pulse
new_pulse: ["value", "Y"]  // Same value, new name

// ❌ WRONG: Value transformation  
pulse: ["old_value", "Y"]
      ↓ Object changes value
pulse: ["new_value", "Y"]  // Value changed!
```

### **Pure Operations Objects CAN Do**

| Operation | Description | Example |
|-----------|-------------|---------|
| **COPY** | Duplicate pulse with same value | `dish → table_dish` |
| **FILTER** | Select pulse subset | Keep `[A, C]` from `[A, B, C]` |
| **AGGREGATE** | Append pulse values (CSV) | `"A" + "\n" + "B"` |
| **RENAME** | Pulse name change only | `old_name → new_name` |

### **What Objects CANNOT Do**

| ❌ Forbidden | Why | Belongs In |
|-------------|-----|------------|
| Transform values | `"Pasta" → "Fideos"` | Design Node |
| Calculate | `price * quantity` | Design Node |
| Format | `toLowerCase()`, `trim()` | Design Node |
| Parse | Interpret CSV, JSON | Design Node |
| Validate | Check business rules | Design Node |
| Query | Database lookup | Design Node |

### **Key Insight: Immutability**

```javascript
// After Object reflection:
Input:  {dish: "Pasta"}
Output: {
  dish: "Pasta",           // ✅ Original unchanged
  table_dish: "Pasta"      // ✅ New pulse, same value
}

// NOT this:
Output: {
  dish: "Fideos"           // ❌ Original modified!
}
```

---

## 💡 Key Takeaways

### 🔑 **Why Pulse Immutability Matters**

1. **Traceability**
   - Can always see original values
   - No "lost" data in transformations
   - Complete audit trail

2. **Predictability**
   - Same input always produces same mapping
   - No hidden state changes
   - Easy to reason about

3. **Enforceable Purity**
   ```javascript
   // Easy rule: Check if pulse value changed
   if (output.pulse.value !== input.pulse.value) {
     throw new Error('Object changed value - breaks purity!');
   }
   ```

4. **Clear Boundary**
   - Objects: Pulse structure manipulation
   - Design Nodes: Value computation
   - No overlap, no confusion

### 🚨 **The Slippery Slope**

Once you allow value transformation in Objects:

```javascript
// First: "This seems harmless..."
"Pasta" → "Fideos"  // Translation lookup

// Then: "This is similar..."
"large" → "L"  // Size code mapping

// Then: "Just formatting..."
"alice" → "Alice"  // Capitalize

// Then: "Small calculation..."
"2" → "2.00"  // Format decimal

// Finally: "Where's the line?"
price * quantity  // Full computation!
```

**Solution**: Ban ALL value transformation. Only pulse-to-pulse mapping.

---

## 🎨 Visual Summary

```
Input Pulses
┌──────────────────────────┐
│ item_dish: "Pasta"       │
│ customer_name: "Alice"   │
│ table_num: "3"           │
└──────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│   Delivery Window (Object)           │
├──────────────────────────────────────┤
│  COPY: item_dish → table_dish        │
│  COPY: customer_name → table_customer│
│  COPY: table_num → table_number      │
│  AGGREGATE: Append to table_3_orders │
│                                      │
│  ✅ No value changes!                │
│  ✅ Only pulse name changes!         │
└──────────────────────────────────────┘
           │
           ↓
Output Pulses
┌──────────────────────────────────────┐
│ item_dish: "Pasta"        [ORIGINAL] │
│ customer_name: "Alice"    [ORIGINAL] │
│ table_num: "3"            [ORIGINAL] │
│ table_dish: "Pasta"       [NEW]      │
│ table_customer: "Alice"   [NEW]      │
│ table_number: "3"         [NEW]      │
│ table_3_orders: "Pasta,Alice" [NEW]  │
└──────────────────────────────────────┘

🔑 Key: ALL original pulses preserved!
       Values UNCHANGED!
```

---

## 🚨 Critical Distinction: What Objects CANNOT Do

<div class="comparison">
  <div class="comparison-item bad">
    <h3>❌ NOT Pure (Don't Do in Objects)</h3>
    <ul>
      <li>Calculate: <code>price * quantity * tax</code></li>
      <li>Validate: <code>if (age < 18) reject</code></li>
      <li>Generate: <code>Math.random()</code></li>
      <li>Query database</li>
      <li>Call external APIs</li>
      <li>Apply business rules</li>
    </ul>
    <strong>These belong in Design Nodes!</strong>
  </div>

  <div class="comparison-item good">
    <h3>✅ Pure (Objects Do This)</h3>
    <ul>
      <li>Copy: <code>a → b</code></li>
      <li>Map: <code>"USD" → "$"</code></li>
      <li>Combine: <code>first + last</code></li>
      <li>Filter: <code>keep only [a, c]</code></li>
      <li>Rename: <code>old_name → new_name</code></li>
      <li>Format: <code>lowercase(text)</code></li>
    </ul>
    <strong>Data reshaping only!</strong>
  </div>
</div>

---

## 🔗 Connection to CPUX Purity

From the CPUX documentation:

> "Objects are reflectors, not processors. They perform pure PnR operations—set manipulations with no explicit computation."

**This means**:
- Objects reshape data flowing between Design Nodes
- They don't make business decisions
- They enable communication without adding logic
- They maintain system traceability

---

## 🧪 Try This Challenge

**Scenario**: A customer orders 2 Pastas. The order needs:
1. Copy customer name
2. Map dish name to Spanish
3. Combine into order summary

**Which should Object do? Which should Design Node do?**

1. ✅ Copy `customer_name` → `order_name` (Object: COPY)
2. ✅ Map "Pasta" → "Fideos" (Object: MAP)
3. ❌ Calculate total: `2 × price` (Design Node: computation!)
4. ✅ Combine into summary string (Object: COMBINE)
5. ❌ Check if quantity available (Design Node: business logic!)

**Rule**: If it changes based on business rules, it's a Design Node. If it's just data reshaping, it's an Object.

---

## ➡️ Next Exercise

**Exercise 4.3: Multiple Gatekeeper Conditions**

Now that you understand pure transformations, we'll explore:
- Complex gatekeeper conditions (AND, OR)
- Conditional transformations based on pulse values
- When to transform vs when to block

**Preview**: What if we only translate orders above $10? How do we express that condition?

---

## 🤔 Think About It

Before moving on, consider:

1. Why is it important that Objects don't compute?
2. What would happen if Objects contained business logic?
3. How does purity make the system more traceable?

**Hint**: Think about debugging a system where data transformation and business logic are mixed together...

---

**Excellent work!** 🎉 You now understand the critical distinction between pure transformation (Objects) and computation (Design Nodes). This separation is fundamental to CPUX architecture.