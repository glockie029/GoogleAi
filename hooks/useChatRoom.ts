
import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

const sessionId = crypto.randomUUID();

export const useChatRoom = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Create a new BroadcastChannel for the given room ID.
    channelRef.current = new BroadcastChannel(roomId);

    const handleMessage = (event: MessageEvent<ChatMessage>) => {
      // Ignore messages from the current session/tab.
      if (event.data.senderId !== sessionId) {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    // Listen for messages from other tabs.
    channelRef.current.addEventListener('message', handleMessage);

    // Cleanup function to close the channel when the component unmounts or the room changes.
    return () => {
      channelRef.current?.removeEventListener('message', handleMessage);
      channelRef.current?.close();
    };
  }, [roomId]);

  const sendMessage = (text: string) => {
    if (!text.trim() || !channelRef.current) {
      return;
    }

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: text.trim(),
      roomId,
      senderId: sessionId,
      timestamp: new Date().toISOString(),
    };

    // Post the message to other tabs.
    channelRef.current.postMessage(newMessage);

    // Add the message to the current tab's state.
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return { messages, sendMessage, sessionId };
};
