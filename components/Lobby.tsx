
import React, { useState } from 'react';

interface LobbyProps {
  onJoin: (roomName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [roomName, setRoomName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      onJoin(roomName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-2 text-cyan-400">WhisperNet</h1>
        <p className="text-gray-400 mb-8">Anonymous, ephemeral chat rooms.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter a room name"
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
            autoFocus
          />
          <button
            type="submit"
            disabled={!roomName.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Create or Join Room
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-8">
            Rooms are not persistent. Communication is handled locally in your browser between tabs.
        </p>
      </div>
    </div>
  );
};

export default Lobby;
