// components/ChatColumn/messages/DesmosGraph.jsx
// Render-only Desmos graph embedded in a tutor message.
// Mounted when the tutor emits a ```desmos fenced block; each line is one expression.

import { useEffect, useRef } from "react";
import "./DesmosGraph.css";

export default function DesmosGraph({ expressions = [] }) {
	const containerRef = useRef(null);
	const calcRef      = useRef(null);

	// Create the calculator once on mount, destroy on unmount.
	useEffect(() => {
		if (!containerRef.current) return;

		// window.Desmos is loaded via the script tag in index.html
		if (!window.Desmos) {
			console.error("Desmos not loaded — check the script tag in index.html");
			return;
		}

		calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
			keypad:       false,
			expressions:  false,
			settingsMenu: false,
			zoomButtons:  true,
			border:       false,
			fontSize:     16,
		});

		return () => {
			if (calcRef.current) {
				calcRef.current.destroy();
				calcRef.current = null;
			}
		};
	}, []);

	// Push expressions whenever they change (keyed on the joined string so a new
	// array ref from re-parsing on each render doesn't tear down the calculator).
	const key = expressions.join("\n");
	useEffect(() => {
		const calc = calcRef.current;
		if (!calc) return;
		calc.setBlank();
		expressions.forEach((latex, i) => {
			calc.setExpression({ id: `g${i}`, latex });
		});
	}, [key]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="desmos-graph">
			<div className="desmos-graph-toolbar">
				<span>Graph</span>
			</div>
			<div className="desmos-graph-container" ref={containerRef} />
		</div>
	);
}
