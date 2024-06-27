import React from "react";
import BaseNode from "./BaseNode";
import { CustomNodeData } from "../types/types";

const InjectNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
	return (
		<BaseNode
			data={data}
			color="blue"
			executeLabel="Execute"
			showTargetHandle={false}
		/>
	);
};

export default InjectNode;
