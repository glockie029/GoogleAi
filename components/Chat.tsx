
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
// FIX: Removed unused ChatMessage import which was causing type errors.
// import { ChatMessage } from '../types';
import Spinner from './Spinner';

// FIX: Added a local interface for AI chat messages to distinguish from the user-to-user ChatMessage type.
interface Message {
  role: 'user' | 'model';
  content: string;
}

const Chat: React.FC = () => {
  const [chat, setChat] = useState<GeminiChat | null>(null);
  // FIX: Used the correct Message interface for the messages state.
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    const initChat = () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are a calm, empathetic, and knowledgeable meditation and mindfulness guide. Your name is Kai. Keep your responses concise, supportive, and focused on helping the user find peace and clarity.',
        },
      });
      setChat(chatSession);
      // FIX: The initial message now correctly matches the Message interface.
      setMessages([{ role: 'model', content: "Greetings. I am Kai, your guide to mindfulness. How can I help you find your center today?" }]);
    };
    initChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    // FIX: The new user message now correctly matches the Message interface.
    const newUserMessage: Message = { role: 'user', content: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: userInput });
      // FIX: The new model message now correctly matches the Message interface.
      const modelMessage: Message = { role: 'model', content: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get a response.');
      const userMessageIndex = messages.length;
      setMessages(prev => prev.slice(0, userMessageIndex + 1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] animate-fade-in">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Chat with Your Guide</h2>
        <div className="flex-grow overflow-y-auto pr-4 space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            {messages.map((msg, index) => (
                // FIX: Property 'role' is now correctly accessed from the Message object.
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {/* FIX: Property 'role' is now correctly accessed from the Message object. */}
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                        {/* FIX: Property 'content' is now correctly accessed from the Message object. */}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none flex items-center">
                        <Spinner />
                        <span className="ml-2">Kai is thinking...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-4">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask for guidance..."
                className="flex-grow p-3 bg-slate-900/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
                disabled={isLoading || !chat}
            />
            <button
                type="submit"
                disabled={isLoading || !userInput.trim() || !chat}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Send
            </button>
        </form>
    </div>
  );
};

export default Chat;
