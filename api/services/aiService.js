const OpenAI = require('openai');
const Groq = require('groq-sdk');

class AIFrameworkService {
  constructor() {
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Initialize Groq
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Framework configurations
    this.frameworks = {
      openai: {
        name: 'OpenAI GPT-4',
        enabled: !!process.env.OPENAI_API_KEY,
        model: 'gpt-4',
      },
      groq: {
        name: 'Groq LLaMA',
        enabled: !!process.env.GROQ_API_KEY,
        model: 'llama3-8b-8192',
      },
      crewai: {
        name: 'CrewAI',
        enabled: true, // Mock implementation
      },
      metagpt: {
        name: 'MetaGPT',
        enabled: true, // Mock implementation
      },
      autogen: {
        name: 'AutoGen',
        enabled: true, // Mock implementation
      },
      langchain: {
        name: 'LangChain',
        enabled: true, // Mock implementation
      },
    };
  }
  
  async generateApp(prompt, frameworks, progressCallback) {
    const result = {
      analysis: null,
      code: null,
      crewai: null,
      metagpt: null,
      autogen: null,
      langchain: null,
      metadata: {
        generatedAt: new Date().toISOString(),
        frameworks: frameworks.map(f => f.id),
        promptLength: prompt.length,
        estimatedComplexity: this.estimateComplexity(prompt),
      }
    };
    
    const totalSteps = frameworks.length + 1; // +1 for analysis
    let currentStep = 0;
    
    try {
      // Step 1: Initial analysis
      progressCallback({
        stage: 'analysis',
        progress: Math.round((currentStep / totalSteps) * 100),
        message: 'Analyzing your app requirements...',
      });
      
      result.analysis = await this.analyzePrompt(prompt);
      currentStep++;
      
      // Process each selected framework
      for (const framework of frameworks) {
        progressCallback({
          stage: 'code-generation',
          progress: Math.round((currentStep / totalSteps) * 100),
          message: `Generating code with ${framework.name}...`,
        });
        
        switch (framework.id) {
          case 'openai':
            result.code = await this.generateWithOpenAI(prompt, result.analysis);
            break;
          case 'groq':
            if (!result.code) {
              result.code = await this.generateWithGroq(prompt, result.analysis);
            }
            break;
          case 'crewai':
            result.crewai = await this.generateWithCrewAI(prompt, result.analysis);
            break;
          case 'metagpt':
            result.metagpt = await this.generateWithMetaGPT(prompt, result.analysis);
            break;
          case 'autogen':
            result.autogen = await this.generateWithAutoGen(prompt, result.analysis);
            break;
          case 'langchain':
            result.langchain = await this.generateWithLangChain(prompt, result.analysis);
            break;
        }
        
        currentStep++;
      }
      
      // Final optimization
      progressCallback({
        stage: 'finalization',
        progress: 100,
        message: 'Finalizing your application...',
      });
      
      return result;
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error(`Generation failed: ${error.message}`);
    }
  }
  
