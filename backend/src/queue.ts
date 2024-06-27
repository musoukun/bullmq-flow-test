import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import axios from "axios";

const connection = new IORedis();

export const workflowQueue = new Queue("workflow", { connection });

export const initializeWorker = () => {
	const worker = new Worker(
		"workflow",
		async (job: Job) => {
			console.log("Processing job:", job.id);
			const { nodes, edges } = job.data;

			const results = [];
			for (const node of nodes) {
				try {
					const result = await processNode(node);
					results.push({
						nodeId: node.id,
						status: "completed",
						result,
					});
					await job.updateProgress(results);
				} catch (error: any) {
					results.push({
						nodeId: node.id,
						status: "failed",
						error: error.message,
					});
					await job.updateProgress(results);
				}
			}

			return results;
		},
		{ connection }
	);

	worker.on("completed", (job) => {
		console.log(`Job ${job.id} has completed.`);
	});

	worker.on("failed", (job: any, err) => {
		console.error(`Job ${job.id} has failed with ${err.message}`);
	});
};

export async function processNode(node: any) {
	console.log(`Processing node: ${node.id}`);
	switch (node.type) {
		case "inject":
			return { message: "Workflow started" };
		case "get":
			try {
				const response = await axios.get(node.data.url, {
					headers: JSON.parse(node.data.headers || "{}"),
				});
				return {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
					headers: response.headers,
				};
			} catch (error) {
				if (axios.isAxiosError(error)) {
					throw new Error(`GET request failed: ${error.message}`);
				} else {
					throw error;
				}
			}
		case "post":
			try {
				const response = await axios.post(
					node.data.url,
					JSON.parse(node.data.body || "{}"),
					{
						headers: JSON.parse(node.data.headers || "{}"),
					}
				);
				return {
					status: response.status,
					statusText: response.statusText,
					data: response.data,
					headers: response.headers,
				};
			} catch (error) {
				if (axios.isAxiosError(error)) {
					throw new Error(`POST request failed: ${error.message}`);
				} else {
					throw error;
				}
			}
		default:
			throw new Error(`Unknown node type: ${node.type}`);
	}
}
