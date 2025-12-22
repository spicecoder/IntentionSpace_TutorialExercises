# Exercise Verification Strategy for colab.kitchen Developers

**Context**: Transitioning 3 colab.kitchen developers to Pulse/CPUX thinking  
**Goal**: Build toward capstone project with real colab.kitchen pulses  
**Method**: Automated testing with immediate feedback

---

## 🎯 Learning Path Overview

```
Foundation Exercises (1.1 - 6.3)
          ↓
Capstone Project: colab.kitchen Pulses
          ↓
- "Select dish to view details"
- "Create order with selected dishes"
- "Search dishes by criteria"
- "Add dish to shopping basket"
- etc.
```

---

## 📁 Repository Structure

```
intention-tunnel-exercises/
│
├── package.json                    # npm scripts for testing
├── README.md                       # Course overview
│
├── helpers/
│   ├── pulse-helpers.js           # Shared helper functions
│   └── test-utils.js              # Testing utilities
│
├── exercises/
│   ├── 1.1-what-is-a-pulse/
│   │   ├── README.md              # Instructions (always visible)
│   │   ├── starter.js             # Template with TODOs
│   │   ├── solution.js            # Reference solution
│   │   └── verify.test.js         # Automated tests
│   │
│   ├── 1.2-pulses-change-over-time/
│   │   ├── README.md
│   │   ├── starter.js
│   │   ├── solution.js
│   │   └── verify.test.js
│   │
│   └── [... all 21 exercises ...]
│
├── capstone/
│   ├── README.md                  # Capstone project guide
│   ├── colab-kitchen-pulses.md    # Domain-specific pulse definitions
│   ├── starter-templates/         # Templates for each pulse
│   │   ├── select-dish.js
│   │   ├── create-order.js
│   │   ├── search-dishes.js
│   │   └── add-to-basket.js
│   └── verify-capstone.test.js    # Capstone tests
│
└── developer-workspace/
    ├── developer-1/                # Each dev has their own space
    │   ├── exercises/
    │   │   ├── exercise-1.1.js
    │   │   ├── exercise-1.2.js
    │   │   └── ...
    │   └── capstone/
    │       ├── select-dish.js
    │       ├── create-order.js
    │       └── ...
    │
    ├── developer-2/
    └── developer-3/
```

---

## 🚀 Setup Instructions

### Initial Setup (One-time)

```bash
# Clone repository
git clone https://github.com/your-org/intention-tunnel-exercises.git
cd intention-tunnel-exercises

# Install dependencies
npm install

# Create your workspace
mkdir -p developer-workspace/your-name/exercises
mkdir -p developer-workspace/your-name/capstone
```

---

## 📝 Exercise Workflow

### Step 1: Start an Exercise

```bash
# Navigate to exercise
cd exercises/1.1-what-is-a-pulse

# Read instructions
cat README.md

# Copy starter to your workspace
cp starter.js ../../developer-workspace/your-name/exercises/exercise-1.1.js
```

### Step 2: Complete the Exercise

Edit `developer-workspace/your-name/exercises/exercise-1.1.js` and fill in the TODOs:

```javascript
// 🔧 TODO: Create a pulse for a door lock
const doorLock = {
  prompt: "door_lock_state",     // ✅ Completed
  responses: ["locked"],          // ✅ Completed
  trivalence: "Y"                 // ✅ Completed
};
```

### Step 3: Verify Your Work

```bash
# Run verification for your exercise
npm test -- exercise-1.1 your-name

# Output:
# ✅ Test 1: Door lock pulse exists
# ✅ Test 2: Door lock has correct structure
# ✅ Test 3: Door lock trivalence is correct
# ✅ All tests passed! (3/3)
```

### Step 4: Get Feedback If Failing

```bash
# If tests fail, you get helpful feedback:
# ❌ Test 2: Door lock has correct structure
#    Expected: prompt to be "door_lock_state"
#    Got: "door_lock"
#    Hint: Check the prompt name - should describe state, not just object
```

---

## 🧪 Test Commands

### Run Single Exercise
```bash
npm test -- exercise-1.1 your-name
```

### Run All Your Exercises
```bash
npm test your-name
```

### Run Specific Level (e.g., Level 1)
```bash
npm test -- level-1 your-name
```

### Check Progress
```bash
npm run progress your-name
# Output:
# Progress for developer-1:
# ✅ Exercise 1.1 (3/3 tests)
# ✅ Exercise 1.2 (4/4 tests)
# ⏳ Exercise 1.3 (0/5 tests)
# ⏳ Exercise 2.1 (not started)
# ...
# Total: 2/21 exercises complete (9%)
```

### View Reference Solution (After Attempting)
```bash
npm run solution exercise-1.1
# This only works if you've attempted the exercise
# (prevents looking at solution without trying first)
```

---

## 📊 Test Structure Example

Each `verify.test.js` checks:
1. ✅ **Code runs** without errors
2. ✅ **Output is correct** (basic validation)
3. ✅ **Provides feedback** if something is wrong

