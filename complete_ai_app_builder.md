# 🌐 Complete Web-Based No-Code AI App Builder System

## 🎯 **Refined System Identity & Core Purpose**

You are the **Master AI App Builder Assistant** - an elite web-based platform that transforms natural language descriptions into production-ready applications using multiple AI frameworks. Your mission is to democratize app development through intuitive interfaces and intelligent automation.

### **Core Capabilities**
- **Natural Language Processing**: Convert plain English descriptions into technical specifications
- **Multi-Framework Orchestration**: Seamlessly integrate SambaNova, Cerebras, Groq, CrewAI, MetaGPT, AutoGen, and LangChain
- **Real-Time Code Generation**: Live code preview with instant feedback
- **One-Click Deployment**: Direct integration with Replit, Vercel, and other platforms
- **Collaborative Development**: Multi-user editing with real-time synchronization

## 🏗️ **Complete Web Application Architecture**

### **Frontend Interface Components (React + TypeScript)**

#### **Main Application Structure**
```typescript
// src/types/AppBuilder.ts
export interface AppBuilderState {
  currentProject: Project | null;
  generationProgress: GenerationProgress;
  selectedFrameworks: AIFramework[];
  userPreferences: UserPreferences;
  collaborators: Collaborator[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  requirements: AppRequirements;
  generatedCode: GeneratedCode;
  deploymentConfig: DeploymentConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppRequirements {
  appType: 'web' | 'mobile' | 'desktop' | 'api';
  features: Feature[];
  aiCapabilities: AICapability[];
  integrations: Integration[];
  scalingNeeds: ScalingRequirements;
}

export interface GenerationProgress {
  stage: GenerationStage;
  progress: number;
  message: string;
  estimatedTimeRemaining: number;
  currentAgent: string;
}
```

#### **Smart Prompt Interface Component**
```typescript
// src/components/PromptInterface.tsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Code, Rocket } from 'lucide-react';

interface PromptInterfaceProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  isGenerating: boolean;
}

const PromptInterface: React.FC<PromptInterfaceProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    aiFeatures: true,
    realTimeUpdates: true,
    mobileResponsive: true,
    userAuth: false,
    database: true,
    payments: false,
    frameworks: ['react', 'nodejs', 'postgresql']
  });

  const examplePrompts = [
    "Build a social media app for pet owners with AI health tracking",
    "Create an e-commerce platform with AI product recommendations", 
    "Develop a project management tool with intelligent task automation",
    "Build a learning platform with AI-powered personalized content"
  ];

  const handleGenerate = useCallback(() => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, options);
    }
  }, [prompt, options, onGenerate, isGenerating]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Describe Your App Idea</h2>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>

      {/* Main Prompt Input */}
      <div className="relative mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your app in plain English... Be as detailed as possible about features, user types, and functionality."
          className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-colors"
          disabled={isGenerating}
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-400">
          {prompt.length}/2000
        </div>
      </div>

      {/* Quick Examples */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Try these examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="p-3 text-left text-sm bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Advanced Options:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(options).filter(([key]) => typeof options[key] === 'boolean').map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => setOptions({...options, [key]: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isGenerating}
              />
              <span className="text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating Your App...
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            Generate App
          </>
        )}
      </motion.button>
    </div>
  );
};

export default PromptInterface;
```

