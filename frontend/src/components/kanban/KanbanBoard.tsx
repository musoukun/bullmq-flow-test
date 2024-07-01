import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Workflow, Column } from "../../types/workflow";
import KanbanColumn from "./KanbanColumn";
import { fetchWorkflow, updateWorkflow } from "../../api/WorkflowApi";

const KanbanBoard: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [workflow, setWorkflow] = useState<Workflow | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadWorkflow = async () => {
			if (id) {
				try {
					setLoading(true);
					const data = await fetchWorkflow(id);
					setWorkflow(data);
					setError(null);
				} catch (err) {
					console.error("Error fetching workflow:", err);
					setError("Failed to load workflow. Please try again.");
				} finally {
					setLoading(false);
				}
			} else {
				setError("No workflow ID provided.");
				setLoading(false);
			}
		};
		loadWorkflow();
	}, [id]);

	const onDragEnd = async (result: DropResult) => {
		const { source, destination } = result;

		// ドロップ先がない場合は何もしない
		if (!destination) return;

		// 同じ位置にドロップした場合は何もしない
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		// ワークフローが存在しない場合は何もしない
		if (!workflow) return;

		const newWorkflow = { ...workflow };
		const sourceColumn = newWorkflow.columns.find(
			(col) => col.id === source.droppableId
		);
		const destColumn = newWorkflow.columns.find(
			(col) => col.id === destination.droppableId
		);

		if (!sourceColumn || !destColumn) return;

		if (source.droppableId === destination.droppableId) {
			// 同じ列内での移動
			const newCards = Array.from(sourceColumn.cards);
			const [reorderedItem] = newCards.splice(source.index, 1);
			newCards.splice(destination.index, 0, reorderedItem);

			const newColumn: Column = {
				...sourceColumn,
				cards: newCards,
			};

			const columnIndex = newWorkflow.columns.findIndex(
				(col) => col.id === newColumn.id
			);
			newWorkflow.columns[columnIndex] = newColumn;
		} else {
			// 異なる列への移動
			const sourceCards = Array.from(sourceColumn.cards);
			const [movedItem] = sourceCards.splice(source.index, 1);
			const destCards = Array.from(destColumn.cards);
			destCards.splice(destination.index, 0, movedItem);

			const newSourceColumn: Column = {
				...sourceColumn,
				cards: sourceCards,
			};

			const newDestColumn: Column = {
				...destColumn,
				cards: destCards,
			};

			const sourceColumnIndex = newWorkflow.columns.findIndex(
				(col) => col.id === sourceColumn.id
			);
			const destColumnIndex = newWorkflow.columns.findIndex(
				(col) => col.id === destColumn.id
			);

			newWorkflow.columns[sourceColumnIndex] = newSourceColumn;
			newWorkflow.columns[destColumnIndex] = newDestColumn;
		}

		setWorkflow(newWorkflow);

		try {
			await updateWorkflow(newWorkflow.id, newWorkflow);
		} catch (error) {
			console.error("Failed to update workflow:", error);
			setError("Failed to update workflow. Changes may not be saved.");
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	if (error) {
		return <div className="text-red-500 text-center mt-8">{error}</div>;
	}

	if (!workflow) {
		return (
			<div className="text-center mt-8">
				<p>No workflow data available.</p>
				<p>Workflow ID: {id}</p>
				<button
					onClick={() => navigate("/pipelines")}
					className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Back to Pipelines
				</button>
			</div>
		);
	}

	if (!workflow.columns || workflow.columns.length === 0) {
		// 列がない場合、デフォルトの列を作成
		workflow.columns = [
			{ id: "column-1", title: "To Do", cards: [] },
			{ id: "column-2", title: "In Progress", cards: [] },
			{ id: "column-3", title: "Done", cards: [] },
		];
		// ワークフローを更新
		updateWorkflow(workflow.id, workflow).catch(console.error);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="flex overflow-x-auto p-4 bg-gray-100 min-h-screen">
				{workflow.columns.map((column) => (
					<KanbanColumn key={column.id} column={column} />
				))}
			</div>
		</DragDropContext>
	);
};

export default KanbanBoard;