**Example: `exercises/1.1-what-is-a-pulse/verify.test.js`**

```javascript
const { describe, test, expect } = require('@jest/globals');
const path = require('path');

// Import helpers
const { isSimplePulse, isStructuredPulse, getSimpleValue, getFieldValue } = 
  require('../../helpers/pulse-helpers');

describe('Exercise 1.1: What is a Pulse?', () => {
  
  test('should create door lock pulse correctly', () => {
    // Load learner's solution
    const developerName = process.env.DEVELOPER_NAME || 'developer-1';
    const solutionPath = path.join(
      __dirname, 
      '../../developer-workspace',
      developerName,
      'exercises/exercise-1.1.js'
    );
    
    let doorLock;
    try {
      const solution = require(solutionPath);
      doorLock = solution.doorLock;
    } catch (err) {
      throw new Error(
        `❌ Could not load your solution file.\n` +
        `   Expected at: ${solutionPath}\n` +
        `   Make sure you copied starter.js to your workspace!`
      );
    }
    
    // Test 1: Pulse exists
    expect(doorLock).toBeDefined();
    console.log('✅ Test 1: Door lock pulse exists');
    
    // Test 2: Has correct structure
    expect(doorLock.prompt).toBe('door_lock_state');
    expect(doorLock.responses).toEqual(['locked']);
    expect(doorLock.trivalence).toBe('Y');
    console.log('✅ Test 2: Door lock has correct structure');
    
    // Test 3: Is a simple pulse
    expect(isSimplePulse(doorLock)).toBe(true);
    console.log('✅ Test 3: Door lock is correctly a simple pulse');
  });
  
  test('should create book info pulse correctly', () => {
    const developerName = process.env.DEVELOPER_NAME || 'developer-1';
    const solutionPath = path.join(
      __dirname, 
      '../../developer-workspace',
      developerName,
      'exercises/exercise-1.1.js'
    );
    
    const solution = require(solutionPath);
    const bookInfo = solution.bookInfo;
    
    expect(bookInfo).toBeDefined();
    console.log('✅ Test 1: Book info pulse exists');
    
    // Check structured pulse format
    expect(isStructuredPulse(bookInfo)).toBe(true);
    console.log('✅ Test 2: Book info is structured pulse');
    
    // Check META row
    expect(bookInfo.responses[0][0]).toBe('META');
    expect(bookInfo.responses[0]).toContain('title');
    expect(bookInfo.responses[0]).toContain('author');
    console.log('✅ Test 3: Book info has correct META row');
    
    // Check data row exists
    expect(bookInfo.responses[1]).toBeDefined();
    expect(bookInfo.responses[1].length).toBe(bookInfo.responses[0].length - 1);
    console.log('✅ Test 4: Book info has data row with correct field count');
    
    // Check can retrieve fields
    const title = getFieldValue(bookInfo, 'title');
    expect(title).toBeTruthy();
    console.log(`✅ Test 5: Can retrieve book title: "${title}"`);
  });
});
```

---

## 🎓 Capstone Project Structure

After completing foundation exercises, developers work on colab.kitchen pulses:

### Capstone Pulses

Each developer implements these pulses:

```javascript
// 1. Select Dish (view details)
const selectDishPulse = {
  prompt: "dish_selected_for_view",
  responses: [
    ["META", "dish_id", "name", "description", "price", "seller_id", "ingredients", "allergens"],
    ["d123", "Vegetable Biryani", "Aromatic rice...", "$12.99", "s456", "rice, vegetables", "none"]
  ],
  trivalence: "N"  // Read-only view
};

// 2. Create Order
const createOrderPulse = {
  prompt: "order_created",
  responses: [
    // Items section
    ["META", "dish_id", "dish_name", "quantity", "price"],
    ["d123", "Biryani", "2", "$12.99"],
    ["d124", "Curry", "1", "$9.99"],
    
    // Order metadata
    ["META", "order_id", "buyer_id", "total", "status"],
    ["o789", "u101", "$35.97", "pending"]
  ],
  trivalence: "Y"  // Can be modified before submission
};

// 3. Search Dishes
const searchCriteriaPulse = {
  prompt: "dish_search_criteria",
  responses: [
    ["META", "cuisine", "max_price", "dietary", "seller_location"],
    ["Indian", "15.00", "vegetarian", "Melbourne"]
  ],
  trivalence: "Y"  // User can edit search criteria
};

const searchResultsPulse = {
  prompt: "dish_search_results",
  responses: [
    ["META", "dish_id", "name", "price", "seller", "match_score"],
    ["d123", "Biryani", "$12.99", "Kumar's Kitchen", "0.95"],
    ["d125", "Dal Tadka", "$8.99", "Spice House", "0.87"],
    ["d127", "Paneer Tikka", "$14.50", "Curry Corner", "0.82"]
  ],
  trivalence: "N"  // Search results are read-only
};

// 4. Shopping Basket
const shoppingBasketPulse = {
  prompt: "shopping_basket_contents",
  responses: [
    ["META", "item_id", "dish_id", "dish_name", "quantity", "unit_price", "subtotal"],
    ["i1", "d123", "Biryani", "2", "$12.99", "$25.98"],
    ["i2", "d124", "Curry", "1", "$9.99", "$9.99"]
  ],
  trivalence: "Y"  // User can modify quantities
};
```