#### **Real-Time Progress Tracker**
```typescript
// src/components/ProgressTracker.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  estimatedTime: number;
  actualTime?: number;
  agent?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: string;
  overallProgress: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep, overallProgress }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">App Generation Progress</h3>
          <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.status === 'completed';
          const isError = step.status === 'error';

          return (
            <motion.div
              key={step.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 border-2 border-blue-200' : 
                isCompleted ? 'bg-green-50 border-2 border-green-200' :
                isError ? 'bg-red-50 border-2 border-red-200' :
                'bg-gray-50 border-2 border-gray-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                ) : isError ? (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                ) : (
                  <Clock className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    isActive ? 'text-blue-700' : 
                    isCompleted ? 'text-green-700' :
                    isError ? 'text-red-700' :
                    'text-gray-700'
                  }`}>
                    {step.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {step.agent && (
                      <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                        {step.agent}
                      </span>
                    )}
                    <span>
                      {isCompleted && step.actualTime ? 
                        `${step.actualTime}s` : 
                        `~${step.estimatedTime}s`
                      }
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
```

### **Backend Service Architecture (Node.js + Express)**

#### **Multi-Agent Orchestration Service**
```javascript
// backend/src/services/AgentOrchestrator.js
const EventEmitter = require('events');

class AgentOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.activeProjects = new Map();
    this.initializeAgents();
  }

  initializeAgents() {
    // Frontend Development Agent
    this.agents.set('frontend', {
      id: 'frontend',
      name: 'Frontend Architect',
      role: 'Senior Frontend Developer',
      capabilities: ['react', 'vue', 'angular', 'typescript', 'tailwind'],
      status: 'idle',
      currentTask: null
    });

    // Backend Development Agent
    this.agents.set('backend', {
      id: 'backend', 
      name: 'Backend Engineer',
      role: 'Backend API Developer',
      capabilities: ['nodejs', 'python', 'fastapi', 'express', 'database'],
      status: 'idle',
      currentTask: null
    });

    // AI Integration Agent
    this.agents.set('ai', {
      id: 'ai',
      name: 'AI Specialist',
      role: 'AI Integration Expert', 
      capabilities: ['openai', 'langchain', 'vectordb', 'embeddings'],
      status: 'idle',
      currentTask: null
    });

    // DevOps Agent
    this.agents.set('devops', {
      id: 'devops',
      name: 'DevOps Engineer', 
      role: 'Deployment & Infrastructure',
      capabilities: ['docker', 'kubernetes', 'monitoring', 'scaling'],
      status: 'idle',
      currentTask: null
    });

    // QA Testing Agent
    this.agents.set('qa', {
      id: 'qa',
      name: 'QA Tester',
      role: 'Quality Assurance Engineer',
      capabilities: ['testing', 'automation', 'performance', 'security'],
      status: 'idle', 
      currentTask: null
    });
  }

  async orchestrateAppDevelopment(projectId, requirements) {
    try {
      // Create development plan
      const developmentPlan = await this.createDevelopmentPlan(requirements);
      
      // Initialize project tracking
      this.activeProjects.set(projectId, {
        id: projectId,
        requirements,
        plan: developmentPlan,
        startTime: Date.now(),
        progress: 0,
        currentPhase: 'planning',
        agents: {},
        artifacts: {}
      });

      // Execute development phases
      const result = await this.executeDevelopmentPhases(projectId, developmentPlan);
      
      return result;
    } catch (error) {
      console.error('Orchestration error:', error);
      throw error;
    }
  }

  async createDevelopmentPlan(requirements) {
    // AI-powered development planning
    const phases = [
      {
        id: 'analysis',
        name: 'Requirements Analysis',
        description: 'Analyzing and structuring requirements',
        agent: 'ai',
        estimatedTime: 30,
        dependencies: []
      },
      {
        id: 'architecture',
        name: 'System Architecture',
        description: 'Designing system architecture and data models',
        agent: 'backend',
        estimatedTime: 60,
        dependencies: ['analysis']
      },
      {
        id: 'frontend_development',
        name: 'Frontend Development',
        description: 'Creating user interface and components',
        agent: 'frontend',
        estimatedTime: 120,
        dependencies: ['architecture']
      },
      {
        id: 'backend_development',
        name: 'Backend Development', 
        description: 'Building APIs and business logic',
        agent: 'backend',
        estimatedTime: 150,
        dependencies: ['architecture']
      },
      {
        id: 'ai_integration',
        name: 'AI Integration',
        description: 'Implementing AI features and capabilities',
        agent: 'ai',
        estimatedTime: 90,
        dependencies: ['backend_development']
      },
      {
        id: 'testing',
        name: 'Testing & QA',
        description: 'Comprehensive testing and quality assurance',
        agent: 'qa',
        estimatedTime: 60,
        dependencies: ['frontend_development', 'ai_integration']
      },
      {
        id: 'deployment',
        name: 'Deployment',
        description: 'Deploying to production environment',
        agent: 'devops',
        estimatedTime: 45,
        dependencies: ['testing']
      }
    ];

    return phases;
  }

  async executeDevelopmentPhases(projectId, phases) {
    const project = this.activeProjects.get(projectId);
    const results = {};

    for (const phase of phases) {
      try {
        // Check dependencies
        const dependenciesComplete = this.checkPhaseDependencies(phase, results);
        if (!dependenciesComplete) {
          throw new Error(`Dependencies not met for phase: ${phase.id}`);
        }

        // Update project status
        project.currentPhase = phase.id;
        this.emit('phaseStarted', { projectId, phase });

        // Execute phase with appropriate agent
        const phaseResult = await this.executePhase(projectId, phase);
        results[phase.id] = phaseResult;

        // Update progress
        const completedPhases = Object.keys(results).length;
        project.progress = (completedPhases / phases.length) * 100;
        
        this.emit('phaseCompleted', { projectId, phase, result: phaseResult });

      } catch (error) {
        console.error(`Phase ${phase.id} failed:`, error);
        this.emit('phaseError', { projectId, phase, error });
        throw error;
      }
    }

    return results;
  }

  async executePhase(projectId, phase) {
    const agent = this.agents.get(phase.agent);
    if (!agent) {
      throw new Error(`Agent not found: ${phase.agent}`);
    }

    // Update agent status
    agent.status = 'working';
    agent.currentTask = phase.id;

    try {
      // Simulate agent work with actual AI framework calls
      const result = await this.delegateToAgent(agent, phase, projectId);
      
      // Reset agent status
      agent.status = 'idle';
      agent.currentTask = null;

      return result;
    } catch (error) {
      agent.status = 'error';
      throw error;
    }
  }

  async delegateToAgent(agent, phase, projectId) {
    const project = this.activeProjects.get(projectId);
    
    switch (agent.id) {
      case 'frontend':
        return await this.generateFrontendCode(project.requirements);
      case 'backend':
        return await this.generateBackendCode(project.requirements);
      case 'ai':
        return await this.integrateAIFeatures(project.requirements);
      case 'devops':
        return await this.generateDeploymentConfig(project.requirements);
      case 'qa':
        return await this.generateTests(project.requirements);
      default:
        throw new Error(`Unknown agent: ${agent.id}`);
    }
  }

  checkPhaseDependencies(phase, completedResults) {
    return phase.dependencies.every(dep => completedResults[dep]);
  }

  // Agent-specific generation methods
  async generateFrontendCode(requirements) {
    // Integration with AI frameworks for frontend generation
    return {
      type: 'frontend',
      files: {
        'src/App.tsx': '// Generated React application code',
        'src/components/': '// Generated components',
        'package.json': '// Generated package configuration'
      },
      framework: 'react',
      styling: 'tailwind'
    };
  }

  async generateBackendCode(requirements) {
    // Integration with AI frameworks for backend generation
    return {
      type: 'backend',
      files: {
        'server.js': '// Generated Express server',
        'routes/': '// Generated API routes',
        'models/': '// Generated data models'
      },
      framework: 'express',
      database: 'postgresql'
    };
  }

  async integrateAIFeatures(requirements) {
    // AI integration logic
    return {
      type: 'ai_integration',
      features: ['chatbot', 'recommendations', 'analysis'],
      apis: ['openai', 'langchain'],
      vectorDb: 'pinecone'
    };
  }

  async generateDeploymentConfig(requirements) {
    // Deployment configuration generation
    return {
      type: 'deployment',
      platform: 'replit',
      config: {
        dockerfile: '// Generated Dockerfile',
        compose: '// Generated docker-compose.yml'
      }
    };
  }

  async generateTests(requirements) {
    // Test generation
    return {
      type: 'testing',
      suites: ['unit', 'integration', 'e2e'],
      coverage: 85,
      frameworks: ['jest', 'cypress']
    };
  }
}

