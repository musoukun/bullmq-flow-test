/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface WorkflowProgressProps {
	progress: any[];
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ progress }) => (
	<div className="absolute bottom-4 left-4 z-10 bg-white dark:bg-gray-800 p-4 rounded shadow-md">
		<h3 className="font-bold mb-2">Workflow Progress</h3>
		{progress.map((node, index) => (
			<div key={index} className="flex items-center mb-2">
				<div
					className={`w-4 h-4 rounded-full mr-2 ${
						node.status === "completed"
							? "bg-green-500"
							: node.status === "failed"
								? "bg-red-500"
								: "bg-yellow-500"
					}`}
				></div>
				<span>
					{node.nodeId}: {node.status}
				</span>
			</div>
		))}
	</div>
);

export default WorkflowProgress;
