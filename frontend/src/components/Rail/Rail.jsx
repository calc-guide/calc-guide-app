// components/Rail/Rail.jsx

import "./Rail.css";
import RailButton from "./RailButton";

const RAIL_ITEMS = [
  { id: "new",       icon: "＋", label: "New"     },
  { id: "tutor",     icon: "◐",  label: "Tutor"   },
  { id: "bookmarks", icon: "★",  label: "Saved"   },
  { id: "history",   icon: "≡",  label: "History" },
];

export default function Rail({ activeItem, onSelect }) {
  return (
    <nav className="rail" aria-label="Main navigation">
      <div className="rail-logo" aria-label="Calculus Tutor">∫</div>

      {RAIL_ITEMS.map((item) => (
        <RailButton
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeItem === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}

      <div className="rail-spacer" />

      <RailButton icon="⚙" label="Settings" active={activeItem === "settings"} onClick={() => onSelect("settings")} />
    </nav>
  );
}
