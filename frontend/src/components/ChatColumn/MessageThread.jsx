// components/ChatColumn/MessageThread.jsx

import { useEffect, useRef } from "react";
import OnboardingCard from "./messages/OnboardingCard";
import TutorMessage from "./messages/TutorMessage";
import UserMessage from "./messages/UserMessage";
import QuizCard from "./messages/QuizCard";

export default function MessageThread({ messages, isLoading, showOnboarding }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-scroll">
      <div className="thread">
        <OnboardingCard visible={showOnboarding} />

        {messages.map((msg) => {
          if (msg.role === "tutor") {
            return (
              <TutorMessage
                key={msg.id}
                tutorName={msg.tutorName}
                content={msg.content}
                showDiagram={msg.showDiagram}
              />
            );
          }
          if (msg.role === "user") {
            return (
              <UserMessage
                key={msg.id}
                content={msg.content}
                attachment={msg.attachment}
              />
            );
          }
          if (msg.role === "quiz") {
            return (
              <QuizCard
                key={msg.id}
                question={msg.question}
                choices={msg.choices}
                onSubmit={msg.onSubmit}
              />
            );
          }
          return null;
        })}

        {isLoading && (
          <div className="chat-loading">
            <span className="av" aria-hidden="true" />
            <div className="loading-dots" role="status" aria-label="Tutor is typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
