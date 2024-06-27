// flowConstants.ts

import { Node, Edge } from "reactflow";
import InjectNode from "../InjectNode";
import GetNode from "../GetNode";
import PostNode from "../PostNode";
import CustomEdge from "../CustomEdge";

// カスタムノードタイプの定義
export const nodeTypes = {
	inject: InjectNode,
	get: GetNode,
	post: PostNode,
};

// カスタムエッジタイプの定義
export const edgeTypes = {
	custom: CustomEdge,
};

// 初期ノードの定義
export const initialNodes: Node[] = [
	{
		id: "1",
		type: "inject",
		position: { x: 100, y: 100 },
		data: { label: "Inject Node" },
	},
	{
		id: "2",
		type: "get",
		position: { x: 400, y: 100 },
		data: { label: "Get Node" },
	},
	{
		id: "3",
		type: "post",
		position: { x: 700, y: 100 },
		data: { label: "Post Node" },
	},
];

// 初期エッジの定義
export const initialEdges: Edge[] = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		type: "custom",
	},
	{
		id: "e2-3",
		source: "2",
		target: "3",
		type: "custom",
	},
];
