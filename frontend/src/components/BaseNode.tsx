// BaseNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";
import { CustomNodeData } from "../types/types";

interface BaseNodeProps {
	data: CustomNodeData;
	color: string;
	executeLabel: string;
	showSourceHandle?: boolean;
	showTargetHandle?: boolean;
}

const BaseNode: React.FC<BaseNodeProps> = ({
	data,
	color,
	executeLabel,
	showSourceHandle = true,
	showTargetHandle = true,
}) => {
	return (
		<div className={`bg-${color}-100 p-2 rounded-md shadow`}>
			{showTargetHandle && (
				<Handle type="target" position={Position.Left} />
			)}
			<div>{data.label}</div>
			<div className="flex justify-between mt-2">
				<button
					className={`bg-${color}-500 text-white px-2 py-1 rounded`}
					onClick={() => data.onExecute && data.onExecute(data.id)}
				>
					{executeLabel}
				</button>
				<button
					className="bg-gray-500 text-white px-2 py-1 rounded"
					onClick={data.onConfigure}
				>
					Configure
				</button>
			</div>
			{showSourceHandle && (
				<Handle type="source" position={Position.Right} />
			)}
		</div>
	);
};

export default BaseNode;
