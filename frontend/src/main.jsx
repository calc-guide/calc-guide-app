// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './App.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import "katex/dist/katex.min.css";
import "./styles/variables.css";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
