export default class Field {
  constructor() {
    // FPS
    this.pulses = new Map();

    // FIS
    this.intentions = new Set();

    // pulseName → Set(callback)
    this.subscribers = new Map();
  }

  //  Pulses 

  setPulseValue(name, value) {
    this.pulses.set(name, value);
    this.notifySubscribers(name);
  }

  getPulseValue(name) {
    return this.pulses.get(name);
  }

  hasPulse(name) {
    return this.pulses.has(name);
  }

  // Intentions 

  addIntention(intentionId, payload = {}) {
    this.intentions.add(intentionId);

    Object.entries(payload).forEach(([k, v]) => {
      this.setPulseValue(k, v);
    });
  }

  removeIntention(intentionId) {
    this.intentions.delete(intentionId);
  }

  hasIntention(intentionId) {
    return this.intentions.has(intentionId);
  }

  //Subscriptions 

  subscribe(pulseName, callback) {
    if (!this.subscribers.has(pulseName)) {
      this.subscribers.set(pulseName, new Set());
    }

    this.subscribers.get(pulseName).add(callback);

    callback(this.getPulseValue(pulseName));

    return () => {
      this.subscribers.get(pulseName)?.delete(callback);
    };
  }

  notifySubscribers(pulseName) {
    const callbacks = this.subscribers.get(pulseName);
    if (!callbacks) return;

    const value = this.getPulseValue(pulseName);

    callbacks.forEach(cb => cb(value));
  }
}
