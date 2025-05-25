import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TodoList.css';
import { nanoid } from 'nanoid';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { id: nanoid(), text: input, done: false }])
    setInput('');
  };

  const toggleTodo = (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updated);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTodos = [...todos];
    const [moved] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, moved);
    setTodos(newTodos);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container">
      <h2 className="title">📝 To Do List</h2>
      <div className="input-area">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="할 일을 입력하세요"
        />
        <button className="add-button" onClick={addTodo}>
          추가
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todoList">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {todos.length === 0 && (
                <p className="empty-text">할 일이 없습니다.</p>
              )}
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <span
                        className={`todo-text ${todo.done ? "todo-done" : ""}`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <button
                        className="delete-button"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TodoList;
