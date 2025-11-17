import { useState, useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

// This is a browser-only feature.
// FIX: Cast window to `any` to allow access to the vendor-prefixed `webkitAudioContext` for older browsers without causing a TypeScript error.
const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize AudioContext on the client side
    if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    
    return () => {
      // Cleanup on unmount
      sourceNodeRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  const playAudio = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) return;
    setIsLoading(true);
    
    // Stop any currently playing audio
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    
    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    try {
      const decodedData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioContextRef.current, 24000, 1);
      
      const newSource = audioContextRef.current.createBufferSource();
      newSource.buffer = audioBuffer;
      newSource.connect(audioContextRef.current.destination);
      newSource.start();
      
      newSource.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };

      sourceNodeRef.current = newSource;
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const pauseAudio = useCallback(() => {
    if (audioContextRef.current && isPlaying) {
      audioContextRef.current.suspend().then(() => setIsPlaying(false));
    }
  }, [isPlaying]);

  const resumeAudio = useCallback(() => {
    if (audioContextRef.current && !isPlaying) {
      audioContextRef.current.resume().then(() => setIsPlaying(true));
    }
  }, [isPlaying]);
  
  const stopAudio = useCallback(() => {
      if (sourceNodeRef.current) {
          sourceNodeRef.current.stop();
          setIsPlaying(false);
          sourceNodeRef.current = null;
      }
  }, []);

  return { isPlaying, isLoading, playAudio, pauseAudio, resumeAudio, stopAudio };
};
