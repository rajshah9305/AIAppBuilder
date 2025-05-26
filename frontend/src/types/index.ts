export interface AIFramework {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  pricing: 'Free' | 'Premium';
  speed: 'Very Fast' | 'Fast' | 'Medium' | 'Slow';
}

export interface GenerationRequest {
  prompt: string;
  frameworks: AIFramework[];
}

export interface GenerationResult {
  analysis?: string;
  code?: string;
  crewai?: any;
  metagpt?: any;
  autogen?: any;
  langchain?: any;
  metadata?: {
    generatedAt: string;
    frameworks: string[];
    promptLength: number;
    estimatedComplexity: 'Low' | 'Medium' | 'High';
  };
}

export interface ProgressUpdate {
  stage: 'initialization' | 'analysis' | 'framework-setup' | 'code-generation' | 'optimization' | 'finalization';
  progress: number;
  message: string;
  details?: {
    currentFramework?: string;
    completedFrameworks?: string[];
    estimatedTimeRemaining?: number;
  };
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  prompt: string;
  frameworks: AIFramework[];
  result?: GenerationResult;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generating' | 'completed' | 'error';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'pro' | 'enterprise';
  usage: {
    generationsThisMonth: number;
    maxGenerationsPerMonth: number;
    tokensUsed: number;
    maxTokensPerMonth: number;
  };
}

export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export interface WebSocketMessage {
  type: 'progress' | 'complete' | 'error' | 'status';
  data: any;
  timestamp: string;
}

// Framework-specific result types
export interface CrewAIResult {
  agents: Array<{
    role: string;
    goal: string;
    backstory: string;
    output: string;
  }>;
  tasks: Array<{
    description: string;
    agent: string;
    result: string;
  }>;
  finalOutput: string;
}

export interface MetaGPTResult {
  documentation: {
    requirements: string;
    architecture: string;
    api: string;
    userGuide: string;
  };
  codeStructure: {
    files: Array<{
      path: string;
      content: string;
      type: 'component' | 'service' | 'config' | 'test';
    }>;
  };
}

export interface AutoGenResult {
  conversation: Array<{
    agent: string;
    message: string;
    timestamp: string;
  }>;
  finalCode: string;
  iterations: number;
  improvements: string[];
}

export interface LangChainResult {
  workflow: {
    steps: Array<{
      name: string;
      input: string;
      output: string;
      tool: string;
    }>;
  };
  chains: Array<{
    type: string;
    description: string;
    result: string;
  }>;
  finalOutput: string;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  websocket: {
    url: string;
    reconnectAttempts: number;
    reconnectDelay: number;
  };
  features: {
    enableRealTimeUpdates: boolean;
    enableCodeDownload: boolean;
    enableProjectSaving: boolean;
    maxPromptLength: number;
    maxFrameworksPerGeneration: number;
  };
}

// Utility types
export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';
export type FrameworkId = 'openai' | 'groq' | 'crewai' | 'metagpt' | 'autogen' | 'langchain';
export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'rust';

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: CodeLanguage;
  size: number;
}

export interface GeneratedApp {
  name: string;
  description: string;
  files: CodeFile[];
  dependencies: {
    [key: string]: string;
  };
  scripts: {
    [key: string]: string;
  };
  readme: string;
  license: string;
}
