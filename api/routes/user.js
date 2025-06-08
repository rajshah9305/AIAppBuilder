const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, users } = require('./auth');
const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get current user profile
router.get('/me', (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remove password from response
    const { _password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      code: 'FETCH_PROFILE_ERROR'
    });
  }
});

// Update user profile
router.patch('/me', [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail(),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if email is being changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = Array.from(users.values()).some(u => u.email === req.body.email && u.id !== req.userId);
      if (emailExists) {
        return res.status(409).json({
          error: 'Email already in use',
          code: 'EMAIL_EXISTS'
        });
      }
      
      // Update email key in users map
      users.delete(user.email);
      user.email = req.body.email;
      users.set(user.email, user);
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'avatar'];
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    }

    user.updatedAt = new Date().toISOString();

    // Remove password from response
    const { _password, ...userProfile } = user;
    res.json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

// Get user usage statistics
router.get('/usage', (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const usage = {
      ...user.usage,
      subscription: user.subscription,
      usagePercentage: {
        generations: Math.round((user.usage.generationsThisMonth / user.usage.maxGenerationsPerMonth) * 100),
        tokens: Math.round((user.usage.tokensUsed / user.usage.maxTokensPerMonth) * 100),
      },
      remainingQuota: {
        generations: user.usage.maxGenerationsPerMonth - user.usage.generationsThisMonth,
        tokens: user.usage.maxTokensPerMonth - user.usage.tokensUsed,
      },
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
    };

    res.json(usage);
  } catch (error) {
    console.error('Get user usage error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage data',
      code: 'FETCH_USAGE_ERROR'
    });
  }
});

// Update user subscription
router.patch('/subscription', [
  body('subscription').isIn(['free', 'pro', 'enterprise']).withMessage('Invalid subscription type'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { subscription } = req.body;
    const oldSubscription = user.subscription;

    // Update subscription and usage limits
    user.subscription = subscription;
    user.updatedAt = new Date().toISOString();

    // Update usage limits based on subscription
    switch (subscription) {
      case 'free':
        user.usage.maxGenerationsPerMonth = 10;
        user.usage.maxTokensPerMonth = 100000;
        break;
      case 'pro':
        user.usage.maxGenerationsPerMonth = 100;
        user.usage.maxTokensPerMonth = 1000000;
        break;
      case 'enterprise':
        user.usage.maxGenerationsPerMonth = 1000;
        user.usage.maxTokensPerMonth = 10000000;
        break;
    }

    res.json({
      message: 'Subscription updated successfully',
      subscription: {
        old: oldSubscription,
        new: subscription,
        limits: {
          generations: user.usage.maxGenerationsPerMonth,
          tokens: user.usage.maxTokensPerMonth,
        }
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      error: 'Failed to update subscription',
      code: 'UPDATE_SUBSCRIPTION_ERROR'
    });
  }
});

// Increment usage (called internally when generating apps)
router.post('/usage/increment', [
  body('type').isIn(['generation', 'tokens']).withMessage('Invalid usage type'),
  body('amount').isInt({ min: 1 }).withMessage('Amount must be a positive integer'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { type, amount } = req.body;

    if (type === 'generation') {
      if (user.usage.generationsThisMonth >= user.usage.maxGenerationsPerMonth) {
        return res.status(429).json({
          error: 'Generation limit exceeded',
          code: 'GENERATION_LIMIT_EXCEEDED'
        });
      }
      user.usage.generationsThisMonth += amount;
    } else if (type === 'tokens') {
      if (user.usage.tokensUsed + amount > user.usage.maxTokensPerMonth) {
        return res.status(429).json({
          error: 'Token limit exceeded',
          code: 'TOKEN_LIMIT_EXCEEDED'
        });
      }
      user.usage.tokensUsed += amount;
    }

    user.updatedAt = new Date().toISOString();

    res.json({
      message: 'Usage updated successfully',
      usage: user.usage
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    res.status(500).json({
      error: 'Failed to update usage',
      code: 'UPDATE_USAGE_ERROR'
    });
  }
});

// Reset monthly usage (typically called by a cron job)
router.post('/usage/reset', (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    user.usage.generationsThisMonth = 0;
    user.usage.tokensUsed = 0;
    user.updatedAt = new Date().toISOString();

    res.json({
      message: 'Usage reset successfully',
      usage: user.usage
    });
  } catch (error) {
    console.error('Reset usage error:', error);
    res.status(500).json({
      error: 'Failed to reset usage',
      code: 'RESET_USAGE_ERROR'
    });
  }
});

// Delete user account
router.delete('/me', (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Remove user from database
    users.delete(user.email);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      code: 'DELETE_ACCOUNT_ERROR'
    });
  }
});

module.exports = router;
