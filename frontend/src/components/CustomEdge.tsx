import React from "react";
import { EdgeProps, getBezierPath } from "reactflow";

const CustomEdge: React.FC<EdgeProps> = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
}) => {
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<path
			id={id}
			style={style}
			className="react-flow__edge-path stroke-gray-400 stroke-2"
			d={edgePath}
		/>
	);
};

export default CustomEdge;
