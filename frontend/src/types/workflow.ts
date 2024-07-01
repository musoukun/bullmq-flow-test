/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Card {
	id: string;
	title: string;
	type: "inject" | "get" | "post";
	config: Record<string, any>;
}

export interface Column {
	id: string;
	title: string;
	cards: Card[];
}

export interface Workflow {
	id: string;
	name: string;
	columns: Column[];
}

export interface ExecutionResult {
	status: "success" | "error";
	data?: any;
	error?: string;
}
