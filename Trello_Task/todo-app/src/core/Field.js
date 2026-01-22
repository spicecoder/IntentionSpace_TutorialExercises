class Field {
  constructor() {
    this.pulses = new Map();
    this.intentions = new Set();
    this.subscribers = new Map();
    this.debug = true;
  }

  addIntention(intentionId, pulseData) {
    this.intentions.add(intentionId);

    Object.entries(pulseData).forEach(([name, value]) => {
      this.setPulseValue(name, value);
    });

    if (this.debug) {
      console.log('[Field] addIntention:', intentionId, pulseData);
    }

    this.notifySubscribers();
  }

  setPulseValue(name, value) {
    this.pulses.set(name, {
      name,
      value,
      trivalence: 'Y',
      timestamp: Date.now()
    });
  }

  getPulseValue(name) {
    return this.pulses.get(name)?.value;
  }

  hasPulse(name) {
    return this.pulses.has(name);
  }

  hasIntention(id) {
    return this.intentions.has(id);
  }

  subscribe(pulseName, callback) {
    if (!this.subscribers.has(pulseName)) {
      this.subscribers.set(pulseName, new Set());
    }
    this.subscribers.get(pulseName).add(callback);

    return () => {
      this.subscribers.get(pulseName)?.delete(callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach((callbacks, pulseName) => {
      const pulse = this.pulses.get(pulseName);
      callbacks.forEach(cb => cb(pulse?.value));
    });
  }
}

export default Field;
