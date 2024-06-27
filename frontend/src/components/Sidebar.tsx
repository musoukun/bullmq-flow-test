/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

type SidebarProps = {
	onDragStart: (
		event: React.DragEvent<HTMLDivElement>,
		nodeType: string
	) => void;
};

const Sidebar = ({ onDragStart }: SidebarProps) => {
	const onDragStartHandler = (
		event: React.DragEvent<HTMLDivElement>,
		nodeType: string
	) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<aside className="w-64 bg-gray-100 p-4 flex flex-col space-y-2">
			<div
				className="bg-blue-500 text-white px-4 py-2 rounded cursor-move"
				onDragStart={(event) => onDragStartHandler(event, "inject")}
				draggable
			>
				Inject Node
			</div>
			<div
				className="bg-green-500 text-white px-4 py-2 rounded cursor-move"
				onDragStart={(event) => onDragStartHandler(event, "get")}
				draggable
			>
				GET Node
			</div>
			<div
				className="bg-red-500 text-white px-4 py-2 rounded cursor-move"
				onDragStart={(event) => onDragStartHandler(event, "post")}
				draggable
			>
				POST Node
			</div>
		</aside>
	);
};

export default Sidebar;
