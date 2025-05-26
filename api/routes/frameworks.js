const express = require('express');
const aiService = require('../services/aiService');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get framework status (public endpoint)
router.get('/status', async (req, res) => {
  try {
    const status = aiService.getFrameworkStatus();
    
    res.json({
      frameworks: status,
      timestamp: new Date().toISOString(),
      summary: {
        total: Object.keys(status).length,
        enabled: Object.values(status).filter(Boolean).length,
        disabled: Object.values(status).filter(s => !s).length,
      }
    });
  } catch (error) {
    console.error('Get framework status error:', error);
    res.status(500).json({
      error: 'Failed to fetch framework status',
      code: 'FRAMEWORK_STATUS_ERROR'
    });
  }
});

// Get detailed framework information
router.get('/info', (req, res) => {
  try {
    const frameworks = [
      {
        id: 'openai',
        name: 'OpenAI GPT-4',
        description: 'Advanced language model for high-quality code generation and complex reasoning',
        icon: '🤖',
        capabilities: ['Code Generation', 'Documentation', 'Testing', 'Debugging'],
        pricing: 'Premium',
        speed: 'Medium',
        strengths: ['High quality output', 'Complex reasoning', 'Versatile'],
        limitations: ['Cost per token', 'Rate limits'],
        useCases: ['Complex applications', 'Production code', 'Documentation'],
        enabled: !!process.env.OPENAI_API_KEY,
      },
      {
        id: 'groq',
        name: 'Groq LLaMA',
        description: 'Ultra-fast inference for rapid prototyping and real-time code analysis',
        icon: '⚡',
        capabilities: ['Fast Analysis', 'Code Review', 'Quick Prototyping'],
        pricing: 'Free',
        speed: 'Very Fast',
        strengths: ['Extremely fast', 'Cost effective', 'Good for iteration'],
        limitations: ['Limited context', 'Less sophisticated reasoning'],
        useCases: ['Rapid prototyping', 'Code analysis', 'Quick iterations'],
        enabled: !!process.env.GROQ_API_KEY,
      },
      {
        id: 'crewai',
        name: 'CrewAI',
        description: 'Multi-agent system for collaborative development with specialized roles',
        icon: '👥',
        capabilities: ['Multi-Agent Development', 'Role-Based Tasks', 'Collaboration'],
        pricing: 'Free',
        speed: 'Medium',
        strengths: ['Collaborative approach', 'Specialized agents', 'Comprehensive output'],
        limitations: ['Setup complexity', 'Coordination overhead'],
        useCases: ['Team simulation', 'Complex projects', 'Multi-perspective analysis'],
        enabled: true,
      },
      {
        id: 'metagpt',
        name: 'MetaGPT',
        description: 'Automated software development with comprehensive documentation',
        icon: '📋',
        capabilities: ['Documentation', 'Architecture Design', 'Project Planning'],
        pricing: 'Free',
        speed: 'Medium',
        strengths: ['Comprehensive docs', 'Architecture focus', 'Project structure'],
        limitations: ['Documentation heavy', 'Less code focus'],
        useCases: ['Documentation generation', 'Architecture design', 'Project planning'],
        enabled: true,
      },
      {
        id: 'autogen',
        name: 'AutoGen',
        description: 'Conversational AI agents for iterative development and problem-solving',
        icon: '🔄',
        capabilities: ['Iterative Development', 'Problem Solving', 'Code Refinement'],
        pricing: 'Free',
        speed: 'Medium',
        strengths: ['Iterative improvement', 'Conversational approach', 'Problem solving'],
        limitations: ['Can be verbose', 'Multiple iterations needed'],
        useCases: ['Code refinement', 'Problem solving', 'Iterative development'],
        enabled: true,
      },
      {
        id: 'langchain',
        name: 'LangChain',
        description: 'Complex AI workflows and chain-of-thought reasoning for sophisticated apps',
        icon: '🔗',
        capabilities: ['Complex Workflows', 'Chain Reasoning', 'Integration'],
        pricing: 'Free',
        speed: 'Slow',
        strengths: ['Complex workflows', 'Chain reasoning', 'Flexible integration'],
        limitations: ['Complexity', 'Slower execution', 'Setup overhead'],
        useCases: ['Complex AI workflows', 'Chain reasoning', 'Advanced integrations'],
        enabled: true,
      },
    ];

    res.json({
      frameworks,
      recommendations: {
        beginners: ['groq', 'crewai'],
        production: ['openai', 'metagpt'],
        rapid_prototyping: ['groq', 'autogen'],
        documentation: ['metagpt', 'openai'],
        complex_workflows: ['langchain', 'crewai'],
      }
    });
  } catch (error) {
    console.error('Get framework info error:', error);
    res.status(500).json({
      error: 'Failed to fetch framework information',
      code: 'FRAMEWORK_INFO_ERROR'
    });
  }
});

