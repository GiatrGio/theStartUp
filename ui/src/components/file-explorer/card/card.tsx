import { TreeItem, ItemId } from "@atlaskit/tree";
import "./card.css";
import { FQ, GFF, BAM, FA, FOLDER } from "../../../icons/icon";
import { AiFillFolderOpen } from "react-icons/ai";
import React, { useState } from "react";
import { Checkbox } from "@mui/material";
import { BiDownArrow, BiRightArrow } from "react-icons/bi";

interface CardProps {
  item: TreeItem;
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
  deleteItem: (itemId: ItemId) => void;
}

const getIcon = (
  item: TreeItem,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void
) => {
  if (item.children && item.children.length > 0) {
    return item.isExpanded ? (
      <span className={"PreTextIcon"} onClick={() => onCollapse(item.id)}>
        <BiDownArrow size={30} />
      </span>
    ) : (
      <span className={"PreTextIcon"} onClick={() => onExpand(item.id)}>
        <BiRightArrow size={30} />
      </span>
    );
  }
};

function Card({ item, onExpand, onCollapse, deleteItem }: CardProps) {
  const [selected, setSelected] = useState(false);
  const [isContextMenuShown, setIsContextMenuShown] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const onSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(selected);
  };

  const openContextMenu = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsContextMenuShown(false);

    const newPosition = {
      x: e.pageX,
      y: e.pageY,
    };
    setContextMenuPosition(newPosition);
    setIsContextMenuShown(true);
  };

  return (
    <div className="cardMain" onContextMenu={openContextMenu}>
      <Checkbox
        value="defaultIsOpen"
        name="toggleValue"
        onChange={(e) => onSelected(e)}
      />
      <button onClick={() => deleteItem(item.id)}>Delete Folder</button>
      <h3>
        {" "}
        Lets go for a <AiFillFolderOpen />?{" "}
      </h3>
      <span>{getIcon(item, onExpand, onCollapse)}</span>
      {item.data.name ? item.data.name : ""}
      <div className="cardSize">{item.data.size}</div>
      <img src={BAM} alt="Logo" />
      {isContextMenuShown && (
        <div
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          className="contextMenu"
        >
          <div>Option #1</div>
          <div>Option #2</div>
          <div>Option #3</div>
        </div>
      )}
      ;
    </div>
  );
}

export default Card;
