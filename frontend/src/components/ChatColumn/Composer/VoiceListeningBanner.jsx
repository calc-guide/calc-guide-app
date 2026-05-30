// components/ChatColumn/Composer/VoiceListeningBanner.jsx

const WAVE_DELAYS = ["0s", "0.15s", "0.3s", "0.45s", "0.2s", "0.35s"];

export default function VoiceListeningBanner({ visible }) {
  if (!visible) return null;

  return (
    <div className="voice-row" role="status" aria-live="polite">
      <span className="pulse" aria-hidden="true" />
      <small>Listening… ask your question out loud</small>
      <span className="voice-wave" aria-hidden="true">
        {WAVE_DELAYS.map((delay, i) => (
          <i key={i} style={{ animationDelay: delay }} />
        ))}
      </span>
    </div>
  );
}
