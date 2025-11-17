
import React, { useState } from 'react';
import Lobby from './components/Lobby';
import ChatRoom from './components/ChatRoom';

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  const handleJoinRoom = (roomName: string) => {
    setCurrentRoom(roomName);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {!currentRoom ? (
        <Lobby onJoin={handleJoinRoom} />
      ) : (
        <ChatRoom roomName={currentRoom} onLeave={handleLeaveRoom} />
      )}
    </div>
  );
};

export default App;
