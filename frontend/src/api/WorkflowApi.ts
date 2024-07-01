/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { CustomNode } from "../types/types";
import { Edge } from "reactflow";
import { Workflow } from "../types/workflow";

const API_URL = "http://localhost:3000/api";

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

export const fetchWorkflow = async (id: string): Promise<Workflow> => {
	try {
		const response = await axios.get(`${API_URL}/workflow/${id}`);
		console.log("Fetched workflow data:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching workflow:", error);
		if (axios.isAxiosError(error)) {
			console.error("Response data:", error.response?.data);
			console.error("Response status:", error.response?.status);
		}
		throw error;
	}
};

export const fetchWorkflows = async (): Promise<Workflow[]> => {
	try {
		const response = await axios.get(`${API_URL}/workflow`);
		console.log("Fetched workflows data:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching workflows:", error);
		throw error;
	}
};
export const createWorkflow = async (workflowData: {
	name: string;
}): Promise<Workflow> => {
	try {
		console.log("Sending workflow data:", workflowData);
		const response = await axios.post(`${API_URL}/workflow`, workflowData);
		console.log("API Response:", response.data);
		return response.data;
	} catch (error) {
		console.error("Error creating workflow:", error);
		if (axios.isAxiosError(error) && error.response) {
			console.error("Error response:", error.response.data);
		}
		throw error;
	}
};

export const updateWorkflow = async (
	id: string,
	workflow: Workflow
): Promise<Workflow> => {
	const response = await axios.put(`${API_URL}/workflow/${id}`, workflow);
	return response.data;
};

export const deleteWorkflow = async (id: string): Promise<void> => {
	await axios.delete(`${API_URL}/workflow/${id}`);
};
