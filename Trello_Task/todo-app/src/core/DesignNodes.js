import Field from './Field';

class TodoManager {
  listen(field, setField) {
    if (!field.hasIntention('INT_PROCESS_TODO')) return;
    if (!field.hasPulse('todo_id') || !field.hasPulse('todo_text')) return;

    const input = {
      todo_id: field.getPulseValue('todo_id'),
      todo_text: field.getPulseValue('todo_text'),
      todos: field.getPulseValue('todos') || '[]'
    };

    const result = this.perform(input);

    setField(prev => {
      const next = new Field();

      prev.pulses.forEach((p, k) => next.pulses.set(k, { ...p }));
      prev.intentions.forEach(i => {
        if (i !== 'INT_PROCESS_TODO') next.intentions.add(i);
      });
      next.subscribers = prev.subscribers;

      next.setPulseValue('todos', result.todos);
      next.setPulseValue('todo_count', result.todo_count);

      next.notifySubscribers();
      return next;
    });
  }

  perform(input) {
    let todos = [];
    try {
      todos = JSON.parse(input.todos);
    } catch {
      todos = [];
    }

    todos.push({
      id: input.todo_id,
      text: input.todo_text,
      done: false
    });

    return {
      todos: JSON.stringify(todos),
      todo_count: todos.length
    };
  }

  executeStandalone(input) {
    return this.perform(input);
  }
}

export default TodoManager;
