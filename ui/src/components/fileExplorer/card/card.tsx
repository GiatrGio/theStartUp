import { TreeItem, ItemId } from "@atlaskit/tree";
import "./card.css";
import { FQ, GFF, BAM, FA, FOLDER } from "../../../icons/icon";
import { AiFillFolderOpen } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { BiDownArrow, BiRightArrow } from "react-icons/bi";

interface CardProps {
  item: TreeItem;
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
  deleteItem: (itemId: ItemId) => void;
  renameItem: (itemId: ItemId, newName: string) => void;
  selectItem: (itemId: ItemId) => void;
}

function Card({
  item,
  onExpand,
  onCollapse,
  deleteItem,
  renameItem,
  selectItem,
}: CardProps) {
  const [selected, setSelected] = useState(false);
  const [isContextMenuShown, setIsContextMenuShown] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isRenameMenuShown, setIsRenameMenuShown] = useState(false);
  const [itemName, setItemName] = useState(item.data.name);
  const [tempName, setTempName] = React.useState(item.data.name);

  useEffect(() => {
    setItemName(item.data.name);
  }, [item.data.name]);

  useEffect(() => {
    setSelected(item.data.selected);
    console.log(item);
  }, [item.data.selected]);

  const renameItemClick = () => {
    setIsRenameMenuShown(true);
  };

  const onSelected = () => {
    selectItem(item.id);
  };

  const onLeftClickFunctionality = () => {
    setIsContextMenuShown(false);
  };

  const onRenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(event.target.value);
  };

  const onCancelRename = () => {
    setIsRenameMenuShown(false);
  };

  const onRenameItemSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRenameMenuShown(false);
    renameItem(item.id, tempName);
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

  const expandItemIcon = () => {
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

  return (
    <div
      className="cardMain"
      onContextMenu={openContextMenu}
      onClick={onLeftClickFunctionality}
    >
      <Checkbox
        value="defaultIsOpen"
        name="toggleValue"
        onChange={(e) => onSelected()}
      />
      <button onClick={() => deleteItem(item.id)}>Delete Folder</button>
      <h3>
        {" "}
        Lets go for a <AiFillFolderOpen />?{" "}
      </h3>
      {isRenameMenuShown ? (
        <div>
          <form onSubmit={onRenameItemSubmit}>
            <input
              type="text"
              value={tempName}
              onChange={onRenameInputChange}
            />
            <button type="submit">Submit</button>
            <button onClick={onCancelRename}>Cancel</button>
          </form>
        </div>
      ) : (
        itemName
      )}
      {expandItemIcon()}
      <div className="cardSize">{item.data.size}</div>
      <img src={BAM} alt="Logo" />
      {isContextMenuShown && (
        <div
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          className="contextMenu"
        >
          <div className="contextMenuOption" onClick={() => renameItemClick()}>
            Rename
          </div>
          <div className="contextMenuOption">Option #2</div>
          <div className="contextMenuOption">Option #3</div>
        </div>
      )}
      ;
    </div>
  );
}

export default Card;
