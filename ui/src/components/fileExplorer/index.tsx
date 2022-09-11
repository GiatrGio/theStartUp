import React, { useEffect, useState } from "react";
import Tree, {
  ItemId,
  moveItemOnTree,
  mutateTree,
  RenderItemParams,
  TreeData,
  TreeDestinationPosition,
  TreeSourcePosition,
} from "@atlaskit/tree";
import Tile from "./tile/tile";
import {
  deleteItemFromTree,
  renameItemFromTree,
  selectItemFromTree,
} from "./fileExplorerFunctions/functions";

const PADDING_PER_LEVEL = 16;

type State = {
  tree: TreeData;
};

interface MultiTreeIndexProps {
  workspace: TreeData;
  workspaceName: string;
}

function Index(props: MultiTreeIndexProps) {
  const [tree, setTree] = useState<TreeData>(props.workspace);

  const renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams) => {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <Tile
          tile={item}
          onExpand={onExpand}
          onCollapse={onCollapse}
          deleteTile={deleteItem}
          renameTile={renameItem}
          selectTile={selectItem}
          newFolder={addFolder}
        />
      </div>
    );
  };

  useEffect(() => {
    setTree(props.workspace);
  }, [props.workspace]);

  const onExpand = (tileId: ItemId) => {
    setTree(mutateTree(tree, tileId, { isExpanded: true }));
  };

  const onCollapse = (tileId: ItemId) => {
    setTree(mutateTree(tree, tileId, { isExpanded: false }));
  };

  const onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
  ) => {
    if (!destination) {
      return;
    }
    const newTree = moveItemOnTree(tree, source, destination);
    setTree(newTree);
  };

  const deleteItem = (tileId: ItemId) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(deleteItemFromTree(newTree, tileId));
  };

  const renameItem = (tileId: ItemId, newName: string) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(renameItemFromTree(newTree, tileId, newName));
  };

  const selectItem = (tileId: ItemId) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(selectItemFromTree(newTree, tileId));
  };

  const addFolder = async (folderName: string, folderPath: string) => {
    const success = await window.electron.createFolder(folderName, folderPath);
    if (success) {
      const folderString = "folder-";
      const numberOfTiles = Object.keys(tree.items).length.toString();
      const newTileId = folderString.concat(numberOfTiles);
      let newTree = JSON.parse(JSON.stringify(tree));

      newTree.items[newTileId] = {
        id: newTileId,
        hasChildren: false,
        isExpanded: false,
        isChildrenLoading: false,
        data: {
          id: numberOfTiles,
          type: "folder",
          name: folderName,
          QCReportUrl: "fileLocation",
          size: "fileSize",
          isSelected: false,
        },
        children: [],
      };
      console.log(newTree);
      newTree.items[props.workspaceName].children.push(newTileId);
      setTree(newTree);
    } else {
      //TODO Throw a warning modal message
    }
  };

  useEffect(() => {}, [tree]);

  return (
    <div>
      <Tree
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
      />
    </div>
  );
}

export default Index;
