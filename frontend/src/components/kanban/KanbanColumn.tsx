import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Column } from "../../types/workflow";
import KanbanCard from "./KanbanCard";

interface KanbanColumnProps {
	column: Column;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
	return (
		<div className="bg-white p-4 rounded-lg shadow-md mr-4 w-80 flex-shrink-0">
			<h2 className="font-bold mb-4 text-lg">{column.title}</h2>
			<Droppable droppableId={column.id}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className="min-h-[200px]"
					>
						{column.cards.map((card, index) => (
							<KanbanCard
								key={card.id}
								card={card}
								index={index}
							/>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);
};

export default KanbanColumn;
