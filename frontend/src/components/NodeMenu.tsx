import React from "react";

type NodeMenuProps = {
	onDragStart: (
		event: React.DragEvent<HTMLDivElement>,
		nodeType: string
	) => void;
};

const NodeMenu: React.FC<NodeMenuProps> = ({ onDragStart }) => {
	const nodeTypes = [
		{ type: "inject", label: "Inject Node", color: "bg-blue-500" },
		{ type: "get", label: "GET Node", color: "bg-green-500" },
		{ type: "post", label: "POST Node", color: "bg-red-500" },
	];

	return (
		<div className="w-64 bg-gray-100 p-4 flex flex-col space-y-2">
			{nodeTypes.map((node) => (
				<div
					key={node.type}
					className={`${node.color} text-white px-4 py-2 rounded cursor-move`}
					onDragStart={(event) => onDragStart(event, node.type)}
					draggable
				>
					{node.label}
				</div>
			))}
		</div>
	);
};

export default NodeMenu;
