const request = require('supertest');
const app = require('../src/server');

describe('API Endpoints', () => {
  let authToken;
  let userId;

  describe('Authentication', () => {
    test('POST /api/v1/auth/register - should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
      
      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    test('POST /api/v1/auth/login - should login with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Test123'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.token).toBeDefined();
    });

    test('POST /api/v1/auth/login - should reject invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword'
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Tasks', () => {
    test('POST /api/v1/tasks - should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        priority: 'medium'
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.title).toBe(taskData.title);
    });

    test('GET /api/v1/tasks - should get user tasks', async () => {
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });

    test('GET /api/v1/tasks - should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/v1/tasks');

      expect(response.status).toBe(401);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Health Check', () => {
    test('GET /health - should return server status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Server is running');
    });
  });
});