module.exports = AgentOrchestrator;
```

#### **AI Framework Integration Manager**
```javascript
// backend/src/services/AIFrameworkManager.js
const OpenAI = require('openai');
const { Groq } = require('groq-sdk');

class AIFrameworkManager {
  constructor() {
    this.frameworks = {
      openai: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
      groq: new Groq({ apiKey: process.env.GROQ_API_KEY }),
      // Add other frameworks as they become available
    };
    this.loadBalancer = new Map();
    this.initializeLoadBalancing();
  }

  initializeLoadBalancing() {
    // Framework routing based on task type and performance
    this.loadBalancer.set('code_generation', 'openai');
    this.loadBalancer.set('quick_analysis', 'groq');
    this.loadBalancer.set('conversation', 'groq');
    this.loadBalancer.set('complex_reasoning', 'openai');
  }

  async generateCode(prompt, taskType = 'code_generation') {
    const framework = this.loadBalancer.get(taskType) || 'openai';
    
    try {
      switch (framework) {
        case 'openai':
          return await this.generateWithOpenAI(prompt);
        case 'groq':
          return await this.generateWithGroq(prompt);
        default:
          throw new Error(`Unknown framework: ${framework}`);
      }
    } catch (error) {
      console.error(`Code generation failed with ${framework}:`, error);
      // Fallback to alternative framework
      const fallback = framework === 'openai' ? 'groq' : 'openai';
      return await this.generateWithFallback(prompt, fallback);
    }
  }

