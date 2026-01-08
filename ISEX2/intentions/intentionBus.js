function createIntentionBus() {
  const subscribers = [];

  return {
    subscribe(fn) {
      subscribers.push(fn);
    },
    emit(intention) {
      subscribers.forEach(fn => fn(intention));
    }
  };
}

module.exports = { createIntentionBus };
