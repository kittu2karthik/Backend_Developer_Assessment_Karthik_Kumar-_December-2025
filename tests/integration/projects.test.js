const request = require('supertest');
const app = require('../../src/app');

describe('Projects API Integration Tests', () => {
  let authToken;
  let testProjectId;

  beforeAll(async () => {
    // Login to get auth token
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    authToken = res.body.data.accessToken;
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'Test Description',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.project).toHaveProperty('id');
      expect(res.body.data.project.name).toBe('Test Project');

      testProjectId = res.body.data.project.id;
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app).post('/api/projects').send({
        name: 'Test Project',
      });

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test Description',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/projects', () => {
    it('should get list of projects with pagination', async () => {
      const res = await request(app)
        .get('/api/projects?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('projects');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.projects)).toBe(true);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should get project by id', async () => {
      const res = await request(app)
        .get(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.project.id).toBe(testProjectId);
    });

    it('should return 404 for non-existent project', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/projects/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update project', async () => {
      const res = await request(app)
        .put(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Project Name',
          description: 'Updated Description',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.project.name).toBe('Updated Project Name');
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${testProjectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
