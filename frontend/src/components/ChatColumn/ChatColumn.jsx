// components/ChatColumn/ChatColumn.jsx

import { useState } from "react";
import "./ChatColumn.css";
import Rail from "../Rail/Rail";
import Drawer from "../Drawer/Drawer";
import TutorSelector from "../TutorSelector/TutorSelector";
import ChatHeader from "./ChatHeader";
import MessageThread from "./MessageThread";
import Composer from "./Composer/Composer";
import { useChat } from "../../hooks/useChat";

export default function ChatColumn({ tutor, onNewChat }) {
  const [activeRail, setActiveRail]     = useState("new");
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [drawerTab, setDrawerTab]       = useState("history");
  const [currentTutor, setCurrentTutor] = useState(tutor);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const { messages, isLoading, handleSend } = useChat({ tutor: currentTutor });

  function handleRailSelect(id) {
    if (id === "new") {
      onNewChat();
      return;
    }
    if (id === "tutor") {
      setActiveRail((prev) => prev === "tutor" ? "new" : "tutor");
      setDrawerOpen(false);
      return;
    }
    if (id === "history" || id === "bookmarks") {
      if (activeRail === id && drawerOpen) {
        setDrawerOpen(false);
        setActiveRail("new");
      } else {
        setDrawerTab(id);
        setDrawerOpen(true);
        setActiveRail(id);
      }
      return;
    }
    setActiveRail(id);
    setDrawerOpen(false);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setActiveRail("new");
  }

  function handleTutorChange(newTutor) {
    setCurrentTutor(newTutor);
    setActiveRail("new");
  }

  function handleSendMessage(text, attachment) {
    if (showOnboarding) setShowOnboarding(false);
    handleSend(text, attachment);
  }

  return (
    <div className="app-layout">
      <Rail activeItem={activeRail} onSelect={handleRailSelect} />

      {activeRail === "tutor" && (
        <div className="tutor-selector-popup">
          <TutorSelector
            selectedTutor={currentTutor}
            onChange={handleTutorChange}
          />
        </div>
      )}

      <Drawer
        open={drawerOpen}
        activeTab={drawerTab}
        onClose={handleCloseDrawer}
        onSelectConvo={(item) => console.log("open convo:", item)}
      />

      <div className="chat-column">
        <ChatHeader
          tutor={currentTutor}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => setIsBookmarked((v) => !v)}
          hasMessages={messages.length > 0}
          onNewChat={onNewChat}
        />

        <MessageThread
          messages={messages}
          isLoading={isLoading}
          showOnboarding={showOnboarding}
        />

        <Composer
          tutorName={currentTutor?.name}
          onSend={handleSendMessage}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}