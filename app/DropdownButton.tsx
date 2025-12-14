import { useState } from "react";

export const DropdownButton = ({
  label,
  items,
  onItemClick,
}: {
  label: string;
  items: { label: string; link: string }[];
  onItemClick: (link: string) => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleMouseLeave = () => setDropdownOpen(false);

  return (
    <button
      className="nav-button dropdown-btn"
      onClick={() => setDropdownOpen(!dropdownOpen)}
      onMouseLeave={handleMouseLeave}
    >
      {label} &#11167;
      {dropdownOpen && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <div
              key={item.label}
              className="dropdown-item"
              onClick={() => onItemClick(item.link)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </button>
  );
};