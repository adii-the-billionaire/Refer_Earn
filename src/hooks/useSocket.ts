import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { EarningsUpdate } from '../types';

export const useSocket = (userId?: string, onEarningsUpdate?: (data: EarningsUpdate) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Connect to Socket.io server
    socketRef.current = io('http://localhost:5000');

    // Join user-specific room
    socketRef.current.emit('join-user-room', userId);

    // Listen for earnings updates
    if (onEarningsUpdate) {
      socketRef.current.on('earnings-update', onEarningsUpdate);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, onEarningsUpdate]);

  return socketRef.current;
};