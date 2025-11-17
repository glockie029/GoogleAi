
import React, { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import Spinner from './Spinner';
import { PlayIcon, PauseIcon } from './icons/MediaIcons';

const Meditate: React.FC = () => {
  const [script, setScript] = useState('Close your eyes and take a deep breath. Feel the air fill your lungs. As you exhale, let go of all tension.');
  const [error, setError] = useState<string | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const { isPlaying, isLoading, playAudio, stopAudio } = useAudioPlayer();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAndPlay = async () => {
    if (!script.trim()) {
      setError('Please enter a meditation script.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    
    // Stop any currently playing audio before generating new one
    if (isPlaying) {
      stopAudio();
    }
    
    try {
      const audioB64 = await generateSpeech(script);
      setGeneratedAudio(audioB64);
      await playAudio(audioB64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
        stopAudio();
    } else if (generatedAudio) {
        playAudio(generatedAudio);
    }
  };

  const isBusy = isLoading || isGenerating;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold text-cyan-300 mb-2">Create Your Meditation</h2>
        <p className="text-slate-400">Enter a script, and we'll generate a soothing voiceover to guide your session.</p>
      </div>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="e.g., Imagine a peaceful forest..."
        className="w-full h-40 p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
        rows={5}
        disabled={isBusy}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerateAndPlay}
          disabled={isBusy}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isBusy ? <Spinner /> : 'Generate & Play'}
        </button>
        {generatedAudio && (
            <button
                onClick={handlePlayPause}
                disabled={isBusy && !isPlaying}
                className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50"
                aria-label={isPlaying ? 'Stop' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
        )}
      </div>
    </div>
  );
};

export default Meditate;
