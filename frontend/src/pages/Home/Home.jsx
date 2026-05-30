// pages/Home/Home.jsx — structure only, no logic, no inline styles

import "./Home.css";
import { useHome } from "./useHome";

function TutorCard({ tutor, isSelected, onSelect }) {
  return (
    <button
      className={`home-tutor-card${isSelected ? " selected" : ""}`}
      onClick={() => onSelect(tutor.id)}
      aria-pressed={isSelected}
    >
      <span className="home-tutor-avatar" aria-hidden="true">{tutor.emoji}</span>
      <span>
        <span className="home-tutor-name">{tutor.name}</span>
        <span className="home-tutor-style">{tutor.style}</span>
      </span>
    </button>
  );
}

export default function Home({ onStart }) {
  const { tutors, selectedId, selectedTutor, handleSelect, handleStart, canStart } =
    useHome({ onStart });

  return (
    <main className="home-page">
      <div className="home-logo" aria-label="Calculus Tutor">∫</div>

      <div className="home-headline">
        <h1>Calculus Tutor</h1>
        <p>Pick a teaching style and start learning — step by step, at your own pace.</p>
      </div>

      <div className="home-divider" role="separator" />

      <p className="home-section-label">Choose your tutor</p>

      <div className="home-tutor-grid" role="group" aria-label="Tutor options">
        {tutors.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            isSelected={selectedId === tutor.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <button
        className="home-start-btn"
        onClick={handleStart}
        disabled={!canStart}
      >
        {canStart ? `Start with ${selectedTutor.name}` : "Select a tutor"}
        <span aria-hidden="true">→</span>
      </button>

      <p className="home-footer">type · speak · attach a photo · use the calculator</p>
    </main>
  );
}