import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "../../types/workflow";

interface KanbanCardProps {
	card: Card;
	index: number;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, index }) => {
	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className="bg-white p-4 mb-4 rounded shadow"
				>
					<h3 className="font-bold mb-2">{card.title}</h3>
					<p className="text-sm text-gray-600">Type: {card.type}</p>
				</div>
			)}
		</Draggable>
	);
};

export default KanbanCard;
