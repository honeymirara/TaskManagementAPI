const request = require('supertest');
const app = require('../index');
const Task = require('../models/taskModel');

function toMySQLDateString(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

describe('Task API', () => {
  let testTaskId;

  const testTask = {
    title: 'Test Task',
    description: 'Test Description',
    due_date: toMySQLDateString(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Завтра
    status: 'pending'
  };

  beforeAll(async () => {
    await Task.delete(1);
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send(testTask)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('task_id');
      expect(response.body.data.title).toBe(testTask.title);
      
      testTaskId = response.body.data.task_id;
    });

    it('should validate task input', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get all tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get a specific task', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTaskId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.task_id).toBe(testTaskId);
    });

    it('should return 404 for non-existent task', async () => {
      await request(app)
        .get('/api/tasks/999999')
        .expect(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        ...testTask,
        title: 'Updated Task',
        due_date: toMySQLDateString(new Date(Date.now() + 48 * 60 * 60 * 1000)) // Послезавтра
      };

      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send(updatedTask)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe('Updated Task');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      await request(app)
        .delete(`/api/tasks/${testTaskId}`)
        .expect(204);
    });
  });

  describe('GET /api/tasks with pagination', () => {
    it('should return paginated tasks', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=2')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/tasks with sorting', () => {
    it('should return tasks sorted by due_date ascending', async () => {
      const response = await request(app)
        .get('/api/tasks?sort_by=due_date&order=asc')
        .expect(200);

      expect(response.body.status).toBe('success');
      const tasks = response.body.data;
      for (let i = 1; i < tasks.length; i++) {
        expect(new Date(tasks[i].due_date) >= new Date(tasks[i - 1].due_date)).toBe(true);
      }
    });
  });

  describe('GET /api/tasks with status filter', () => {
    it('should return only tasks with status pending', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .expect(200);

      expect(response.body.status).toBe('success');
      response.body.data.forEach(task => {
        expect(task.status).toBe('pending');
      });
    });
  });

  describe('GET /api/tasks with due_date range filter', () => {
    it('should return tasks within the due_date range', async () => {
      const response = await request(app)
        .get('/api/tasks?due_date_from=2025-06-10&due_date_to=2025-06-20')
        .expect(200);

      expect(response.body.status).toBe('success');
      response.body.data.forEach(task => {
        expect(new Date(task.due_date) >= new Date('2025-06-10')).toBe(true);
        expect(new Date(task.due_date) <= new Date('2025-06-20')).toBe(true);
      });
    });
  });

  describe('GET /api/tasks with invalid params', () => {
    it('should not fail with invalid pagination params', async () => {
      const response = await request(app)
        .get('/api/tasks?page=abc&limit=xyz')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
}); 