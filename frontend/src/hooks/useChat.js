// hooks/useChat.js
// Shared chat logic used by ChatColumn and Composer.
// Manages the message list, sending, and loading state.

import { useState } from "react";
import { sendMessage } from "../services/api";

export function useChat({ tutor }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(text, attachment = null) {
    if (!text.trim() && !attachment) return;

    // Add the user message immediately (optimistic update)
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      attachment,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const attachmentPayload = attachment
        ? { data: attachment.dataUrl.split(",")[1], mediaType: attachment.mediaType }
        : null;

      const reply = await sendMessage({
        message: text,
        tutorId: tutor?.id,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
        attachment: attachmentPayload,
      });

      const tutorMsg = {
        id: Date.now() + 1,
        role: "tutor",
        content: reply,
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function clearMessages() {
    setMessages([]);
  }

  return {
    messages,
    isLoading,
    error,
    handleSend,
    clearMessages,
  };
}
