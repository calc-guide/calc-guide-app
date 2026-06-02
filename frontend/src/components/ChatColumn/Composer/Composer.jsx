// components/ChatColumn/Composer/Composer.jsx

import { useRef, useState } from "react";
import "./Composer.css";
import AttachmentChip from "./AttachmentChip";
import VoiceListeningBanner from "./VoiceListeningBanner";
import ComposerTools from "./ComposerTools";
import DesmosCalculator from "./DesmosCalculator";
import CameraCapture from "./CameraCapture";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

// The file-input `capture` attribute only opens the camera on mobile; desktop
// ignores it and shows a file picker. So desktop uses a getUserMedia modal.
const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export default function Composer({ tutorName, onSend, isLoading, hasMessages, isBookmarked, onBookmark }) {
  const [text, setText]                 = useState("");
  const [isVoiceOn, setIsVoiceOn]       = useState(false);
  const [isMathOn, setIsMathOn]         = useState(false);
  const [attachment, setAttachment]     = useState(null);
  const [isDragOver, setIsDragOver]     = useState(false);
  const [fileError, setFileError]       = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    setFileError(null);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function readFile(file) {
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
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachment({ name: file.name, dataUrl: e.target.result, mediaType: file.type });
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) readFile(file);
  }

  function handlePhoto() {
    if (attachment) {
      setAttachment(null);
      setFileError(null);
    } else {
      fileInputRef.current?.click();
    }
  }

  function handleCamera() {
    if (attachment) {
      setAttachment(null);
      setFileError(null);
    } else if (IS_MOBILE) {
      cameraInputRef.current?.click();
    } else {
      setIsCameraOpen(true);
    }
  }

  function handleCameraCapture(file) {
    setIsCameraOpen(false);
    readFile(file);
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
    setFileError(null);
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
      (i) => i.kind === "file" && ACCEPTED_IMAGE_TYPES.includes(i.type)
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
      {/* File picker — browses local filesystem */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
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

      <CameraCapture
        visible={isCameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => setIsCameraOpen(false)}
      />

      <div className="composer-inner">
        <DesmosCalculator
          visible={isMathOn}
          onInsert={handleDesmosInsert}
          onClose={() => setIsMathOn(false)}
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
            isPhotoOn={!!attachment}
            isBookmarked={isBookmarked}
            isMathOn={isMathOn}
            onVoice={() => setIsVoiceOn((v) => !v)}
            onPhoto={handlePhoto}
            onCamera={handleCamera}
            onBookmark={onBookmark}
            onMath={() => setIsMathOn((v) => !v)}
            onSend={handleSend}
            canSend={!isLoading && (!!text.trim() || !!attachment)}
            canBookmark={hasMessages}
          />
        </div>

        <p className="composer-note">
          type · draw in calculator · speak · attach photo · paste image (⌘V) · take photo
        </p>
      </div>
    </div>
  );
}