  async generateWithOpenAI(prompt) {
    const response = await this.frameworks.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert full-stack developer. Generate complete, production-ready code with proper error handling, security considerations, and best practices.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    return {
      content: response.choices[0].message.content,
      framework: 'openai',
      model: 'gpt-4',
      tokens: response.usage?.total_tokens || 0
    };
  }

  async generateWithGroq(prompt) {
    const response = await this.frameworks.groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert full-stack developer. Generate complete, production-ready code with proper error handling, security considerations, and best practices.' 
        },
        { role: 'user', content: prompt }
      ],
      model: 'llama3-8b-8192',
      max_tokens: 4000,
      temperature: 0.7
    });

    return {
      content: response.choices[0].message.content,
      framework: 'groq', 
      model: 'llama3-8b-8192',
      tokens: response.usage?.total_tokens || 0
    };
  }

  async generateWithFallback(prompt, fallbackFramework) {
    console.log(`Using fallback framework: ${fallbackFramework}`);
    
    if (fallbackFramework === 'openai') {
      return await this.generateWithOpenAI(prompt);
    } else if (fallbackFramework === 'groq') {
      return await this.generateWithGroq(prompt);
    }
    
    throw new Error('All frameworks failed');
  }

  async analyzeRequirements(prompt) {
    // Use fast framework for initial analysis
    const response = await this.generateCode(prompt, 'quick_analysis');
    
    try {
      // Parse structured response
      const analysis = JSON.parse(response.content);
      return {
        appType: analysis.appType || 'web',
        features: analysis.features || [],
        complexity: analysis.complexity || 'medium',
        estimatedTime: analysis.estimatedTime || 300,
        recommendedStack: analysis.stack || ['react', 'nodejs', 'postgresql']
      };
    } catch (error) {
      // Fallback to text-based analysis
      return {
        appType: 'web',
        features: this.extractFeaturesFromText(response.content),
        complexity: 'medium',
        estimatedTime: 300,
        recommendedStack: ['react', 'nodejs', 'postgresql']
      };
    }
  }

  extractFeaturesFromText(text) {
    const commonFeatures = [
      'authentication', 'database', 'api', 'real-time', 'ai-integration',
      'file-upload', 'notifications', 'search', 'analytics', 'payments'
    ];
    
    return commonFeatures.filter(feature => 
      text.toLowerCase().includes(feature.replace('-', ' '))
    );
  }

  async generateProjectStructure(requirements) {
    const prompt = `
    Generate a complete project structure for a ${requirements.appType} application with the following requirements:
    
    Features: ${requirements.features.join(', ')}
    Stack: ${requirements.recommendedStack.join(', ')}
    Complexity: ${requirements.complexity}
    
    Return a JSON object with the complete file structure, including:
    - Frontend files and components
    - Backend API structure
    - Database schema
    - Configuration files
    - Documentation
    
    Make it production-ready with proper organization and best practices.
    `;

    const response = await this.generateCode(prompt, 'code_generation');
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      // Return default structure if parsing fails
      return this.getDefaultProjectStructure(requirements);
    }
  }

  getDefaultProjectStructure(requirements) {
    return {
      frontend: {
        'src/': {
          'components/': {},
          'pages/': {},
          'hooks/': {},
          'services/': {},
          'utils/': {},
          'App.tsx': '',
          'index.tsx': ''
        },
        'public/': {
          'index.html': '',
          'manifest.json': ''
        },
        'package.json': '',
        'tailwind.config.js': ''
      },
      backend: {
        'src/': {
          'routes/': {},
          'models/': {},
          'middleware/': {},
          'services/': {},
          'server.js': ''
        },
        'package.json': '',
        'Dockerfile': ''
      },
      database: {
        'migrations/': {},
        'seeds/': {},
        'schema.sql': ''
      },
      deployment: {
        'docker-compose.yml': '',
        '.replit': '',
        'replit.nix': ''
      }
    };
  }
}

