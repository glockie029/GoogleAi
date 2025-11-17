
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';
import { VisualizeIcon } from './icons/FeatureIcons';

const Visualize: React.FC = () => {
  const [prompt, setPrompt] = useState('A tranquil beach at sunset, with calm waves gently lapping the shore.');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to visualize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold text-cyan-300 mb-2">Visualize Your Calm</h2>
        <p className="text-slate-400">Describe a peaceful scene, and our AI will create a unique visual for your meditation.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A misty mountain morning"
          className="flex-grow p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? <Spinner /> : 'Generate'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="mt-4 w-full aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden">
        {isLoading && <Spinner size="lg" />}
        {!isLoading && !imageUrl && (
          <div className="text-center text-slate-500 p-4">
            <VisualizeIcon className="w-16 h-16 mx-auto mb-4" />
            <p>Your generated image will appear here.</p>
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-full object-cover animate-fade-in"
          />
        )}
      </div>
    </div>
  );
};

export default Visualize;
