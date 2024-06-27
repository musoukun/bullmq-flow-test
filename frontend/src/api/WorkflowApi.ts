import axios from "axios";
import { CustomNode } from "../types/types";
import { Edge } from "reactflow";

const API_URL = "http://localhost:3000";

export const executeWorkflow = async (nodes: CustomNode[], edges: Edge[]) => {
	try {
		const response = await axios.post(`${API_URL}/execute`, {
			nodes,
			edges,
		});
		return response.data;
	} catch (error) {
		console.error("Error executing workflow:", error);
		throw error;
	}
};

export const executeNode = async (node: CustomNode) => {
	try {
		const response = await axios.post(`${API_URL}/execute-node`, { node });
		return response.data;
	} catch (error) {
		console.error("Error executing node:", error);
		throw error;
	}
};
