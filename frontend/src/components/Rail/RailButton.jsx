// components/Rail/RailButton.jsx

export default function RailButton({ icon, label, active, onClick }) {
  return (
    <button
      className={`rail-btn${active ? " active" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
    >
      <span className="rail-btn-icon" aria-hidden="true">{icon}</span>
      <small className="rail-btn-label">{label}</small>
    </button>
  );
}
