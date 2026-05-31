// hooks/useChat.js
// Shared chat logic used by ChatColumn and Composer.
// Manages the message list, sending, loading state, and per-conversation
// persistence to IndexedDB (see services/conversations.js).

import { useState, useRef } from "react";
import { sendMessage } from "../services/api";
import {
  saveConversation,
  getConversation,
  deriveTitle,
} from "../services/conversations";

function newId() {
  return crypto?.randomUUID?.() ?? `c-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

export function useChat({ tutor }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Conversation identity lives in refs so it's stable across renders and
  // available synchronously when persisting right after a send.
  const convoIdRef = useRef(null);
  const createdAtRef = useRef(null);

  // Write the conversation, creating its id lazily on the first message so
  // empty chats never litter history.
  async function persist(msgs) {
    if (!convoIdRef.current) {
      convoIdRef.current = newId();
      createdAtRef.current = Date.now();
    }
    await saveConversation({
      id: convoIdRef.current,
      tutorId: tutor?.id,
      title: deriveTitle(msgs),
      messages: msgs,
      bookmarked: isBookmarked,
      createdAt: createdAtRef.current,
      updatedAt: Date.now(),
    });
  }

  async function handleSend(text, attachment = null) {
    if (!text.trim() && !attachment) return;

    // Add the user message immediately (optimistic update)
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
      attachment,
    };
    const afterUser = [...messages, userMsg];
    setMessages(afterUser);
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
      const afterReply = [...afterUser, tutorMsg];
      setMessages(afterReply);
      persist(afterReply);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Load a stored conversation into the chat. Returns its tutorId so the
  // caller can switch the active tutor to match.
  async function loadConversation(id) {
    const convo = await getConversation(id);
    if (!convo) return null;
    convoIdRef.current = convo.id;
    createdAtRef.current = convo.createdAt;
    setMessages(convo.messages ?? []);
    setIsBookmarked(!!convo.bookmarked);
    setError(null);
    return convo.tutorId ?? null;
  }

  // Flip the bookmark on the current conversation. Re-reads then writes only
  // the flag so updatedAt / order aren't disturbed by a bookmark toggle.
  async function toggleBookmark() {
    if (!convoIdRef.current) return;
    const next = !isBookmarked;
    setIsBookmarked(next);
    const convo = await getConversation(convoIdRef.current);
    if (convo) await saveConversation({ ...convo, bookmarked: next });
  }

  function startNew() {
    convoIdRef.current = null;
    createdAtRef.current = null;
    setMessages([]);
    setIsBookmarked(false);
    setError(null);
  }

  return {
    messages,
    isLoading,
    error,
    isBookmarked,
    currentConversationId: convoIdRef.current,
    handleSend,
    loadConversation,
    toggleBookmark,
    startNew,
  };
}
