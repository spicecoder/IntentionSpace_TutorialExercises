// import TodoManager from '../../src/core/DesignNodes';
import TodoManager from '../../../src/core/design-nodes/TodoManager';

test('adds todo', () => {
  const dn = new TodoManager();

  const result = dn.executeStandalone({
    todo_id: '1',
    todo_text: 'Learn CPUX',
    todos: '[]'
  });

  const todos = JSON.parse(result.todos);
  expect(todos.length).toBe(1);
  expect(result.todo_count).toBe(1);
});
