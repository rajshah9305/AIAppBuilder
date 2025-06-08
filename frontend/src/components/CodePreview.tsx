import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GenerationResult } from '../types';

interface CodePreviewProps {
  result: GenerationResult;
}

const CodePreview: React.FC<CodePreviewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: '🔍' },
    { id: 'code', label: 'Generated Code', icon: '💻' },
    { id: 'crewai', label: 'CrewAI Output', icon: '👥' },
    { id: 'metagpt', label: 'MetaGPT Docs', icon: '📋' },
    { id: 'autogen', label: 'AutoGen Result', icon: '🔄' },
    { id: 'langchain', label: 'LangChain Flow', icon: '🔗' },
  ];

  const handleCopy = async (content: string, section: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (_err) { // err prefixed with _
      // console.error('Failed to copy:', _err); // Commented out for linting
    }
  };

  const renderContent = (content: string, language: string = 'javascript') => {
    if (!content) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No content available for this section</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => handleCopy(content, activeTab)}
            className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
          >
            {copiedSection === activeTab ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          showLineNumbers
          wrapLines
        >
          {content}
        </SyntaxHighlighter>
      </div>
    );
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return renderContent(result.analysis || '', 'markdown');
      case 'code':
        return renderContent(result.code || '', 'javascript');
      case 'crewai':
        return renderContent(
          typeof result.crewai === 'string' 
            ? result.crewai 
            : JSON.stringify(result.crewai, null, 2), 
          'json'
        );
      case 'metagpt':
        return renderContent(
          typeof result.metagpt === 'string' 
            ? result.metagpt 
            : JSON.stringify(result.metagpt, null, 2), 
          'markdown'
        );
      case 'autogen':
        return renderContent(
          typeof result.autogen === 'string' 
            ? result.autogen 
            : JSON.stringify(result.autogen, null, 2), 
          'javascript'
        );
      case 'langchain':
        return renderContent(
          typeof result.langchain === 'string' 
            ? result.langchain 
            : JSON.stringify(result.langchain, null, 2), 
          'python'
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  const downloadCode = () => {
    const content = result.code || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-app.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const allContent = {
      analysis: result.analysis,
      code: result.code,
      crewai: result.crewai,
      metagpt: result.metagpt,
      autogen: result.autogen,
      langchain: result.langchain,
    };
    
    const content = JSON.stringify(allContent, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-app-complete.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={downloadCode}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Download Code
          </button>
          <button
            onClick={downloadAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Download All
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          Generated by {Object.keys(result).filter(key => result[key as keyof GenerationResult]).length} AI frameworks
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {getTabContent()}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {result.code?.split('\n').length || 0}
          </div>
          <div className="text-sm text-blue-800">Lines of Code</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {result.analysis?.split(' ').length || 0}
          </div>
          <div className="text-sm text-green-800">Analysis Words</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {Object.keys(result).filter(key => result[key as keyof GenerationResult]).length}
          </div>
          <div className="text-sm text-purple-800">AI Frameworks</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {Math.ceil((result.code?.length || 0) / 1000)}K
          </div>
          <div className="text-sm text-orange-800">Characters</div>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
