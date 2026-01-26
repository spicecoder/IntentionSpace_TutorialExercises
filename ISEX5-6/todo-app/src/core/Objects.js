import Field from './Field';

class TodoReflector {
  listen(field) {
    if (!field.hasIntention('INT_ADD_TODO')) return;

    //GateKeeper
    const text = field.getPulseValue('text');
    if (!text) return;

    // Persist (retry-safe)
    const nonce = `obj_${Date.now()}`;

    field.setPulseValue('nonce', nonce);
    field.setPulseValue('intention_in', 'INT_ADD_TODO');
    field.setPulseValue('intention_out', 'INT_PROCESS_TODO');

     //  Pure PnR operations
    field.setPulseValue('todo_id', `todo_${Date.now()}`);  //CREATE 'todo_id' 
    field.setPulseValue('todo_text', text);                // COPY 'text' → 'todo_text'
    //  Reflect
    field.removeIntention('INT_ADD_TODO');
    field.addIntention('INT_PROCESS_TODO');
  }
}

export default TodoReflector;
