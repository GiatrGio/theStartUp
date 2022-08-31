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
