"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE, type ChatMessage } from "@/lib/api";

interface UseSocketOptions {
  chatId: string | null;
  onNewMessage?: (message: ChatMessage) => void;
  onMessageEdited?: (message: ChatMessage) => void;
  onMessageDeleted?: (data: { id: string }) => void;
  onUserTyping?: (data: { userId: string; isTyping: boolean }) => void;
}

export function useSocket({
  chatId,
  onNewMessage,
  onMessageEdited,
  onMessageDeleted,
  onUserTyping,
}: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    if (!chatId) {
      setConnected(false);
      return;
    }

    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [chatId]);


  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId || !connected) return;

    socket.emit("join-chat", { chatId });

    return () => {
      socket.emit("leave-chat", { chatId });
    };
  }, [chatId, connected]);


  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      onNewMessage?.(message);
    };
    const handleMessageEdited = (message: ChatMessage) => {
      onMessageEdited?.(message);
    };
    const handleMessageDeleted = (data: { id: string }) => {
      onMessageDeleted?.(data);
    };
    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      onUserTyping?.(data);
    };

    socket.on("new-message", handleNewMessage);
    socket.on("message-edited", handleMessageEdited);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("message-edited", handleMessageEdited);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("user-typing", handleUserTyping);
    };
  }, [onNewMessage, onMessageEdited, onMessageDeleted, onUserTyping]);

  const sendMessage = useCallback(
    (userId: string, content: string, targetId?: string) => {
      const socket = socketRef.current;
      if (!socket || !chatId) return;
      socket.emit("send-message", {
        chatId,
        message: { userId, content, targetId },
      });
    },
    [chatId]
  );

  const editMessage = useCallback(
    (messageId: string, content: string) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.emit("edit-message", {
        messageId,
        update: { content },
      });
    },
    []
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.emit("delete-message", { messageId });
    },
    []
  );

  const sendTyping = useCallback(
    (userId: string, isTyping: boolean) => {
      const socket = socketRef.current;
      if (!socket || !chatId) return;
      socket.emit("typing", { chatId, userId, isTyping });
    },
    [chatId]
  );

  return {
    connected,
    sendMessage,
    editMessage,
    deleteMessage,
    sendTyping,
  };
}
