// components/TutorSelector/TutorSelector.jsx

import { useState, useEffect, useRef } from "react";
import "./TutorSelector.css";
import { TUTORS } from "../../pages/Home/useHome";

export default function TutorSelector({ selectedTutor, onChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(tutor) {
    onChange(tutor);
    setMenuOpen(false);
  }

  return (
    <div className="tutor-selector-wrap" ref={wrapRef}>
      <button
        className="tutor-selector-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-haspopup="listbox"
      >
        <span className="tutor-avatar" aria-hidden="true">
          {selectedTutor?.emoji ?? "◐"}
        </span>
        <span className="tutor-meta">
          <span className="tutor-meta-name">{selectedTutor?.name ?? "Choose tutor"}</span>
          <span className="tutor-meta-style">{selectedTutor?.style ?? ""}</span>
        </span>
        <span className="tutor-caret" aria-hidden="true">▾</span>
      </button>

      {menuOpen && (
        <div className="tutor-menu" role="listbox">
          {TUTORS.map((tutor) => (
            <button
              key={tutor.id}
              className="tutor-menu-option"
              onClick={() => handleSelect(tutor)}
              role="option"
              aria-selected={selectedTutor?.id === tutor.id}
            >
              <span className="tutor-avatar" aria-hidden="true">{tutor.emoji}</span>
              <span>
                <span className="tutor-menu-name">{tutor.name}</span>
                <span className="tutor-menu-style">{tutor.style}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
