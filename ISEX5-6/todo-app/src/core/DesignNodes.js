import Field from './Field';

class TodoManager {
  listen(field, setField) {
    if (!field.hasIntention('INT_PROCESS_TODO')) return;

    const id = field.getPulseValue('todo_id');
    const text = field.getPulseValue('todo_text');
    const todos = field.getPulseValue('todos') || [];

    const updated = [
      ...todos,
      { id, text, done: false }
    ];

    // 🔥 IMPORTANT: update the SAME field
    field.setPulseValue('todos', updated);
    field.setPulseValue('todo_count', updated.length);

    field.removeIntention('INT_PROCESS_TODO');
  }
}

export default TodoManager;
