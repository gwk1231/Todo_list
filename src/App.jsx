import './App.css';
import TodoList from './components/TodoList';
import WeatherWidget from './components/WeatherWidget';

function App() {
  return (
    <div className="App">
      <WeatherWidget />
      <TodoList />
    </div>
  );
}

export default App;
