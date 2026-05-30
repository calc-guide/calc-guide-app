// App.jsx — root component
// Owns two things only: which page is showing, and which tutor was chosen.
// All other state lives inside the page/component that needs it.

import { useState } from "react";
import Home from "./pages/Home";
import ChatLayout from "./components/ChatColumn/ChatColumn";

export default function App() {
  const [page, setPage] = useState("home");       // "home" | "chat"
  const [tutor, setTutor] = useState(null);        // selected tutor object

  function handleStart(selectedTutor) {
    setTutor(selectedTutor);
    setPage("chat");
  }

  function handleNewChat() {
    setPage("home");
    setTutor(null);
  }

  if (page === "home") {
    return <Home onStart={handleStart} />;
  }

  return <ChatLayout tutor={tutor} onNewChat={handleNewChat} />;
}
