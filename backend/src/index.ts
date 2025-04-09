import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let tasks: { id: number; title: string; done: boolean }[] = [];
let idCounter = 1;

app.get('/tasks', (req, res) => {
  const { q } = req.query;
  const filtered = q
    ? tasks.filter(t => t.title.toLowerCase().includes(String(q).toLowerCase()))
    : tasks;
  res.json(filtered);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  const newTask = { id: idCounter++, title, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, done } = req.body;
  const task = tasks.find(t => t.id === id);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (title !== undefined) task.title = title;
  if (done !== undefined) task.done = done;

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(3001, () => {
  console.log('🚀 Backend running on http://localhost:3001');
});

export default app;