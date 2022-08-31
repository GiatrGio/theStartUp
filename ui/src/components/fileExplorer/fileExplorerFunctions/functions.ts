import { ItemId, TreeData } from "@atlaskit/tree";

export const deleteItemFromTree = (
  tree: TreeData,
  itemId: ItemId
): TreeData => {
  const folderString = "folder";
  let treeItems = tree.items;

  function deleteItemFromChildrenList(childrenList: ItemId[]) {
    for (let index = 0; index < childrenList.length; index++) {
      if (childrenList[index] === itemId) {
        childrenList.splice(index, 1);
      }
    }
  }

  Object.entries(treeItems).forEach(([, item]) => {
    let childrenList = item.children;

    if (item.id === itemId && item.data.type === folderString) {
      childrenList.forEach((childItem) => {
        tree = deleteItemFromTree(tree, childItem);
      });
    }
    deleteItemFromChildrenList(childrenList);
    delete treeItems[itemId];
  });

  return tree;
};

export const renameItemFromTree = (
  tree: TreeData,
  itemId: ItemId,
  newName: string
): TreeData => {
  for (const [, value] of Object.entries(tree.items)) {
    if (value.id === itemId) {
      value.data.name = newName;
      break;
    }
  }

  return tree;
};

export const selectItemFromTree = (
  tree: TreeData,
  itemId: ItemId
): TreeData => {
  for (const [, value] of Object.entries(tree.items)) {
    if (value.id === itemId) {
      value.data.selected = !value.data.selected;
      break;
    }
  }

  return tree;
};
