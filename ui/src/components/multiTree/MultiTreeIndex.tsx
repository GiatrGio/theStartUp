import { useState } from "react";
import Tree, {
    mutateTree,
    moveItemOnTree,
    RenderItemParams,
    TreeItem,
    TreeData,
    ItemId,
    TreeSourcePosition,
    TreeDestinationPosition,
} from '@atlaskit/tree';
import Card from "./Card";

const PADDING_PER_LEVEL = 16;

type State = {
    tree: TreeData;
};

interface MultiTreeIndexProps {
    activeWorkspace: TreeData
}

function MultiTreeIndex(props:MultiTreeIndexProps) {
    const [tree, setTree] = useState<TreeData>(props.activeWorkspace);

    const renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
              <Card item={item} onExpand={onExpand} onCollapse={onCollapse}/>
          </div>
        );
    };

    const onExpand = (itemId: ItemId) => {
        setTree(mutateTree(tree, itemId, { isExpanded: true }))
    };

    const onCollapse = (itemId: ItemId) => {
        setTree(mutateTree(tree, itemId, { isExpanded: false }))
    };

    const onDragEnd = (
      source: TreeSourcePosition,
      destination?: TreeDestinationPosition,
    ) => {

        if (!destination) {
            return;
        }
        const newTree = moveItemOnTree(tree, source, destination);
        setTree(newTree)
    };

    return(
      <Tree
        tree={tree}
        renderItem={renderItem}
        onExpand={onExpand}
        onCollapse={onCollapse}
        onDragEnd={onDragEnd}
        offsetPerLevel={PADDING_PER_LEVEL}
        isDragEnabled
      />
    );
}

export default MultiTreeIndex;