module.exports = AIFrameworkManager;
```

### **WebSocket Real-Time Communication**
```javascript
// backend/src/services/WebSocketManager.js
const { Server } = require('socket.io');
const AgentOrchestrator = require('./AgentOrchestrator');
const AIFrameworkManager = require('./AIFrameworkManager');

class WebSocketManager {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.orchestrator = new AgentOrchestrator();
    this.aiManager = new AIFrameworkManager();
    this.activeConnections = new Map();
    
    this.setupEventHandlers();
    this.initializeSocket();
  }

  setupEventHandlers() {
    // Listen to orchestrator events
    this.orchestrator.on('phaseStarted', (data) => {
      this.broadcastToProject(data.projectId, 'generation-progress', {
        stage: data.phase.id,
        status: 'started',
        message: `Starting ${data.phase.name}...`,
        agent: data.phase.agent
      });
    });

    this.orchestrator.on('phaseCompleted', (data) => {
      this.broadcastToProject(data.projectId, 'generation-progress', {
        stage: data.phase.id,
        status: 'completed',
        message: `Completed ${data.phase.name}`,
        result: data.result
      });
    });

    this.orchestrator.on('phaseError', (data) => {
      this.broadcastToProject(data.projectId, 'generation-error', {
        stage: data.phase.id,
        error: data.error.message,
        message: `Error in ${data.phase.name}`
      });
    });
  }

  initializeSocket() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Store connection info
      this.activeConnections.set(socket.id, {
        socket,
        projectId: null,
        joinedAt: Date.now()
      });

      // Handle project joining
      socket.on('join-project', (projectId) => {
        socket.join(projectId);
        this.activeConnections.get(socket.id).projectId = projectId;
        console.log(`Client ${socket.id} joined project ${projectId}`);
      });

      // Handle app generation requests
      socket.on('generate-app', async (data) => {
        try {
          const { prompt, options, projectId } = data;
          
          // Join project room
          socket.join(projectId);
          this.activeConnections.get(socket.