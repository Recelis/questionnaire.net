import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
  label: string;
  action: () => void;
  danger?: boolean;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  trigger: React.ReactNode;
}

export default function DropdownMenu({ options, trigger }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            border: "1px solid #333",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            minWidth: "150px",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option.action)}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                color: option.danger ? "#ff6b6b" : "#fff",
                transition: "background-color 0.2s",
                borderBottom:
                  index < options.length - 1 ? "1px solid #333" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2a2a2a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

