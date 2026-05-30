// components/ChatColumn/Composer/Composer.jsx

import { useState, useRef } from "react";
import "./Composer.css";
import AttachmentChip from "./AttachmentChip";
import VoiceListeningBanner from "./VoiceListeningBanner";
import ComposerTools from "./ComposerTools";
import DesmosCalculator from "./DesmosCalculator";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

export default function Composer({ tutorName, onSend, isLoading, hasMessages }) {

  const [text, setText]                 = useState("");
  const [isVoiceOn, setIsVoiceOn]       = useState(false);
  const [isPhotoOn, setIsPhotoOn]       = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMathOn, setIsMathOn]         = useState(false);
  const [attachment, setAttachment]     = useState(null);
  const [fileError, setFileError]       = useState(null);

  // Two hidden inputs — one for file picker, one for camera
  const fileInputRef   = useRef(null);
  const cameraInputRef = useRef(null);

  function handleDesmosInsert(expression) {
    setText((prev) => prev ? `${prev} ${expression}` : expression);
  }

  function handleSend() {
    if (!text.trim() && !attachment) return;
    onSend(text, attachment);
    setText("");
    setAttachment(null);
    setIsPhotoOn(false);
    setFileError(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Opens native file picker
  function handlePhoto() {
    if (isPhotoOn) {
      handleRemoveAttachment();
    } else {
      fileInputRef.current?.click();
    }
  }

  // Opens device camera
  function handleCamera() {
    if (isPhotoOn) {
      handleRemoveAttachment();
    } else {
      cameraInputRef.current?.click();
    }
  }

  // Shared validation for both inputs
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Please select an image file (JPEG, PNG, GIF, or WebP).");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`Image must be under ${MAX_FILE_SIZE_MB}MB. Yours is ${sizeMB.toFixed(1)}MB.`);
      return;

    }

    setFileError(null);
    setAttachment({ name: file.name, file, type: file.type });
    setIsPhotoOn(true);
  }

  // Validates and stores the selected file
  function handleFileChange(e) {
    const file = e.target.files?.[0];

    // Reset input so same file can be re-selected
    e.target.value = "";

    if (!file) return;

    // Check it's an image
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setFileError("Please select an image file (JPEG, PNG, GIF, or WebP).");
      return;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`Image must be under ${MAX_FILE_SIZE_MB}MB. Yours is ${sizeMB.toFixed(1)}MB.`);
      return;
    }

    setFileError(null);
    setAttachment({ name: file.name, file, type: file.type });
    setIsPhotoOn(true);
  }

  function handleRemoveAttachment() {
    setAttachment(null);
    setIsPhotoOn(false);
    setFileError(null);
  }

  return (
    <div className="composer">
      <div className="composer-inner">

        <DesmosCalculator
          visible={isMathOn}
          onInsert={handleDesmosInsert}
          onClose={() => setIsMathOn(false)}
        />

        {/* File picker input — browses device files */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Camera input — opens device camera directly */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {fileError && (
          <div className="file-error">⚠ {fileError}</div>

        )}

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
            onCamera={handleCamera}
            onBookmark={() => setIsBookmarked((v) => !v)}
            onMath={() => setIsMathOn((v) => !v)}
            onSend={handleSend}
            canSend={!isLoading && (!!text.trim() || !!attachment)}
            canBookmark={hasMessages}
          />
        </div>

        <p className="composer-note">
          type · draw in calculator · speak · attach photo · take photo
        </p>
      </div>
    </div>
  );
}