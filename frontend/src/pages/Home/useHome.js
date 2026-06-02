// pages/Home/useHome.js — all logic for the Home page

import { useState } from "react";

export const TUTORS = [
  { id: "rivera", name: "Ms. Rivera",    style: "Patient · visual explainer"},
  { id: "newton", name: "Prof. Newton",  style: "Rigorous · proof-first"},
  { id: "sunny",  name: "Sunny",         style: "Encouraging · plain language"},
  { id: "delta",  name: "Coach Delta",   style: "Exam prep · fast drills"},
  { id: "brown",  name: "3Blue1Brown",   style: "Intuition-first · visual storytelling"},
  { id: "khan",   name: "Khan Academy",  style: "Step-by-step · worked examples"},
];

export function useHome({ onStart }) {
  const [selectedId, setSelectedId] = useState(null);

  const selectedTutor = TUTORS.find((t) => t.id === selectedId) ?? null;

  function handleSelect(id) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function handleStart() {
    if (!selectedTutor) return;
    onStart(selectedTutor);
  }

  return {
    tutors: TUTORS,
    selectedId,
    selectedTutor,
    handleSelect,
    handleStart,
    canStart: !!selectedTutor,
  };
}