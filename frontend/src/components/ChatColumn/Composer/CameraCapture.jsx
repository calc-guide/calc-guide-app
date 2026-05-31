// CameraCapture.jsx
// Desktop webcam capture via getUserMedia. On mobile the composer uses the
// native file-input `capture` attribute instead — see Composer.jsx.

import { useEffect, useRef, useState } from "react";
import "./CameraCapture.css";

function errorLabel(err) {
  switch (err?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Camera access was blocked. Allow it in your browser, or attach a photo from a file instead.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No camera found on this device.";
    case "NotReadableError":
      return "The camera is in use by another app.";
    default:
      return "Couldn't start the camera. Try attaching a photo from a file instead.";
  }
}

export default function CameraCapture({ visible, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("requesting"); // requesting | active | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!visible) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMsg("This browser doesn't support camera capture.");
      return;
    }

    let cancelled = false;
    setStatus("requesting");
    setErrorMsg("");

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("active");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(errorLabel(err));
      });

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [visible]);

  if (!visible) return null;

  function handleCapture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div className="camera-overlay" role="dialog" aria-modal="true" aria-label="Take a photo">
      <div className="camera-modal">
        <div className="camera-toolbar">
          <span>Take a photo</span>
          <button className="camera-close" onClick={onClose} aria-label="Close camera">✕</button>
        </div>

        <div className="camera-stage">
          {status === "error" ? (
            <div className="camera-message">{errorMsg}</div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />
              {status === "requesting" && (
                <div className="camera-message">Starting camera…</div>
              )}
            </>
          )}
        </div>

        <div className="camera-actions">
          <button className="camera-btn" onClick={onClose}>Cancel</button>
          <button
            className="camera-btn primary"
            onClick={handleCapture}
            disabled={status !== "active"}
          >
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}
