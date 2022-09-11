import React from "react";
import "./formModal.css";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  content?: string;
  onSubmit: (fileName: string) => void;
}

export const FormModal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  content,
  onSubmit,
}) => {
  const outsideRef = React.useRef(null);

  const handleCloseOnOverlay = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (e.target === outsideRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name = target.name.value;
    onSubmit(name);
    onClose();
  };

  return isOpen ? (
    <div className={"modal"}>
      <div
        ref={outsideRef}
        className={"modalΟverlay"}
        onClick={handleCloseOnOverlay}
      />
      <div className={"modalBox"}>
        <button className={"modalClose"} onClick={onClose}></button>
        <div className={"modalTitle"}>{title}</div>
        <div className={"modalContent"}>{content}</div>
        <div className={"modalForm"}>
          <form
            onSubmit={(e: React.SyntheticEvent) => {
              handleSubmit(e);
            }}
          >
            <input type="text" id="nameInput" name="name" />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
  ) : null;
};
