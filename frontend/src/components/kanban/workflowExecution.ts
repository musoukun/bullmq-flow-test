import axios from "axios";
import { ExecutionResult } from "../../types/workflow";

const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

export const executeCard = async (cardId: string): Promise<ExecutionResult> => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/workflow/execute-card/${cardId}`
		);
		return {
			status: "success",
			data: response.data,
		};
	} catch (error) {
		return {
			status: "error",
			error:
				error instanceof Error
					? error.message
					: "Unknown error occurred",
		};
	}
};

export const executeWorkflow = async (
	workflowId: string
): Promise<ExecutionResult> => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/workflow/execute/${workflowId}`
		);
		return {
			status: "success",
			data: response.data,
		};
	} catch (error) {
		return {
			status: "error",
			error:
				error instanceof Error
					? error.message
					: "Unknown error occurred",
		};
	}
};
