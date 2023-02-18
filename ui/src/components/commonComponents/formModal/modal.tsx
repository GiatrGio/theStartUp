import React from "react";
import "./modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const outsideRef = React.useRef(null);

  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  };

  return isOpen ? (
    <div className={"modal"}>
      <div
        ref={outsideRef}
        className={"modalΟverlay"}
        onClick={handleCloseOnOverlay}
      />
      <span>{children}</span>
    </div>
  ) : null;
};
