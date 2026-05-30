// components/ChatColumn/Composer/Composer.jsx

import { useRef, useState } from "react";
import "./Composer.css";
import AttachmentChip from "./AttachmentChip";
import VoiceListeningBanner from "./VoiceListeningBanner";
import ComposerTools from "./ComposerTools";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function Composer({ tutorName, onSend, isLoading }) {
  const [text, setText] = useState("");
  const [isVoiceOn, setIsVoiceOn]       = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMathOn, setIsMathOn]         = useState(false);
  const [attachment, setAttachment]     = useState(null);
  const [isDragOver, setIsDragOver]     = useState(false);
  const fileInputRef = useRef(null);

  function handleSend() {
    if (!text.trim() && !attachment) return;
    onSend(text, attachment);
    setText("");
    setAttachment(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function readFile(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachment({ name: file.name, dataUrl: e.target.result, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) readFile(file);
    e.target.value = "";
  }

  function handlePhoto() {
    if (attachment) {
      setAttachment(null);
    } else {
      fileInputRef.current?.click();
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function handlePaste(e) {
    const item = Array.from(e.clipboardData.items).find(
      (i) => i.kind === "file" && ACCEPTED_TYPES.includes(i.type)
    );
    if (!item) return;
    e.preventDefault();
    const file = item.getAsFile();
    if (file) readFile(file);
  }

  return (
    <div
      className={`composer${isDragOver ? " drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onPaste={handlePaste}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="composer-inner">
        {attachment && (
          <AttachmentChip
            filename={attachment.name}
            onRemove={() => setAttachment(null)}
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
            isPhotoOn={!!attachment}
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
          type · attach photo · drag &amp; drop · paste image (⌘V)
        </p>
      </div>
    </div>
  );
}