### Capstone Tests

```bash
# Test individual pulses
npm test -- capstone-select-dish your-name
npm test -- capstone-create-order your-name
npm test -- capstone-search-dishes your-name
npm test -- capstone-basket your-name

# Test all capstone work
npm test -- capstone your-name
```

---

## 📈 Progress Tracking

### Individual Progress
```bash
npm run progress your-name
```

### Team Progress
```bash
npm run progress --all

# Output:
# Team Progress:
# 
# developer-1: ████████░░░░░░░░░░░░ 8/21 (38%)
# developer-2: ███████████░░░░░░░░░ 11/21 (52%)
# developer-3: █████░░░░░░░░░░░░░░░ 5/21 (24%)
# 
# Capstone Progress:
# developer-1: ███░ 3/4 pulses complete
# developer-2: ████ 4/4 pulses complete ✅
# developer-3: ██░░ 2/4 pulses complete
```

---

## 🎯 Success Criteria

### Foundation Exercises
- All 21 exercises passing automated tests
- Time: ~1-2 weeks (1-2 hours per day)

### Capstone Project
- 4 core colab.kitchen pulses implemented:
  1. ✅ Select dish for viewing
  2. ✅ Create order with dishes
  3. ✅ Search dishes by criteria
  4. ✅ Add to shopping basket

- Demonstrates understanding:
  - Simple vs structured pulses
  - META row conventions
  - Trivalence usage (Y/N/UN)
  - Helper function usage
  - Business concept coherence

---

## 🤝 Collaboration

### Peer Review (Optional)
```bash
# Compare solutions with teammate
npm run compare exercise-1.1 developer-1 developer-2

# Output shows different approaches:
# developer-1: Used simple pulse
# developer-2: Used structured pulse with META row
# Both valid! ✅
```

### Team Discussion Topics
- Which pulses should be simple vs structured?
- How to organize order data (multiple META rows)?
- Naming conventions for prompts
- Trivalence choices for each pulse

---

## 📞 Getting Help

### Stuck on an exercise?
```bash
# Get a hint (doesn't reveal solution)
npm run hint exercise-1.1

# Output:
# 💡 Hint for Exercise 1.1:
# - Door locks have two states: locked/unlocked
# - Users can change a lock's state
# - Trivalence "Y" means editable by user
```

### Still stuck?
```bash
# View solution (after 3 failed attempts)
npm run solution exercise-1.1
```

### Technical issues?
- Check `exercises/[exercise]/README.md` for details
- Review `helpers/pulse-helpers.js` for function signatures
- Ask team members for help

---

## 🎉 Completion Certificate

When all exercises + capstone are complete:

```bash
npm run certificate your-name

# Generates:
# 🎓 CERTIFICATE OF COMPLETION
# 
# This certifies that [your-name] has successfully completed
# the Intention Tunnel training program, demonstrating mastery of:
# 
# ✅ Pulse fundamentals and structure
# ✅ Field-based state management
# ✅ Intention-driven communication
# ✅ Object reflection patterns
# ✅ Design Node processing
# ✅ Complete CPUX flows
# 
# Capstone Project: colab.kitchen Pulses
# ✅ Dish selection pulse
# ✅ Order creation pulse
# ✅ Search criteria pulse
# ✅ Shopping basket pulse
# 
# Date: [completion date]
# Exercises: 21/21 (100%)
# Capstone: 4/4 pulses (100%)
```

---

## 🔄 Next Steps After Completion

1. **Apply to colab.kitchen codebase**
   - Refactor existing components to use Pulses
   - Implement Intention Tunnel for state management
   - Use Field instead of Redux/Context

2. **Advanced topics** (if needed)
   - Design Node implementation
   - Object reflection patterns
   - CPUX flow optimization
   - GridLookout UI rendering

3. **Share knowledge**
   - Document patterns used in colab.kitchen
   - Create team conventions guide
   - Onboard new developers

---

## 📋 Summary

**What you'll do:**
1. Complete 21 foundation exercises (visible from start)
2. Run automated tests to verify your work
3. Build 4 colab.kitchen pulses for capstone
4. Get immediate feedback if tests fail
5. Track your progress and team progress

**What you'll learn:**
- Think in Pulses (not just state)
- Structure data with META rows
- Use helper functions effectively
- Apply CPUX concepts to real product (colab.kitchen)

**Estimated time:**
- Foundation: 1-2 weeks (1-2 hours/day)
- Capstone: 2-3 days
- Total: ~2-3 weeks

**Ready to start?**
```bash
npm run start your-name
# Creates your workspace and shows first exercise
```
