import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';
import PromptInput from './PromptInput';
import FrameworkSelector from './FrameworkSelector';
import CodePreview from './CodePreview';
import ProgressIndicator from './ProgressIndicator';
import { generateApp } from '../services/api';
import { AIFramework, GenerationResult, ProgressUpdate } from '../types';

const AppBuilder: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<AIFramework[]>([]);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize WebSocket connection (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('generation-progress', (data: ProgressUpdate) => {
        setProgress(data);
      });

      newSocket.on('generation-complete', (data: GenerationResult) => {
        setGenerationResult(data);
        setIsGenerating(false);
        toast.success('App generated successfully!');
      });

      newSocket.on('generation-error', (error: string) => {
        setIsGenerating(false);
        toast.error(`Generation failed: ${error}`);
      });

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const generateAppMutation = useMutation({
    mutationFn: generateApp,
    onSuccess: (data) => {
      setGenerationResult(data);
      setIsGenerating(false);
      toast.success('App generated successfully!');
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast.error(`Generation failed: ${error.message}`);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description for your app');
      return;
    }

    if (selectedFrameworks.length === 0) {
      toast.error('Please select at least one AI framework');
      return;
    }

    setIsGenerating(true);
    setProgress(null);
    setGenerationResult(null);

    // In production, we only use REST API (no WebSocket)
    if (process.env.NODE_ENV === 'production') {
      // Simulate progress updates for production
      const progressSteps = [
        { stage: 'analysis', progress: 20, message: 'Analyzing your app requirements...' },
        { stage: 'framework-setup', progress: 40, message: 'Setting up AI frameworks...' },
        { stage: 'code-generation', progress: 70, message: 'Generating code...' },
        { stage: 'finalization', progress: 90, message: 'Finalizing your application...' },
      ];

      let stepIndex = 0;
      const progressInterval = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setProgress(progressSteps[stepIndex] as ProgressUpdate);
          stepIndex++;
        } else {
          clearInterval(progressInterval);
        }
      }, 2000);

      // Clear interval when generation completes
      setTimeout(() => clearInterval(progressInterval), 10000);
    } else {
      // Development mode with WebSocket
      if (socket) {
        socket.emit('start-generation', {
          prompt,
          frameworks: selectedFrameworks,
        });
      }
    }

    // Call the REST API
    generateAppMutation.mutate({
      prompt,
      frameworks: selectedFrameworks,
    });
  };

  const handleReset = () => {
    setPrompt('');
    setSelectedFrameworks([]);
    setGenerationResult(null);
    setProgress(null);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Build Apps with AI
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Describe your app idea and let our AI frameworks generate complete,
          production-ready code using OpenAI, Groq, CrewAI, MetaGPT, AutoGen, and LangChain.
        </p>
      </div>

      {/* Main Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Describe Your App
            </h3>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              disabled={isGenerating}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select AI Frameworks
            </h3>
            <FrameworkSelector
              selectedFrameworks={selectedFrameworks}
              onSelectionChange={setSelectedFrameworks}
              disabled={isGenerating}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || selectedFrameworks.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate App'}
            </button>
            <button
              onClick={handleReset}
              disabled={isGenerating}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {progress && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generation Progress
              </h3>
              <ProgressIndicator progress={progress} />
            </div>
          )}

          {generationResult && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Generated Code
              </h3>
              <CodePreview result={generationResult} />
            </div>
          )}

          {!progress && !generationResult && !isGenerating && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <p className="text-gray-500">
                Your generated code will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;
