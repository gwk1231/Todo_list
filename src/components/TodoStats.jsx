import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import './TodoStats.css';

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  done: '#9ca3af'
};

const PRIORITY_NAMES = {
  high: '높음',
  medium: '중간',
  low: '낮음'
};

const TodoStats = ({ todos }) => {
  // 상태별 할 일 수 계산
  const statusData = [
    { name: '할 일', value: todos.todo.length, color: '#3b82f6' },
    { name: '진행 중', value: todos.inProgress.length, color: '#f59e0b' },
    { name: '완료', value: todos.done.length, color: '#10b981' }
  ];

  // 우선순위별 할 일 수 계산
  const priorityData = Object.entries(PRIORITY_NAMES).map(([priority, name]) => ({
    name,
    할일: todos.todo.filter(todo => todo.priority === priority).length,
    진행중: todos.inProgress.filter(todo => todo.priority === priority).length
  }));

  // 마감일이 있는 할 일 수 계산
  const withDueDate = todos.todo.filter(todo => todo.dueDate).length + 
                     todos.inProgress.filter(todo => todo.dueDate).length;
  const withoutDueDate = todos.todo.filter(todo => !todo.dueDate).length +
                        todos.inProgress.filter(todo => !todo.dueDate).length;
  
  const dueDateData = [
    { name: '마감일 있음', value: withDueDate, color: '#3b82f6' },
    { name: '마감일 없음', value: withoutDueDate, color: '#9ca3af' }
  ];

  return (
    <div className="stats-container">
      <h3 className="stats-title">📊 할 일 통계</h3>
      
      <div className="charts-container">
        {/* 상태별 할 일 수 */}
        <div className="chart-section">
          <h4>상태별 할 일</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 우선순위별 할 일 수 */}
        <div className="chart-section">
          <h4>우선순위별 할 일</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="할일" fill="#3b82f6" />
              <Bar dataKey="진행중" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 마감일 설정 비율 */}
        <div className="chart-section">
          <h4>마감일 설정 비율</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dueDateData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dueDateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TodoStats; 