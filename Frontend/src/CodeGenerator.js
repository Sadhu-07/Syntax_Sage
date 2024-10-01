import React, { useState } from 'react';
import axios from 'axios';

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [maxLength, setMaxLength] = useState(200);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationTime, setGenerationTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedCode('');
    setGenerationTime('');

    try {
      const response = await axios.post('http://localhost:5000/generate', {
        prompt,
        language,
        max_length: maxLength,
      });
      
      setGeneratedCode(response.data.generated_code);
      
      if (response.data.generation_time) {
        setGenerationTime(response.data.generation_time);
      }
    } catch (err) {
      setError('An error occurred while generating code. Please try again.');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">SyntaxSage</h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="prompt" className="sr-only">Prompt</label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your prompt here"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="language" className="sr-only">Language</label>
                  <select
                    id="language"
                    name="language"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="c++">C++</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="maxLength" className="sr-only">Max Length</label>
                  <input
                    id="maxLength"
                    name="maxLength"
                    type="number"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Max length"
                    value={maxLength}
                    onChange={(e) => setMaxLength(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Code'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 text-red-600">{error}</div>
            )}

            {generatedCode && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900">Generated Code:</h2>
                <pre className="mt-2 bg-gray-50 rounded-md p-4 overflow-x-auto text-sm text-gray-700">
                  {generatedCode}
                </pre>
                {generationTime && (
                  <div className="mt-2 text-sm text-gray-500">
                    <strong>Generation Time:</strong> {generationTime} seconds
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}