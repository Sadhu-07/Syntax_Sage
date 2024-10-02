import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoon, FaSun, FaUndo, FaRedo, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { DiPython, DiJavascript1, DiJava, DiCss3 } from 'react-icons/di';
import './App.css';

const topLanguages = [
  "Python", "JavaScript", "Java", "C++", "C#", "TypeScript", "PHP", "Ruby", "Swift", "Go",
  "Rust", "Kotlin", "Scala", "R", "Dart", "Objective-C", "Haskell", "Lua", "Julia", "Groovy",
  "Perl", "MATLAB", "Visual Basic", "Assembly", "Fortran", "Lisp", "Ada", "Cobol", "Prolog", "F#",
  "Clojure", "Erlang", "Elixir", "OCaml", "Scheme", "Bash", "PowerShell", "SQL", "PL/SQL", "Delphi",
  "Pascal", "VBScript", "D", "SAS", "Scratch", "ABAP", "ActionScript", "Alice", "APL", "AutoHotkey"
];

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [maxLength, setMaxLength] = useState(200);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationTime, setGenerationTime] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      // User has visited before, do not show onboarding
    } else {
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

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
      
      const newCode = response.data.generated_code;
      setGeneratedCode(newCode);
      setHistory([...history.slice(0, historyIndex + 1), newCode]);
      setHistoryIndex(historyIndex + 1);
      
      if (response.data.generation_time) {
        setGenerationTime(response.data.generation_time);
      }

      checkAchievements(newCode);
    } catch (err) {
      setError('An error occurred while generating code. Please try again.');
      console.error(err);
    }

    setIsLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setPrompt(e.target.result);
      reader.readAsText(files[0]);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGeneratedCode(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGeneratedCode(history[historyIndex + 1]);
    }
  };

  const checkAchievements = (code) => {
    const newAchievements = [];
    if (code.length > 500 && !achievements.includes('Code Master')) {
      newAchievements.push('Code Master');
    }
    if (code.includes('function') && !achievements.includes('Function Ninja')) {
      newAchievements.push('Function Ninja');
    }
    setAchievements([...achievements, ...newAchievements]);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this amazing code I generated with Syntax Sage!\n\n${generatedCode.slice(0, 100)}...`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <div className="top-bar">
        <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label="Toggle dark mode">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="code-gen-container">
        <h1 className="title">Syntax Sage</h1>
        
        <form onSubmit={handleSubmit} className="code-gen-form">
          <div className="drag-drop-area" onDragOver={handleDragOver} onDrop={handleDrop}>
            <textarea
              id="prompt"
              name="prompt"
              required
              className="input large-input"
              placeholder="Enter your prompt here or drag and drop a file"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div>
            <select
              id="language"
              name="language"
              className="input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {topLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              id="maxLength"
              name="maxLength"
              type="number"
              required
              className="input"
              placeholder="Max length"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Code'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {generatedCode && (
          <div className="output-container">
            <h2>Generated Code:</h2>
            <pre className="output">{generatedCode}</pre>
            {generationTime && (
              <div className="generation-time">
                <strong>Generation Time:</strong> {generationTime} seconds
              </div>
            )}
            <div className="controls">
              <button onClick={undo} disabled={historyIndex <= 0} className="history-btn">
                <FaUndo /> Undo
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="history-btn">
                <FaRedo /> Redo
              </button>
            </div>
            <div className="social-share">
              <button onClick={shareOnTwitter} className="social-share-btn twitter">
                <FaTwitter /> Share on Twitter
              </button>
              <button className="social-share-btn facebook">
                <FaFacebook /> Share on Facebook
              </button>
              <button className="social-share-btn linkedin">
                <FaLinkedin /> Share on LinkedIn
              </button>
            </div>
          </div>
        )}

        {achievements.length > 0 && (
          <div className="achievements">
            {achievements.map((achievement, index) => (
              <span key={index} className="achievement-badge" title={achievement}>
                🏆
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
