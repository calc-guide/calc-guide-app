// components/ChatColumn/Composer/Composer.jsx

import { useState } from "react";
import "./Composer.css";
import AttachmentChip from "./AttachmentChip";
import VoiceListeningBanner from "./VoiceListeningBanner";
import ComposerTools from "./ComposerTools";

export default function Composer({ tutorName, onSend, isLoading }) {
  const [text, setText] = useState("");
  const [isVoiceOn, setIsVoiceOn]     = useState(false);
  const [isPhotoOn, setIsPhotoOn]     = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMathOn, setIsMathOn]       = useState(false);
  const [attachment, setAttachment]   = useState(null);

  function handleSend() {
    if (!text.trim() && !attachment) return;
    onSend(text, attachment);
    setText("");
    setAttachment(null);
    setIsPhotoOn(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handlePhoto() {
    // Toggle a placeholder attachment for now
    if (isPhotoOn) {
      setAttachment(null);
      setIsPhotoOn(false);
    } else {
      setAttachment({ name: "worksheet_p3.jpg" });
      setIsPhotoOn(true);
    }
  }

  function handleRemoveAttachment() {
    setAttachment(null);
    setIsPhotoOn(false);
  }

  return (
    <div className="composer">
      <div className="composer-inner">
        {attachment && (
          <AttachmentChip
            filename={attachment.name}
            onRemove={handleRemoveAttachment}
          />
        )}

        <VoiceListeningBanner visible={isVoiceOn} />

        <div className="composer-box">
          <textarea
            className="composer-input"
            placeholder={`Ask ${tutorName ?? "your tutor"} a question…`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <ComposerTools
            isVoiceOn={isVoiceOn}
            isPhotoOn={isPhotoOn}
            isBookmarked={isBookmarked}
            isMathOn={isMathOn}
            onVoice={() => setIsVoiceOn((v) => !v)}
            onPhoto={handlePhoto}
            onBookmark={() => setIsBookmarked((v) => !v)}
            onMath={() => setIsMathOn((v) => !v)}
            onSend={handleSend}
            canSend={!isLoading && (!!text.trim() || !!attachment)}
          />
        </div>

        <p className="composer-note">
          type · draw in calculator · speak · attach photo
        </p>
      </div>
    </div>
  );
}
