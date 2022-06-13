import Tree, {
    TreeItem,
    ItemId,
} from "@atlaskit/tree";
import styled from "@emotion/styled";

interface CardProps {
    item: TreeItem;
    onExpand: (itemId: ItemId) => void;
    onCollapse: (itemId: ItemId) => void;
}

const PreTextIcon = styled.span`
  display: block;
  width: 16px;
  justify-content: center;
  cursor: pointer;
`;

const getIcon = (
  item: TreeItem,
  onExpand: (itemId: ItemId) => void,
  onCollapse: (itemId: ItemId) => void,
) => {
    if (item.children && item.children.length > 0) {
        return item.isExpanded ? (
          <PreTextIcon onClick={() => onCollapse(item.id)}>-</PreTextIcon>
        ) : (
          <PreTextIcon onClick={() => onExpand(item.id)}>+</PreTextIcon>
        );
    }
    return <PreTextIcon>&bull;</PreTextIcon>;
};

function Card({ item, onExpand, onCollapse }: CardProps) {
    return (
      <div>
          <span>{getIcon(item, onExpand, onCollapse)}</span>
          <span style={{border: "solid"}}>{item.data.name ? item.data.name : ''}</span>
      </div>
    )
}

export default Card;
