import { useEffect, useState } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  done: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadTasks = async () => {
    const res = await fetch(`http://localhost:3001/tasks?q=${search}`);
    const data = await res.json();
    setTasks(data);
  };

  const saveTask = async () => {
    if (!title.trim()) return;
    if (editingId !== null) {
      await fetch(`http://localhost:3001/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      setEditingId(null);
    } else {
      await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
    }
    setTitle('');
    loadTasks();
  };

  const toggleDone = async (task: Task) => {
    await fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    });
    loadTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  };

  const editTask = (task: Task) => {
    setTitle(task.title);
    setEditingId(task.id);
  };

  useEffect(() => {
    loadTasks();
  }, [search]);

  return (
    <div className="app-container">
      <h1>To-do List</h1>
      <div className="input-group">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <button onClick={saveTask}>{editingId ? 'Update' : 'Add'}</button>
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search tasks..."
      />
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <span onClick={() => toggleDone(task)}>{task.title}</span>
            <button onClick={() => editTask(task)}>✏️</button>
            <button onClick={() => deleteTask(task.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;