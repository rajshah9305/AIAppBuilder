const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Mock projects database (replace with actual database)
const projects = new Map();

// Validation middleware
const validateProject = [
  body('name').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Project description is required'),
  body('prompt').trim().isLength({ min: 10 }).withMessage('Prompt must be at least 10 characters'),
  body('frameworks').isArray({ min: 1 }).withMessage('At least one framework must be selected'),
];

// Apply authentication to all routes
router.use(authenticateToken);

// Get all projects for the authenticated user
router.get('/', (req, res) => {
  try {
    const userProjects = Array.from(projects.values())
      .filter(project => project.userId === req.userId)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(userProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      code: 'FETCH_PROJECTS_ERROR'
    });
  }
});

// Get a specific project
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.get(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Check if user owns the project
    if (project.userId !== req.userId) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      code: 'FETCH_PROJECT_ERROR'
    });
  }
});

// Create a new project
router.post('/', validateProject, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, description, prompt, frameworks, result } = req.body;

    const project = {
      id: Date.now().toString(),
      userId: req.userId,
      name,
      description,
      prompt,
      frameworks,
      result: result || null,
      status: result ? 'completed' : 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.set(project.id, project);

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Failed to create project',
      code: 'CREATE_PROJECT_ERROR'
    });
  }
});

// Update a project
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.get(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Check if user owns the project
    if (project.userId !== req.userId) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'prompt', 'frameworks', 'result', 'status'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // Update the project
    Object.assign(project, updates, {
      updatedAt: new Date().toISOString()
    });

    projects.set(id, project);

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Failed to update project',
      code: 'UPDATE_PROJECT_ERROR'
    });
  }
});

// Delete a project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.get(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Check if user owns the project
    if (project.userId !== req.userId) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    projects.delete(id);

    res.json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      code: 'DELETE_PROJECT_ERROR'
    });
  }
});

// Duplicate a project
router.post('/:id/duplicate', (req, res) => {
  try {
    const { id } = req.params;
    const originalProject = projects.get(id);

    if (!originalProject) {
      return res.status(404).json({
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND'
      });
    }

    // Check if user owns the project
    if (originalProject.userId !== req.userId) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    const duplicatedProject = {
      ...originalProject,
      id: Date.now().toString(),
      name: `${originalProject.name} (Copy)`,
      status: 'draft',
      result: null, // Reset result for the copy
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.set(duplicatedProject.id, duplicatedProject);

    res.status(201).json({
      message: 'Project duplicated successfully',
      project: duplicatedProject
    });
  } catch (error) {
    console.error('Duplicate project error:', error);
    res.status(500).json({
      error: 'Failed to duplicate project',
      code: 'DUPLICATE_PROJECT_ERROR'
    });
  }
});

// Get project statistics
router.get('/stats/overview', (req, res) => {
  try {
    const userProjects = Array.from(projects.values())
      .filter(project => project.userId === req.userId);

    const stats = {
      totalProjects: userProjects.length,
      completedProjects: userProjects.filter(p => p.status === 'completed').length,
      draftProjects: userProjects.filter(p => p.status === 'draft').length,
      generatingProjects: userProjects.filter(p => p.status === 'generating').length,
      errorProjects: userProjects.filter(p => p.status === 'error').length,
      recentProjects: userProjects
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
      frameworkUsage: {},
    };

    // Calculate framework usage
    userProjects.forEach(project => {
      if (project.frameworks) {
        project.frameworks.forEach(framework => {
          const frameworkId = framework.id || framework;
          stats.frameworkUsage[frameworkId] = (stats.frameworkUsage[frameworkId] || 0) + 1;
        });
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch project statistics',
      code: 'FETCH_STATS_ERROR'
    });
  }
});

module.exports = { router, projects };
