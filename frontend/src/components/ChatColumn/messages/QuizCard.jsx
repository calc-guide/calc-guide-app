// components/ChatColumn/messages/QuizCard.jsx

import { useState } from "react";

export default function QuizCard({ question, choices, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (selected === null) return;
    setSubmitted(true);
    onSubmit?.(selected);
  }

  return (
    <div className="quiz">
      <span className="quiz-tag">Exercise · answer below</span>
      <h4>Quick check</h4>
      <p className="q">{question}</p>

      <div className="choices">
        {choices.map((choice, i) => (
          <label
            key={i}
            className={`choice${selected === i ? " selected" : ""}`}
            onClick={() => !submitted && setSelected(i)}
          >
            <span className="radio" aria-hidden="true" />
            {choice}
          </label>
        ))}
      </div>

      <div className="quiz-foot">
        <button
          className="quiz-submit"
          onClick={handleSubmit}
          disabled={selected === null || submitted}
        >
          {submitted ? "Submitted ✓" : "Submit answer"}
        </button>
        <span className="quiz-hint">↑ you answer inside the chat — not the prompt box</span>
      </div>
    </div>
  );
}
