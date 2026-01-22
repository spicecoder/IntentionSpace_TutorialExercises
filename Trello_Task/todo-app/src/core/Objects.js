import Field from './Field';

class TodoReflector {
  listen(field, setField) {
    if (!field.hasIntention('INT_ADD_TODO')) return;
    if (!field.hasPulse('text')) return;

    const text = field.getPulseValue('text');

    setField(prev => {
      const next = new Field();

      prev.pulses.forEach((p, k) => next.pulses.set(k, { ...p }));
      prev.intentions.forEach(i => {
        if (i !== 'INT_ADD_TODO') next.intentions.add(i);
      });
      next.subscribers = prev.subscribers;

      next.addIntention('INT_PROCESS_TODO', {
        todo_id: `todo_${Date.now()}`,
        todo_text: text
      });

      return next;
    });
  }
}

export default TodoReflector;
