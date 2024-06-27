// GetNode.tsx
import React from "react";
import BaseNode from "./BaseNode";
import { CustomNodeData } from "../types/types";

const GetNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
	return <BaseNode data={data} color="green" executeLabel="GET" />;
};

export default GetNode;
