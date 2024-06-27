/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from "reactflow";

export interface CustomNodeData {
	onConfigure?: () => void; // オプショナルに変更
	label: string;
	id: string;
	name: string;
	type: "inject" | "get" | "post";
	onExecute?: (id: string) => void;
	onSettings?: () => void;
	status?: "success" | "error" | null;
	isExecuting?: boolean;
	result?: any;
	error?: string | null;
	url?: string;
	headers?: Record<string, string>;
	body?: string;
}

export type CustomNode = Node<CustomNodeData>;
