// components/ChatColumn/ChatColumn.jsx
// Assembles the full chat layout: rail + drawer + chat column.
// All state for the layout lives here.

import { useState } from "react";
import "./ChatColumn.css";
import Rail from "../Rail/Rail";
import Drawer from "../Drawer/Drawer";
import ChatHeader from "./ChatHeader";
import MessageThread from "./MessageThread";
import Composer from "./Composer/Composer";
import { useChat } from "../../hooks/useChat";

export default function ChatColumn({ tutor, onNewChat }) {
  // Rail + drawer state
  const [activeRail, setActiveRail]   = useState("new");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerTab, setDrawerTab]     = useState("history");

  // Chat header state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Chat messages from hook
  const { messages, isLoading, handleSend } = useChat({ tutor });

  // Rail click: "history" and "bookmarks" open the drawer
  // clicking the same active rail item closes it
  function handleRailSelect(id) {
    if (id === "new") {
      onNewChat();
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

  function handleDrawerTabChange(tab) {
    setDrawerTab(tab);
    setActiveRail(tab);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setActiveRail("new");
  }

  function handleSendMessage(text, attachment) {
    if (showOnboarding) setShowOnboarding(false);
    handleSend(text, attachment);
  }

  return (
    <div className="app-layout">
      <Rail activeItem={activeRail} onSelect={handleRailSelect} />

      <Drawer
        open={drawerOpen}
        activeTab={drawerTab}
        onTabChange={handleDrawerTabChange}
        onClose={handleCloseDrawer}
        onSelectConvo={(item) => console.log("open convo:", item)}
      />

      <div className="chat-column">
        <ChatHeader
          tutor={tutor}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => setIsBookmarked((v) => !v)}
        />

        <MessageThread
          messages={messages}
          isLoading={isLoading}
          showOnboarding={showOnboarding}
        />

        <Composer
          tutorName={tutor?.name}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
