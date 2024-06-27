/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from "reactflow";

export interface CustomNodeData {
	label: string;
	id: string;
	name: string;
	type: "inject" | "get" | "post";
	url?: string;
	headers?: string;
	body?: string;
	response?: {
		status: number;
		statusText: string;
		data: any;
		headers: any;
	};
	onExecute?: (id: string) => void;
	onConfigure?: () => void;
	isExecuting?: boolean;
	status?: "success" | "error" | null;
	error?: string | null;
}

export type CustomNode = Node<CustomNodeData>;
