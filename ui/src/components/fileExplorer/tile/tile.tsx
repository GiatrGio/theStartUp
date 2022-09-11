import { TreeItem, ItemId } from "@atlaskit/tree";
import "./tile.css";
import { FQ, GFF, BAM, FA, FOLDER, VCF, UNKNOWN } from "../../../icons/icon";
import { AiFillFolderOpen } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { BiDownArrow, BiRightArrow } from "react-icons/bi";
import { FormModal } from "../../commonComponents/formModal/formModal";
import { itemTypes } from "../../../interfaces/commonTypes";
import { removeOneLevelFromPath } from "../../../commonFunctions/commonFunctions";

interface TileProps {
  tile: TreeItem;
  onExpand: (itemId: ItemId) => void;
  onCollapse: (itemId: ItemId) => void;
  deleteTile: (itemId: ItemId) => void;
  renameTile: (itemId: ItemId, newName: string) => void;
  selectTile: (itemId: ItemId) => void;
  newFolder: (folderName: string, folderPath: string) => void;
}

function Tile({
  tile,
  onExpand,
  onCollapse,
  deleteTile,
  renameTile,
  selectTile,
  newFolder,
}: TileProps) {
  const [selected, setSelected] = useState(false);
  const [isContextMenuShown, setIsContextMenuShown] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isRenameMenuShown, setIsRenameMenuShown] = useState(false);
  const [tileName, setTileName] = useState(tile.data.name);
  const [tempName, setTempName] = React.useState(tile.data.name);
  const [isFolderNameOpen, setIsFolderNameOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    setTileName(tile.data.name);
  }, [tile.data.name]);

  useEffect(() => {
    setSelected(tile.data.selected);
    console.log(tile);
  }, [tile.data.selected]);

  const openFolderNameModal = () => {
    setIsFolderNameOpen(true);
    console.log("hi");
  };

  const closeFolderNameModal = () => {
    setIsFolderNameOpen(false);
  };

  const onNewFolder = (newFolderName: string) => {
    console.log("tile ", tile);
    let folderPath = tile.data.path;
    if (tile.data.type !== itemTypes.FOLDER) {
      folderPath = removeOneLevelFromPath(folderPath);
    }
    newFolder(newFolderName, folderPath);
  };

  const renameTileClick = () => {
    setIsRenameMenuShown(true);
  };

  const onSelected = () => {
    selectTile(tile.id);
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

  const onSubmit = () => {
    console.log("Submit");
  };

  const onRenameTileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRenameMenuShown(false);
    renameTile(tile.id, tempName);
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

  const expandTileIcon = () => {
    if (tile.children && tile.children.length > 0) {
      return tile.isExpanded ? (
        <span className={"PreTextIcon"} onClick={() => onCollapse(tile.id)}>
          <BiDownArrow size={30} />
        </span>
      ) : (
        <span className={"PreTextIcon"} onClick={() => onExpand(tile.id)}>
          <BiRightArrow size={30} />
        </span>
      );
    }
  };

  const getTileIconType = () => {
    switch (tile.data.type) {
      case itemTypes.FOLDER:
        return FOLDER;
      case itemTypes.BAM:
        return BAM;
      case itemTypes.GFF:
        return GFF;
      case itemTypes.VCF:
        return VCF;
      case itemTypes.FASTA:
        return FA;
      case itemTypes.FASTQ:
        return FQ;
      case itemTypes.UNKNOWN:
        return UNKNOWN;
    }
  };

  return (
    <div
      className="tileMain"
      onContextMenu={openContextMenu}
      onClick={onLeftClickFunctionality}
    >
      <Checkbox
        value="defaultIsOpen"
        name="toggleValue"
        onChange={(e) => onSelected()}
      />
      <button onClick={() => deleteTile(tile.id)}>Delete Folder</button>
      <h3>
        {" "}
        Lets go for a <AiFillFolderOpen />?{" "}
      </h3>
      {isRenameMenuShown ? (
        <div>
          <form onSubmit={onRenameTileSubmit}>
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
        tileName
      )}
      {expandTileIcon()}
      <div className="cardSize">{tile.data.size}</div>
      <img src={getTileIconType()} alt="Logo" />
      {isContextMenuShown && (
        <div
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          className="contextMenu"
        >
          <div className="contextMenuOption" onClick={() => renameTileClick()}>
            Rename
          </div>
          <div
            className="contextMenuOption"
            onClick={() => openFolderNameModal()}
          >
            New folder
          </div>
          <div className="contextMenuOption">Option #3</div>
        </div>
      )}
      ;
      <FormModal
        title={"New folder"}
        isOpen={isFolderNameOpen}
        onClose={closeFolderNameModal}
        onSubmit={onNewFolder}
      ></FormModal>
    </div>
  );
}

export default Tile;
