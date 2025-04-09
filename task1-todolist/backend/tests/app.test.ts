import request from 'supertest';
import app from '../src/index';

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test task');
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a task', async () => {
    const create = await request(app).post('/tasks').send({ title: 'Update me' });
    const update = await request(app).put(`/tasks/${create.body.id}`).send({ title: 'Updated', done: true });
    expect(update.statusCode).toBe(200);
    expect(update.body.title).toBe('Updated');
    expect(update.body.done).toBe(true);
  });

  it('should not update a non-existing task', async () => {
    const res = await request(app).put('/tasks/999').send({ title: 'Nope' });
    expect(res.statusCode).toBe(404);
  });

  it('should delete a task', async () => {
    const create = await request(app).post('/tasks').send({ title: 'Delete me' });
    const res = await request(app).delete(`/tasks/${create.body.id}`);
    expect(res.statusCode).toBe(204);
  });

  it('should not delete a non-existing task', async () => {
    const res = await request(app).delete('/tasks/9999');
    expect(res.statusCode).toBe(404);
  });

  it('should filter tasks by query', async () => {
    await request(app).post('/tasks').send({ title: 'Buy milk' });
    await request(app).post('/tasks').send({ title: 'Buy coffee' });
    const res = await request(app).get('/tasks?q=milk');
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title.toLowerCase()).toContain('milk');
  });

  it('should toggle done status', async () => {
    const create = await request(app).post('/tasks').send({ title: 'To toggle' });
    const toggle = await request(app).put(`/tasks/${create.body.id}`).send({ done: true });
    expect(toggle.body.done).toBe(true);
  });

  it('should keep other fields when toggling done', async () => {
    const create = await request(app).post('/tasks').send({ title: 'Preserve title' });
    const toggle = await request(app).put(`/tasks/${create.body.id}`).send({ done: true });
    expect(toggle.body.title).toBe('Preserve title');
  });
});