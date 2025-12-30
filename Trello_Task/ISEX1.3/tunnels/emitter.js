function emit(channel, signal) {
  console.log(`🚂 Emitting Signal into ${channel}`);
  console.log("   Pulses:", signal.pulses.length);
}

module.exports = { emit };
