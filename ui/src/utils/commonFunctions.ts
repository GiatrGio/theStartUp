export const deleteItemFromArray = (
  arrayToDeleteFrom: Array<any>,
  itemToDelete?: any
): Array<any> => {
  const index = arrayToDeleteFrom.indexOf(itemToDelete);
  if (index > -1) {
    arrayToDeleteFrom.splice(index, 1);
  }
  return arrayToDeleteFrom;
};

export const removeOneLevelFromPath = (path: string): string => {
  path = path.substring(0, path.lastIndexOf("/"));
  return path;
};
