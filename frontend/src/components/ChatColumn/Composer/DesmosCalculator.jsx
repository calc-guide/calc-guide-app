// DesmosCalculator.jsx
// Embeds the real Desmos graphing calculator.
// "Insert into chat" sends the current expression to the composer.

import { useEffect, useRef } from "react";
import "./DesmosCalculator.css";

export default function DesmosCalculator({ visible, onInsert, onClose }) {
  const containerRef = useRef(null);
  const calcRef      = useRef(null);

  // Mount Desmos when the panel first becomes visible
  useEffect(() => {
    if (!visible) return;
    if (!containerRef.current) return;

    // window.Desmos is loaded via the script tag in index.html
    if (!window.Desmos) {
      console.error("Desmos not loaded — check the script tag in index.html");
      return;
    }

    // Only create the calculator once
    if (!calcRef.current) {
      calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        keypad:       true,
        expressions:  true,
        settingsMenu: false,
        zoomButtons:  true,
        border:       false,
      });
    }

    // Cleanup when component unmounts
    return () => {
      if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };
  }, [visible]);

  if (!visible) return null;

  function handleInsert() {
    if (!calcRef.current) return;

    // Grab all non-empty expressions from Desmos
    const state       = calcRef.current.getState();
    const expressions = state.expressions.list
      .filter((e) => e.type === "expression" && e.latex)
      .map((e) => e.latex)
      .join(", ");

    const text = expressions
      ? `[Desmos: ${expressions}]`
      : "[Desmos graph attached]";

    onInsert(text);
    onClose();
  }

  return (
    <div className="desmos-panel">
      <div className="desmos-toolbar">
        <span>Desmos Graphing Calculator</span>
        <div className="desmos-toolbar-actions">
          <button className="desmos-action-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="desmos-action-btn primary" onClick={handleInsert}>
            Insert into chat →
          </button>
        </div>
      </div>
      <div className="desmos-container" ref={containerRef} />
    </div>
  );
}