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
import Card from "./card/card";
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
        <Card
          item={item}
          onExpand={onExpand}
          onCollapse={onCollapse}
          deleteItem={deleteItem}
          renameItem={renameItem}
          selectItem={selectItem}
        />
      </div>
    );
  };

  useEffect(() => {
    setTree(props.workspace);
  }, [props.workspace]);

  const onExpand = (itemId: ItemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: true }));
  };

  const onCollapse = (itemId: ItemId) => {
    setTree(mutateTree(tree, itemId, { isExpanded: false }));
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

  const deleteItem = (itemId: ItemId) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(deleteItemFromTree(newTree, itemId));
  };

  const renameItem = (itemId: ItemId, newName: string) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(renameItemFromTree(newTree, itemId, newName));
  };

  const selectItem = (itemId: ItemId) => {
    let newTree = JSON.parse(JSON.stringify(tree));
    setTree(selectItemFromTree(newTree, itemId));
  };

  const addFolder = () => {
    const folderString = "folder-";
    const numberOfItems = Object.keys(tree.items).length.toString();
    const newItemId = folderString.concat(numberOfItems);
    let newTree = JSON.parse(JSON.stringify(tree));

    newTree.items[newItemId] = {
      id: newItemId,
      hasChildren: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        id: numberOfItems,
        type: "folder",
        name: "User defined name",
        QCReportUrl: "fileLocation",
        size: "fileSize",
        isSelected: false,
      },
      children: [],
    };
    console.log(newTree);
    newTree.items[props.workspaceName].children.push(newItemId);
    setTree(newTree);
  };

  useEffect(() => {}, [tree]);

  return (
    <div>
      <button onClick={addFolder}>Add Folder</button>
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
