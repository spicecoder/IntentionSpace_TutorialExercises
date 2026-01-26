import TodoManager from '../../src/core/DesignNodes';

describe('TodoManager', () => {
  let dn;
  
  beforeEach(() => {
    dn = new TodoManager();
  });
  
  test('adds todo to empty list', () => {
    // Arrange
    const input = {
      todo_id: 'test_123',
      todo_text: 'Buy milk',
      todos: '[]'
    };
    
    // Act
    const result = dn.executeStandalone(input);
    
    // Assert
    const todos = JSON.parse(result.todos);
    expect(todos).toHaveLength(1);
    expect(todos[0].id).toBe('test_123');
    expect(todos[0].text).toBe('Buy milk');
    expect(todos[0].done).toBe(false);
    expect(result.todo_count).toBe(1);
  });
  
  test('appends to existing todos', () => {
    // Arrange
    const existing = [
      { id: '1', text: 'First todo', done: false }
    ];
    
    const input = {
      todo_id: '2',
      todo_text: 'Second todo',
      todos: JSON.stringify(existing)
    };
    
    // Act
    const result = dn.executeStandalone(input);
    
    // Assert
    const todos = JSON.parse(result.todos);
    expect(todos).toHaveLength(2);
    expect(todos[0].text).toBe('First todo');
    expect(todos[1].text).toBe('Second todo');
    expect(result.todo_count).toBe(2);
  });
  
  test('handles malformed todos gracefully', () => {
    // Arrange
    const input = {
      todo_id: 'test',
      todo_text: 'Test',
      todos: 'invalid json'
    };
    
    // Act & Assert
    // Should handle error gracefully (or throw, then catch in DN)
    expect(() => dn.executeStandalone(input)).not.toThrow();
  });
});
