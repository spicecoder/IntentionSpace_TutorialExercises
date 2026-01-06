// export function emit(intention, signal) {
//   console.log(`📡 Emitting signal into ${intention}`);
  
  
//   }
// tunnel/emitter.js

const listeners = {};

export function listen(intention, handler) {
  if (!listeners[intention]) {
    listeners[intention] = [];
  }
  listeners[intention].push(handler);
}

export function emit(intention, signal) {
  console.log(`📡 Emitting signal into ${intention}`);

  const handlers = listeners[intention] || [];

  handlers.forEach(handler => handler(signal));
}
