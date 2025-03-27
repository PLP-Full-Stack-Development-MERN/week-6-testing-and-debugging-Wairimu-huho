const request = require('supertest');
const app = require('../../app');
const Bug = require('../../models/Bug');
const mongoose = require('mongoose');

describe('Bug API Routes', () => {
  const sampleBug = {
    title: 'Test Bug',
    description: 'This is a test bug for integration testing',
    status: 'open',
    priority: 'medium',
    reportedBy: 'Test User',
    project: 'Test Project',
    stepsToReproduce: '1. Do this\n2. Then that',
  };

  describe('POST /api/bugs', () => {
    it('should create a new bug', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send(sampleBug)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(sampleBug.title);
      expect(res.body.data.status).toBe(sampleBug.status);

      // Verify bug is in database
      const bug = await Bug.findById(res.body.data._id);
      expect(bug).not.toBeNull();
      expect(bug.description).toBe(sampleBug.description);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({
          title: 'Incomplete Bug',
          // Missing required fields
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 if title is too long', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send({
          ...sampleBug,
          title: 'A'.repeat(101), // Exceeds 100 character limit
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.some(e => e.field === 'title')).toBe(true);
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create multiple bugs for testing
      const bugs = [
        { ...sampleBug, title: 'Bug 1', status: 'open', priority: 'low' },
        { ...sampleBug, title: 'Bug 2', status: 'in-progress', priority: 'medium' },
        { ...sampleBug, title: 'Bug 3', status: 'resolved', priority: 'high' },
        { ...sampleBug, title: 'Bug 4', status: 'open', priority: 'critical' },
      ];

      await Bug.insertMany(bugs);
    });

    it('should return all bugs', async () => {
      const res = await request(app)
        .get('/api/bugs')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(4);
    });

    it('should filter bugs by status', async () => {
      const res = await request(app)
        .get('/api/bugs?status=open')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data.every(bug => bug.status === 'open')).toBe(true);
    });

    it('should filter bugs by priority', async () => {
      const res = await request(app)
        .get('/api/bugs?priority=high')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].priority).toBe('high');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/bugs?limit=2&page=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.totalPages).toBe(2);
      expect(res.body.currentPage).toBe(1);
    });
  });

  describe('GET /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      // Create a bug for testing
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it('should get a bug by id', async () => {
      const res = await request(app)
        .get(`/api/bugs/${bugId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(bugId.toString());
      expect(res.body.data.title).toBe(sampleBug.title);
    });

    it('should return 404 if bug not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 if id is invalid', async () => {
      const res = await request(app)
        .get('/api/bugs/invalidid')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      // Create a bug for testing
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it('should update a bug', async () => {
      const updateData = {
        title: 'Updated Bug Title',
        status: 'in-progress',
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.status).toBe(updateData.status);
      // Other fields should remain unchanged
      expect(res.body.data.description).toBe(sampleBug.description);
    });

    it('should return 400 if status transition is invalid', async () => {
      // First update to 'closed'
      await request(app)
        .put(`/api/bugs/${bugId}`)
        .send({ status: 'closed' });

      // Then try to update to 'in-progress' (invalid transition)
      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send({ status: 'in-progress' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid status transition');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      // Create a bug for testing
      const bug = await Bug.create(sampleBug);
      bugId = bug._id;
    });

    it('should delete a bug', async () => {
      const res = await request(app)
        .delete(`/api/bugs/${bugId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('successfully deleted');

      // Verify bug is removed from database
      const bug = await Bug.findById(bugId);
      expect(bug).toBeNull();
    });

    it('should return 404 if bug not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bugs/stats', () => {
    beforeEach(async () => {
      // Create multiple bugs for testing stats
      const bugs = [
        { ...sampleBug, title: 'Bug 1', status: 'open', priority: 'low', project: 'Project A' },
        { ...sampleBug, title: 'Bug 2', status: 'in-progress', priority: 'medium', project: 'Project A' },
        { ...sampleBug, title: 'Bug 3', status: 'resolved', priority: 'high', project: 'Project B' },
        { ...sampleBug, title: 'Bug 4', status: 'open', priority: 'critical', project: 'Project C' },
        { ...sampleBug, title: 'Bug 5', status: 'open', priority: 'medium', project: 'Project A' },
      ];

      await Bug.insertMany(bugs);
    });

    it('should return statistics about bugs', async () => {
      const res = await request(app)
        .get('/api/bugs/stats')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data).toHaveProperty('priority');
      expect(res.body.data).toHaveProperty('projects');

      // Verify counts
      const openBugs = res.body.data.status.find(s => s._id === 'open');
      expect(openBugs.count).toBe(3);

      const projectA = res.body.data.projects.find(p => p._id === 'Project A');
      expect(projectA.count).toBe(3);
    });
  });
});