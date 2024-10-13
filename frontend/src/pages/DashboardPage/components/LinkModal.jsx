import React from 'react';
import './LinkModal.css'; // We'll style it using an external CSS file

const LinkModal = ({ isOpen, onClose, link }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Generated Link</h2>
        <p className="modal-link">{window.location.origin + link}</p>
        <button
          className="modal-button"
          onClick={() => navigator.clipboard.writeText(window.location.origin + link)}
        >
          Copy Link
        </button>
        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LinkModal;