// Test a specific framework (protected endpoint)
router.post('/:frameworkId/test', authenticateToken, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    
    if (!['openai', 'groq', 'crewai', 'metagpt', 'autogen', 'langchain'].includes(frameworkId)) {
      return res.status(400).json({
        error: 'Invalid framework ID',
        code: 'INVALID_FRAMEWORK'
      });
    }

    const isWorking = await aiService.testFramework(frameworkId);
    
    res.json({
      framework: frameworkId,
      success: isWorking,
      message: isWorking ? 'Framework is working correctly' : 'Framework test failed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test framework error:', error);
    res.status(500).json({
      error: 'Framework test failed',
      code: 'FRAMEWORK_TEST_ERROR',
      details: error.message,
    });
  }
});

// Get framework usage statistics (protected endpoint)
router.get('/usage', authenticateToken, (req, res) => {
  try {
    // Mock usage statistics (in a real app, this would come from database)
    const usageStats = {
      totalGenerations: 1250,
      frameworkUsage: {
        openai: { count: 450, percentage: 36 },
        groq: { count: 380, percentage: 30.4 },
        crewai: { count: 200, percentage: 16 },
        metagpt: { count: 120, percentage: 9.6 },
        autogen: { count: 70, percentage: 5.6 },
        langchain: { count: 30, percentage: 2.4 },
      },
      popularCombinations: [
        { frameworks: ['openai', 'groq'], count: 85, percentage: 6.8 },
        { frameworks: ['crewai', 'metagpt'], count: 65, percentage: 5.2 },
        { frameworks: ['openai', 'crewai', 'metagpt'], count: 45, percentage: 3.6 },
      ],
      averageGenerationTime: {
        openai: 45, // seconds
        groq: 8,
        crewai: 35,
        metagpt: 25,
        autogen: 40,
        langchain: 60,
      },
      successRates: {
        openai: 95.2,
        groq: 92.8,
        crewai: 88.5,
        metagpt: 91.3,
        autogen: 87.9,
        langchain: 85.6,
      },
      lastUpdated: new Date().toISOString(),
    };

    res.json(usageStats);
  } catch (error) {
    console.error('Get framework usage error:', error);
    res.status(500).json({
      error: 'Failed to fetch framework usage statistics',
      code: 'FRAMEWORK_USAGE_ERROR'
    });
  }
});

// Get framework recommendations based on prompt
router.post('/recommend', authenticateToken, (req, res) => {
  try {
    const { prompt, complexity, requirements } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        error: 'Prompt is required',
        code: 'MISSING_PROMPT'
      });
    }

    // Simple recommendation logic (in a real app, this could use ML)
    const recommendations = [];
    const promptLower = prompt.toLowerCase();

    // Always recommend based on complexity
    if (complexity === 'high' || promptLower.includes('complex') || promptLower.includes('enterprise')) {
      recommendations.push('openai', 'langchain');
    }

    // Speed requirements
    if (requirements?.includes('fast') || promptLower.includes('quick') || promptLower.includes('rapid')) {
      recommendations.push('groq');
    }

    // Documentation needs
    if (promptLower.includes('documentation') || promptLower.includes('docs') || promptLower.includes('architecture')) {
      recommendations.push('metagpt');
    }

    // Team/collaboration aspects
    if (promptLower.includes('team') || promptLower.includes('collaboration') || promptLower.includes('multi')) {
      recommendations.push('crewai');
    }

    // Iterative development
    if (promptLower.includes('iterative') || promptLower.includes('refine') || promptLower.includes('improve')) {
      recommendations.push('autogen');
    }

    // Default recommendations if none match
    if (recommendations.length === 0) {
      recommendations.push('openai', 'groq');
    }

    // Remove duplicates and limit to 3
    const uniqueRecommendations = [...new Set(recommendations)].slice(0, 3);

    res.json({
      prompt: prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''),
      recommendations: uniqueRecommendations,
      reasoning: {
        complexity: complexity || 'medium',
        factors: {
          needsSpeed: promptLower.includes('quick') || promptLower.includes('fast'),
          needsDocs: promptLower.includes('documentation') || promptLower.includes('docs'),
          needsCollaboration: promptLower.includes('team') || promptLower.includes('collaboration'),
          isComplex: complexity === 'high' || promptLower.includes('complex'),
        }
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get framework recommendations error:', error);
    res.status(500).json({
      error: 'Failed to generate framework recommendations',
      code: 'FRAMEWORK_RECOMMENDATION_ERROR'
    });
  }
});

module.exports = router;
