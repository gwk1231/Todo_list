import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TodoList.css';
import { nanoid } from 'nanoid';

const COLUMNS = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  DONE: 'done'
};

const COLUMN_NAMES = {
  [COLUMNS.TODO]: '할 일',
  [COLUMNS.IN_PROGRESS]: '진행 중',
  [COLUMNS.DONE]: '완료'
};

const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

function TodoList() {
  const [todos, setTodos] = useState({
    [COLUMNS.TODO]: [],
    [COLUMNS.IN_PROGRESS]: [],
    [COLUMNS.DONE]: []
  });
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(PRIORITY.MEDIUM);

  const addTodo = () => {
    if (input.trim() === '') return;
    
    const newTodo = {
      id: nanoid(),
      text: input,
      done: false,
      dueDate: dueDate || null,
      priority,
      createdAt: new Date().toISOString()
    };

    setTodos(prev => ({
      ...prev,
      [COLUMNS.TODO]: [...prev[COLUMNS.TODO], newTodo]
    }));
    
    setInput('');
    setDueDate('');
    setPriority(PRIORITY.MEDIUM);
  };

  const deleteTodo = (columnId, id) => {
    setTodos(prev => ({
      ...prev,
      [columnId]: prev[columnId].filter(todo => todo.id !== id)
    }));
  };

  const calculatePriority = (dueDate, columnId) => {
    if (!dueDate) return PRIORITY.LOW;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (columnId === COLUMNS.DONE) return PRIORITY.LOW;
    if (diffDays <= 1) return PRIORITY.HIGH;
    if (diffDays <= 3) return PRIORITY.MEDIUM;
    return PRIORITY.LOW;
  };

  const sortTodosByPriority = (todos) => {
    return [...todos].sort((a, b) => {
      // 날짜가 있는 항목을 우선 정렬
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // 날짜가 모두 있는 경우 날짜순 정렬
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      // 우선순위로 정렬
      const priorityOrder = { [PRIORITY.HIGH]: 0, [PRIORITY.MEDIUM]: 1, [PRIORITY.LOW]: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // 같은 컬럼 내에서의 이동
    if (source.droppableId === destination.droppableId) {
      const column = todos[source.droppableId];
      const newTodos = [...column];
      const [moved] = newTodos.splice(source.index, 1);
      newTodos.splice(destination.index, 0, moved);

      // 자동 정렬 적용
      const sortedTodos = sortTodosByPriority(newTodos);
      
      setTodos(prev => ({
        ...prev,
        [source.droppableId]: sortedTodos
      }));
    } 
    // 다른 컬럼으로의 이동
    else {
      const sourceColumn = todos[source.droppableId];
      const destColumn = todos[destination.droppableId];
      const sourceTodos = [...sourceColumn];
      const destTodos = [...destColumn];
      const [moved] = sourceTodos.splice(source.index, 1);
      
      // 완료 컬럼으로 이동할 때 자동으로 done 상태 변경
      if (destination.droppableId === COLUMNS.DONE) {
        moved.done = true;
        moved.priority = PRIORITY.LOW;
      } else if (source.droppableId === COLUMNS.DONE) {
        moved.done = false;
        moved.priority = calculatePriority(moved.dueDate, destination.droppableId);
      }
      
      destTodos.splice(destination.index, 0, moved);

      // 목적지 컬럼의 할 일들 자동 정렬
      const sortedDestTodos = sortTodosByPriority(destTodos);

      setTodos(prev => ({
        ...prev,
        [source.droppableId]: sourceTodos,
        [destination.droppableId]: sortedDestTodos
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getPriorityColor = (priority, isDone) => {
    if (isDone) return 'done';
    switch (priority) {
      case PRIORITY.HIGH: return 'high-priority';
      case PRIORITY.MEDIUM: return 'medium-priority';
      case PRIORITY.LOW: return 'low-priority';
      default: return '';
    }
  };

  const renderColumn = (columnId) => (
    <div className="todo-column">
      <h3 className="column-title">{COLUMN_NAMES[columnId]}</h3>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`droppable-area ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {todos[columnId].length === 0 && (
              <p className="empty-text">항목 없음</p>
            )}
            {todos[columnId].map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`list-item ${snapshot.isDragging ? 'dragging' : ''} ${getPriorityColor(todo.priority, todo.done)}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="todo-content">
                      <span className="todo-text">
                        {todo.text}
                      </span>
                      {todo.dueDate && (
                        <span className="due-date">
                          마감: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => deleteTodo(columnId, todo.id)}
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
    </div>
  );

  return (
    <div className="todo-container">
      <h2 className="title">📝 To Do List</h2>
      <div className="input-area">
        <div className="input-group">
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="할 일을 입력하세요"
          />
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select
            className="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value={PRIORITY.HIGH}>높음</option>
            <option value={PRIORITY.MEDIUM}>중간</option>
            <option value={PRIORITY.LOW}>낮음</option>
          </select>
        </div>
        <button className="add-button" onClick={addTodo}>
          추가
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {renderColumn(COLUMNS.TODO)}
          {renderColumn(COLUMNS.IN_PROGRESS)}
          {renderColumn(COLUMNS.DONE)}
        </div>
      </DragDropContext>
    </div>
  );
}

export default TodoList;
