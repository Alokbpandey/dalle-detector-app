import React from "react";
import "./ContextMenu.css";

const ContextMenu = ({ position, onDelete, onClose }) => {
  return (
    <div className="context-menu" style={{ top: position.y, left: position.x }}>
      <button className="context-menu-item" onClick={onDelete}>Delete</button>
      <button className="context-menu-item" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default ContextMenu;
