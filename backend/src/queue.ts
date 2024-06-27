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
				} catch (error) {
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

	worker.on("failed", (job, err) => {
		console.error(`Job ${job.id} has failed with ${err.message}`);
	});
};

async function processNode(node: any) {
	console.log(`Processing node: ${node.id}`);
	switch (node.type) {
		case "inject":
			return { message: "Workflow started" };
		case "get":
			return await axios.get(node.data.url, {
				headers: node.data.headers,
			});
		case "post":
			return await axios.post(node.data.url, node.data.body, {
				headers: node.data.headers,
			});
		default:
			throw new Error(`Unknown node type: ${node.type}`);
	}
}
