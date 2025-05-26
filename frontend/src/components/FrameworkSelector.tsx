import React from 'react';
import { AIFramework } from '../types';

interface FrameworkSelectorProps {
  selectedFrameworks: AIFramework[];
  onSelectionChange: (frameworks: AIFramework[]) => void;
  disabled?: boolean;
}

const availableFrameworks: AIFramework[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Advanced language model for high-quality code generation and complex reasoning',
    icon: '🤖',
    capabilities: ['Code Generation', 'Documentation', 'Testing', 'Debugging'],
    pricing: 'Premium',
    speed: 'Medium',
  },
  {
    id: 'groq',
    name: 'Groq LLaMA',
    description: 'Ultra-fast inference for rapid prototyping and real-time code analysis',
    icon: '⚡',
    capabilities: ['Fast Analysis', 'Code Review', 'Quick Prototyping'],
    pricing: 'Free',
    speed: 'Very Fast',
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    description: 'Multi-agent system for collaborative development with specialized roles',
    icon: '👥',
    capabilities: ['Multi-Agent Development', 'Role-Based Tasks', 'Collaboration'],
    pricing: 'Free',
    speed: 'Medium',
  },
  {
    id: 'metagpt',
    name: 'MetaGPT',
    description: 'Automated software development with comprehensive documentation',
    icon: '📋',
    capabilities: ['Documentation', 'Architecture Design', 'Project Planning'],
    pricing: 'Free',
    speed: 'Medium',
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    description: 'Conversational AI agents for iterative development and problem-solving',
    icon: '🔄',
    capabilities: ['Iterative Development', 'Problem Solving', 'Code Refinement'],
    pricing: 'Free',
    speed: 'Medium',
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Complex AI workflows and chain-of-thought reasoning for sophisticated apps',
    icon: '🔗',
    capabilities: ['Complex Workflows', 'Chain Reasoning', 'Integration'],
    pricing: 'Free',
    speed: 'Slow',
  },
];

const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({
  selectedFrameworks,
  onSelectionChange,
  disabled = false,
}) => {
  const handleFrameworkToggle = (framework: AIFramework) => {
    if (disabled) return;

    const isSelected = selectedFrameworks.some(f => f.id === framework.id);
    
    if (isSelected) {
      onSelectionChange(selectedFrameworks.filter(f => f.id !== framework.id));
    } else {
      onSelectionChange([...selectedFrameworks, framework]);
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'Very Fast': return 'text-green-600 bg-green-100';
      case 'Fast': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Slow': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free': return 'text-green-600 bg-green-100';
      case 'Premium': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {availableFrameworks.map((framework) => {
          const isSelected = selectedFrameworks.some(f => f.id === framework.id);
          
          return (
            <div
              key={framework.id}
              onClick={() => handleFrameworkToggle(framework)}
              className={`
                relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{framework.icon}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {framework.name}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPricingColor(framework.pricing)}`}>
                        {framework.pricing}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSpeedColor(framework.speed)}`}>
                        {framework.speed}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {framework.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {framework.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedFrameworks.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Selected Frameworks ({selectedFrameworks.length})
              </h3>
              <div className="mt-1 text-sm text-green-700">
                <p>
                  {selectedFrameworks.map(f => f.name).join(', ')} will collaborate to generate your app.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameworkSelector;
