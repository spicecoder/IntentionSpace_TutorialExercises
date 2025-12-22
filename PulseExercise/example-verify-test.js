// verify.test.js for Exercise 1.1
// Tests learner's implementation of first pulse exercises

const { describe, test, expect } = require('@jest/globals');
const path = require('path');
const fs = require('fs');

// Import helpers
const { 
  isSimplePulse, 
  isStructuredPulse, 
  getSimpleValue, 
  getFieldValue,
  toObject,
  validatePulse
} = require('../../helpers/pulse-helpers');

describe('Exercise 1.1: What is a Pulse?', () => {
  
  let doorLock, bookInfo, developerName, solutionPath;
  
  beforeAll(() => {
    // Get developer name from environment or command line
    developerName = process.env.DEVELOPER_NAME || process.argv[2] || 'developer-1';
    
    solutionPath = path.join(
      __dirname, 
      '../../developer-workspace',
      developerName,
      'exercises/exercise-1.1.js'
    );
    
    // Check if solution file exists
    if (!fs.existsSync(solutionPath)) {
      throw new Error(
        `\n\n❌ Solution file not found!\n` +
        `   Expected at: ${solutionPath}\n\n` +
        `   Did you forget to copy the starter file?\n` +
        `   Run: cp exercises/1.1-what-is-a-pulse/starter.js ${solutionPath}\n\n`
      );
    }
    
    // Load learner's solution
    try {
      const solution = require(solutionPath);
      doorLock = solution.doorLock;
      bookInfo = solution.bookInfo;
    } catch (err) {
      throw new Error(
        `\n\n❌ Could not load your solution file.\n` +
        `   File: ${solutionPath}\n` +
        `   Error: ${err.message}\n\n` +
        `   Make sure your code doesn't have syntax errors!\n\n`
      );
    }
  });
  
  // ============================================================
  // TEST GROUP 1: Door Lock Pulse (Simple)
  // ============================================================
  
  describe('Task 1: Door Lock Pulse (Simple)', () => {
    
    test('should exist and be defined', () => {
      expect(doorLock).toBeDefined();
      console.log('  ✅ Door lock pulse exists');
    });
    
    test('should have a prompt', () => {
      expect(doorLock.prompt).toBeDefined();
      expect(typeof doorLock.prompt).toBe('string');
      expect(doorLock.prompt.length).toBeGreaterThan(0);
      console.log(`  ✅ Has prompt: "${doorLock.prompt}"`);
    });
    
    test('should have prompt "door_lock_state"', () => {
      if (doorLock.prompt !== 'door_lock_state') {
        console.log(`  ❌ Expected prompt: "door_lock_state"`);
        console.log(`     Got: "${doorLock.prompt}"`);
        console.log(`     💡 Hint: The prompt should describe the STATE of the door lock`);
      }
      expect(doorLock.prompt).toBe('door_lock_state');
      console.log('  ✅ Prompt is correct');
    });
    
    test('should have responses array', () => {
      expect(doorLock.responses).toBeDefined();
      expect(Array.isArray(doorLock.responses)).toBe(true);
      console.log('  ✅ Has responses array');
    });
    
    test('should have a response value', () => {
      expect(doorLock.responses.length).toBeGreaterThan(0);
      if (!['locked', 'unlocked'].includes(doorLock.responses[0])) {
        console.log(`  ⚠️  Response "${doorLock.responses[0]}" is valid, but "locked" or "unlocked" are more conventional`);
      }
      console.log(`  ✅ Has response: "${doorLock.responses[0]}"`);
    });
    
    test('should be a simple pulse (not structured)', () => {
      expect(isSimplePulse(doorLock)).toBe(true);
      if (!isSimplePulse(doorLock)) {
        console.log(`  ❌ Door lock should be a SIMPLE pulse`);
        console.log(`     💡 Hint: Simple pulse = responses: ["value"]`);
        console.log(`     Not: responses: [["META", ...], [...]]`);
      }
      console.log('  ✅ Is correctly a simple pulse');
    });
    
    test('should have trivalence', () => {
      expect(doorLock.trivalence).toBeDefined();
      expect(['Y', 'N', 'UN'].includes(doorLock.trivalence)).toBe(true);
      console.log(`  ✅ Has trivalence: "${doorLock.trivalence}"`);
    });
    
    test('should have trivalence "Y" (editable)', () => {
      if (doorLock.trivalence !== 'Y') {
        console.log(`  ❌ Expected trivalence: "Y" (user can lock/unlock door)`);
        console.log(`     Got: "${doorLock.trivalence}"`);
        console.log(`     💡 Hint: Users can change a door lock's state`);
      }
      expect(doorLock.trivalence).toBe('Y');
      console.log('  ✅ Trivalence is correct (editable)');
    });
    
    test('should be valid according to pulse validation', () => {
      const validation = validatePulse(doorLock);
      if (!validation.valid) {
        console.log(`  ❌ Pulse validation failed:`);
        validation.errors.forEach(err => console.log(`     - ${err}`));
      }
      expect(validation.valid).toBe(true);
      console.log('  ✅ Pulse structure is valid');
    });
    
  });
  
  // ============================================================
  // TEST GROUP 2: Book Info Pulse (Structured)
  // ============================================================
  
  describe('Task 2: Book Info Pulse (Structured)', () => {
    
    test('should exist and be defined', () => {
      expect(bookInfo).toBeDefined();
      console.log('  ✅ Book info pulse exists');
    });
    
    test('should have a prompt', () => {
      expect(bookInfo.prompt).toBeDefined();
      expect(typeof bookInfo.prompt).toBe('string');
      console.log(`  ✅ Has prompt: "${bookInfo.prompt}"`);
    });
    
    test('should have prompt "book_info"', () => {
      if (bookInfo.prompt !== 'book_info') {
        console.log(`  ⚠️  Expected prompt: "book_info"`);
        console.log(`     Got: "${bookInfo.prompt}"`);
        console.log(`     💡 Both are valid, but consistency helps!`);
      }
      expect(bookInfo.prompt).toBe('book_info');
      console.log('  ✅ Prompt is correct');
    });
    
    test('should be a structured pulse (not simple)', () => {
      expect(isStructuredPulse(bookInfo)).toBe(true);
      if (!isStructuredPulse(bookInfo)) {
        console.log(`  ❌ Book info should be a STRUCTURED pulse`);
        console.log(`     💡 Hint: Structured pulse = responses: [["META", ...], [...]]`);
        console.log(`     Not: responses: ["value"]`);
      }
      console.log('  ✅ Is correctly a structured pulse');
    });
    
    test('should have META row as first element', () => {
      expect(Array.isArray(bookInfo.responses[0])).toBe(true);
      expect(bookInfo.responses[0][0]).toBe('META');
      console.log('  ✅ Has META row');
    });
    
    test('should have required fields in META row', () => {
      const meta = bookInfo.responses[0];
      const requiredFields = ['title', 'author', 'year', 'price'];
      
      requiredFields.forEach(field => {
        if (!meta.includes(field)) {
          console.log(`  ❌ Missing field in META row: "${field}"`);
        }
        expect(meta.includes(field)).toBe(true);
      });
      
      console.log(`  ✅ META row has all required fields: ${requiredFields.join(', ')}`);
    });
    
    test('should have data row', () => {
      expect(bookInfo.responses[1]).toBeDefined();
      expect(Array.isArray(bookInfo.responses[1])).toBe(true);
      console.log('  ✅ Has data row');
    });
    
    test('should have correct number of data values', () => {
      const metaFieldCount = bookInfo.responses[0].length - 1; // -1 for "META"
      const dataValueCount = bookInfo.responses[1].length;
      
      if (metaFieldCount !== dataValueCount) {
        console.log(`  ❌ Field count mismatch:`);
        console.log(`     META row has ${metaFieldCount} fields`);
        console.log(`     Data row has ${dataValueCount} values`);
        console.log(`     💡 Hint: Each META field needs a corresponding data value`);
      }
      
      expect(dataValueCount).toBe(metaFieldCount);
      console.log(`  ✅ Data row has correct number of values (${dataValueCount})`);
    });
    
    test('should be able to retrieve field values', () => {
      const title = getFieldValue(bookInfo, 'title');
      const author = getFieldValue(bookInfo, 'author');
      
      expect(title).toBeTruthy();
      expect(author).toBeTruthy();
      
      console.log(`  ✅ Can retrieve title: "${title}"`);
      console.log(`  ✅ Can retrieve author: "${author}"`);
    });
    
    test('should convert to object correctly', () => {
      const obj = toObject(bookInfo);
      
      expect(obj).toBeDefined();
      expect(obj.title).toBeTruthy();
      expect(obj.author).toBeTruthy();
      expect(obj.year).toBeTruthy();
      expect(obj.price).toBeTruthy();
      
      console.log(`  ✅ Converts to object:`);
      console.log(`     ${JSON.stringify(obj, null, 2).split('\n').join('\n     ')}`);
    });
    
    test('should have trivalence "N" (read-only)', () => {
      if (bookInfo.trivalence !== 'N') {
        console.log(`  ⚠️  Expected trivalence: "N" (book info is read-only)`);
        console.log(`     Got: "${bookInfo.trivalence}"`);
        console.log(`     💡 Hint: Book information typically can't be edited by user`);
      }
      expect(bookInfo.trivalence).toBe('N');
      console.log('  ✅ Trivalence is correct (read-only)');
    });
    
    test('should be valid according to pulse validation', () => {
      const validation = validatePulse(bookInfo);
      if (!validation.valid) {
        console.log(`  ❌ Pulse validation failed:`);
        validation.errors.forEach(err => console.log(`     - ${err}`));
      }
      expect(validation.valid).toBe(true);
      console.log('  ✅ Pulse structure is valid');
    });
    
  });
  
  // ============================================================
  // SUMMARY
  // ============================================================
  
  afterAll(() => {
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXERCISE 1.1 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Developer: ${developerName}`);
    console.log(`File: ${solutionPath}`);
    console.log('');
    console.log('✅ All tests passed!');
    console.log('');
    console.log('What you learned:');
    console.log('  • Simple pulses: responses: ["value"]');
    console.log('  • Structured pulses: responses: [["META", ...], [...]]');
    console.log('  • Helper functions: isSimplePulse(), getFieldValue(), toObject()');
    console.log('  • Trivalence: Y (editable), N (read-only), UN (action)');
    console.log('');
    console.log('Next: Exercise 1.2 - Pulses Change Over Time');
    console.log('='.repeat(60) + '\n');
  });
  
});
