import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const examplePrompts = [
    "Create a todo app with user authentication and real-time updates",
    "Build a social media dashboard with analytics and post scheduling",
    "Develop an e-commerce platform with payment integration and inventory management",
    "Make a project management tool with team collaboration features",
    "Create a blog platform with markdown support and comment system"
  ];

  const handleExampleClick = (example: string) => {
    if (!disabled) {
      onChange(example);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          App Description
        </label>
        <textarea
          id="prompt"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Describe the app you want to build in detail. Include features, functionality, and any specific requirements..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          maxLength={2000}
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-500">
            Be specific about features, tech stack preferences, and user requirements
          </p>
          <span className="text-sm text-gray-400">
            {value.length}/2000
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Example Prompts
        </h4>
        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={disabled}
              className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {value && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Pro Tip
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  The more detailed your description, the better the AI can understand 
                  your requirements and generate appropriate code. Include information about:
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Target users and use cases</li>
                  <li>Key features and functionality</li>
                  <li>Preferred technologies or frameworks</li>
                  <li>Design preferences and UI requirements</li>
                  <li>Integration needs (APIs, databases, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptInput;
