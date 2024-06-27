// PostNode.tsx
import React from "react";
import BaseNode from "./BaseNode";
import { CustomNodeData } from "../types/types";

const PostNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
	return <BaseNode data={data} color="red" executeLabel="POST" />;
};

export default PostNode;