  async analyzePrompt(prompt) {
    try {
      if (this.frameworks.groq.enabled) {
        const response = await this.groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert software architect. Analyze the following app idea and provide a detailed technical analysis including recommended architecture, technologies, and implementation approach.'
            },
            {
              role: 'user',
              content: `Analyze this app idea: ${prompt}`
            }
          ],
          model: this.frameworks.groq.model,
          max_tokens: 1000,
          temperature: 0.7,
        });
        
        return response.choices[0].message.content;
      } else if (this.frameworks.openai.enabled) {
        const response = await this.openai.chat.completions.create({
          model: this.frameworks.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert software architect. Analyze the following app idea and provide a detailed technical analysis.'
            },
            {
              role: 'user',
              content: `Analyze this app idea: ${prompt}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });
        
        return response.choices[0].message.content;
      } else {
        return `Analysis of: ${prompt}\n\nThis appears to be a ${this.estimateComplexity(prompt).toLowerCase()} complexity application that would benefit from a modern web architecture.`;
      }
    } catch (error) {
      console.error('Analysis error:', error);
      return `Analysis failed, but proceeding with generation based on: ${prompt}`;
    }
  }
  
  async generateWithOpenAI(prompt, _analysis) { // analysis prefixed with _
    if (!this.frameworks.openai.enabled) {
      throw new Error('OpenAI API key not configured');
    }
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.frameworks.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert full-stack developer. Generate complete, production-ready code based on the requirements. Include both frontend and backend code with proper structure and best practices.'
          },
          {
            role: 'user',
            content: `Based on this analysis:\n${_analysis}\n\nGenerate complete code for: ${prompt}` // analysis prefixed with _
          }
        ],
        max_tokens: 4000,
        temperature: 0.3,
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI generation error:', error);
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
  }
  
  async generateWithGroq(prompt, _analysis) {
    if (!this.frameworks.groq.enabled) {
      throw new Error('Groq API key not configured');
    }
    
    try {
      const response = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert developer. Generate clean, efficient code based on the requirements.'
          },
          {
            role: 'user',
            content: `Based on this analysis:\n${_analysis}\n\nGenerate code for: ${prompt}`
          }
        ],
        model: this.frameworks.groq.model,
        max_tokens: 3000,
        temperature: 0.3,
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Groq generation error:', error);
      throw new Error(`Groq generation failed: ${error.message}`);
    }
  }
  
  async generateWithCrewAI(prompt, _analysis) { // analysis prefixed with _
    // Mock CrewAI implementation
    await this.delay(2000); // Simulate processing time
    
    return {
      agents: [
        {
          role: 'Frontend Developer',
          goal: 'Create responsive user interface',
          backstory: 'Experienced in React and modern frontend technologies',
          output: 'Generated React components with TypeScript and Tailwind CSS'
        },
        {
          role: 'Backend Developer',
          goal: 'Build robust API and database layer',
          backstory: 'Expert in Node.js and database design',
          output: 'Created Express.js API with PostgreSQL integration'
        },
        {
          role: 'DevOps Engineer',
          goal: 'Setup deployment and CI/CD',
          backstory: 'Specialized in containerization and cloud deployment',
          output: 'Configured Docker and deployment scripts'
        }
      ],
      tasks: [
        {
          description: 'Design and implement user interface',
          agent: 'Frontend Developer',
          result: 'Completed responsive UI with modern design patterns'
        },
        {
          description: 'Develop API endpoints and database schema',
          agent: 'Backend Developer',
          result: 'Implemented RESTful API with proper validation'
        }
      ],
      finalOutput: `CrewAI multi-agent system successfully generated a complete application for: ${prompt}`
    };
  }
  
  async generateWithMetaGPT(prompt, _analysis) {
    // Mock MetaGPT implementation
    await this.delay(1500);
    
    return {
      documentation: {
        requirements: `Requirements Document for: ${prompt}\n\nFunctional Requirements:\n- User authentication\n- Data management\n- Responsive design\n\nNon-functional Requirements:\n- Performance\n- Security\n- Scalability`,
        architecture: 'Microservices architecture with React frontend, Node.js backend, and PostgreSQL database',
        api: 'RESTful API documentation with OpenAPI specification',
        userGuide: 'Comprehensive user guide with screenshots and tutorials'
      },
      codeStructure: {
        files: [
          {
            path: 'src/components/App.tsx',
            content: '// Main application component\nimport React from "react";\n\nfunction App() {\n  return <div>Generated App</div>;\n}',
            type: 'component'
          },
          {
            path: 'backend/server.js',
            content: '// Express server\nconst express = require("express");\nconst app = express();\n\napp.listen(3000);',
            type: 'service'
          }
        ]
      }
    };
  }
  
  async generateWithAutoGen(prompt, _analysis) { // analysis prefixed with _
    // Mock AutoGen implementation
    await this.delay(2500);
    
    return {
      conversation: [
        {
          agent: 'User Proxy',
          message: `I need to build: ${prompt}`,
          timestamp: new Date().toISOString()
        },
        {
          agent: 'Assistant',
          message: 'I understand. Let me break this down into components.',
          timestamp: new Date().toISOString()
        },
        {
          agent: 'Code Reviewer',
          message: 'The proposed architecture looks good. I suggest adding error handling.',
          timestamp: new Date().toISOString()
        }
      ],
      finalCode: `// AutoGen Generated Code for: ${prompt}\n\nclass Application {\n  constructor() {\n    this.init();\n  }\n\n  init() {\n    console.log('Application initialized');\n  }\n}`,
      iterations: 3,
      improvements: [
        'Added error handling',
        'Improved code structure',
        'Enhanced performance'
      ]
    };
  }
  
  async generateWithLangChain(prompt, _analysis) { // Renamed from AutoGen, analysis already _
    // Mock LangChain implementation
    await this.delay(3000);
    
    return {
      workflow: {
        steps: [
          {
            name: 'Requirement Analysis',
            input: prompt,
            output: 'Analyzed requirements and identified key components',
            tool: 'LLM Chain'
          },
          {
            name: 'Architecture Design',
            input: 'Component requirements',
            output: 'Designed system architecture',
            tool: 'Sequential Chain'
          },
          {
            name: 'Code Generation',
            input: 'Architecture design',
            output: 'Generated application code',
            tool: 'Code Generation Chain'
          }
        ]
      },
      chains: [
        {
          type: 'LLMChain',
          description: 'Primary reasoning chain for code generation',
          result: 'Successfully generated code structure'
        },
        {
          type: 'SequentialChain',
          description: 'Multi-step processing chain',
          result: 'Completed all processing steps'
        }
      ],
      finalOutput: `# LangChain Generated Application\n\n## Overview\nThis application was generated using LangChain workflows for: ${prompt}\n\n## Features\n- Modern architecture\n- Scalable design\n- Best practices implementation`
    };
  }
  
  estimateComplexity(prompt) {
    const complexityKeywords = {
      high: ['machine learning', 'ai', 'real-time', 'microservices', 'blockchain', 'payment', 'analytics'],
      medium: ['authentication', 'database', 'api', 'dashboard', 'admin', 'notification'],
      low: ['simple', 'basic', 'todo', 'calculator', 'static']
    };
    
    const lowerPrompt = prompt.toLowerCase();
    
    if (complexityKeywords.high.some(keyword => lowerPrompt.includes(keyword))) {
      return 'High';
    } else if (complexityKeywords.medium.some(keyword => lowerPrompt.includes(keyword))) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  getFrameworkStatus() {
    return Object.keys(this.frameworks).reduce((status, key) => {
      status[key] = this.frameworks[key].enabled;
      return status;
    }, {});
  }
  
  async testFramework(frameworkId) {
    if (!this.frameworks[frameworkId]) {
      throw new Error('Framework not found');
    }
    
    try {
      switch (frameworkId) {
        case 'openai':
          if (!this.frameworks.openai.enabled) return false;
          await this.openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 5
          });
          return true;
          
        case 'groq':
          if (!this.frameworks.groq.enabled) return false;
          await this.groq.chat.completions.create({
            messages: [{ role: 'user', content: 'test' }],
            model: 'llama3-8b-8192',
            max_tokens: 5
          });
          return true;
          
        default:
          return this.frameworks[frameworkId].enabled;
      }
    } catch (error) {
      console.error(`Framework test failed for ${frameworkId}:`, error);
      return false;
    }
  }
}

module.exports = new AIFrameworkService();
