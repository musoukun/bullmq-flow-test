import React from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "react-beautiful-dnd";
import { Workflow, Column, Card } from "../../types/workflow";

interface DragAndDropProps {
	workflow: Workflow;
	onDragEnd: (result: DropResult) => void;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ workflow, onDragEnd }) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="flex overflow-x-auto">
				{workflow.columns.map((column: Column) => (
					<Droppable key={column.id} droppableId={column.id}>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className="bg-gray-100 p-4 rounded-lg mr-4 w-80"
							>
								<h2 className="font-bold mb-4">
									{column.title}
								</h2>
								{column.cards.map(
									(card: Card, index: number) => (
										<Draggable
											key={card.id}
											draggableId={card.id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className="bg-white p-4 mb-4 rounded shadow"
												>
													<h3 className="font-bold mb-2">
														{card.title}
													</h3>
													<p className="text-sm text-gray-600">
														Type: {card.type}
													</p>
												</div>
											)}
										</Draggable>
									)
								)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				))}
			</div>
		</DragDropContext>
	);
};

export default DragAndDrop;
