import React from 'react';
import { ProgressUpdate } from '../types';

interface ProgressIndicatorProps {
  progress: ProgressUpdate;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  const stages = [
    { id: 'initialization', label: 'Initializing', icon: '🚀' },
    { id: 'analysis', label: 'Analyzing Prompt', icon: '🔍' },
    { id: 'framework-setup', label: 'Setting up AI Frameworks', icon: '⚙️' },
    { id: 'code-generation', label: 'Generating Code', icon: '💻' },
    { id: 'optimization', label: 'Optimizing Output', icon: '⚡' },
    { id: 'finalization', label: 'Finalizing', icon: '✅' },
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === progress.stage);
  };

  const currentStageIndex = getCurrentStageIndex();

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm text-gray-500">
            {progress.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">
              {progress.message}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              AI frameworks are working together to generate your application...
            </p>
          </div>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Generation Stages</h4>
        <div className="space-y-2">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                  ${isCompleted ? 'bg-green-50 border border-green-200' : ''}
                  ${isCurrent ? 'bg-blue-50 border border-blue-200' : ''}
                  ${isPending ? 'bg-gray-50 border border-gray-200' : ''}
                `}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-sm
                      ${isCompleted ? 'bg-green-100 text-green-600' : ''}
                      ${isCurrent ? 'bg-blue-100 text-blue-600' : ''}
                      ${isPending ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : isCurrent ? (
                      <div className="animate-pulse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      </div>
                    ) : (
                      <span>{stage.icon}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className={`
                      text-sm font-medium
                      ${isCompleted ? 'text-green-900' : ''}
                      ${isCurrent ? 'text-blue-900' : ''}
                      ${isPending ? 'text-gray-500' : ''}
                    `}
                  >
                    {stage.label}
                  </div>
                  {isCurrent && (
                    <div className="text-xs text-blue-700 mt-1">
                      In progress...
                    </div>
                  )}
                  {isCompleted && (
                    <div className="text-xs text-green-700 mt-1">
                      Completed
                    </div>
                  )}
                </div>
                {isCurrent && (
                  <div className="flex-shrink-0">
                    <div className="animate-spin">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Time */}
      <div className="text-center">
        <div className="text-sm text-gray-500">
          Estimated time remaining: {Math.max(0, Math.ceil((100 - progress.progress) / 10))} minutes
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Time may vary based on complexity and selected AI frameworks
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
