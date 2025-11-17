
import React, { useState, useRef, useEffect } from 'react';
import { useChatRoom } from '../hooks/useChatRoom';

interface ChatRoomProps {
  roomName: string;
  onLeave: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomName, onLeave }) => {
  const { messages, sendMessage, sessionId } = useChatRoom(roomName);
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-900">
      <header className="flex items-center justify-between p-4 bg-gray-800 rounded-t-lg shadow-md">
        <div>
            <h1 className="text-xl font-bold text-cyan-400">Room: {roomName}</h1>
            <p className="text-xs text-gray-400">Your anonymous ID: {sessionId.substring(0, 8)}</p>
        </div>
        <button
          onClick={onLeave}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave
        </button>
      </header>

      <main ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-800/50 space-y-4">
        {messages.map((msg) => {
          const isSelf = msg.senderId === sessionId;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
               {!isSelf && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" title={`Anonymous ${msg.senderId.substring(0, 8)}`}></div>}
               <div
                className={`max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow ${isSelf ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <p className={`text-xs mt-1 ${isSelf ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
         {messages.length === 0 && (
            <div className="text-center text-gray-500 pt-8">
                <p>Welcome to '{roomName}'!</p>
                <p>Messages you send will appear here.</p>
                <p>Open this page in another tab to chat with yourself.</p>
            </div>
        )}
      </main>

      <footer className="p-4 bg-gray-800 rounded-b-lg shadow-md">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatRoom;
