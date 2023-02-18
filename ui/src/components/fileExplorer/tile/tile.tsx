import { TreeItem, ItemId } from "@atlaskit/tree";
import "./tile.css";
import { FQ, GFF, BAM, FA, FOLDER, VCF, UNKNOWN } from "../../../icons/icon";
import { AiFillFolderOpen } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { Checkbox, Popper } from "@mui/material";
import { BiDownArrow, BiRightArrow } from "react-icons/bi";
import { Modal } from "../../commonComponents/formModal/modal";
import { itemTypes } from "../../../interfaces/commonTypes";
import { removeOneLevelFromPath } from "../../../utils/commonFunctions";
import TileOverview from "../../tileOverview/tileOverview";

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
  const [isRenameMenuShown, setIsRenameMenuShown] = useState(false);
  const [tileName, setTileName] = useState(tile.data.name);
  const [tempName, setTempName] = React.useState(tile.data.name);
  const [isNewFolderNamePopupOpen, setIsNewFolderNamePopupOpen] =
    useState(false);

  const [anchorOverviewElement, setAnchorOverviewElement] =
    React.useState<null | HTMLElement>(null);

  const tileOverviewOpen = Boolean(anchorOverviewElement);

  const handleOverviewOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorOverviewElement(event.currentTarget);
  };

  const handleOverviewClose = () => {
    setAnchorOverviewElement(null);
  };

  useEffect(() => {
    setTileName(tile.data.name);
  }, [tile.data.name]);

  useEffect(() => {
    setSelected(tile.data.selected);
  }, [tile.data.selected]);

  const newFolderClick = () => {
    setIsNewFolderNamePopupOpen(true);
  };

  const closeFolderNameModal = () => {
    setIsNewFolderNamePopupOpen(false);
  };

  const onNewFolderSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const newFolderName = target.name.value;
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

  const onRenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(event.target.value);
  };

  const onCancelRename = () => {
    setIsRenameMenuShown(false);
  };

  const onRenameTileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsRenameMenuShown(false);
    renameTile(tile.id, tempName);
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
    <div className="tileMain">
      <Checkbox
        value="defaultIsOpen"
        name="toggleValue"
        onChange={(e) => onSelected()}
      />
      <button onClick={() => deleteTile(tile.id)}>Delete Folder</button>
      <div onMouseEnter={handleOverviewOpen} onMouseLeave={handleOverviewClose}>
        <h3>
          {" "}
          Lets go for a <AiFillFolderOpen />?{" "}
        </h3>
        <Popper
          placement={"right-end"}
          open={tileOverviewOpen}
          anchorEl={anchorOverviewElement}
        >
          <TileOverview helloString={"dsads"} />
        </Popper>
      </div>
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
        <span onDoubleClick={() => renameTileClick()}>{tileName}</span>
      )}
      {expandTileIcon()}
      <div className="cardSize">{tile.data.size}</div>
      <img src={getTileIconType()} alt="Logo" />
      <button onClick={() => newFolderClick()}>New folder</button>
      <Modal
        isOpen={isNewFolderNamePopupOpen}
        onClose={closeFolderNameModal}
        children={
          <div className={"modalBox"}>
            <button
              className={"modalClose"}
              onClick={closeFolderNameModal}
            ></button>
            <div className={"modalTitle"}>{"New folder"}</div>
            <div className={"modalContent"}>{"Content"}</div>
            <div className={"modalForm"}>
              <form onSubmit={onNewFolderSubmit}>
                <input type="text" id="nameInput" name="name" />
                <br />
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>
        }
      ></Modal>
    </div>
  );
}

export default Tile;
