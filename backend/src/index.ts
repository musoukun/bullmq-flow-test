import express from "express";
import cors from "cors";
import { workflowQueue, initializeWorker } from "./queue";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initializeWorker();

app.post("/execute", async (req, res) => {
	try {
		const { nodes, edges } = req.body;
		const job = await workflowQueue.add("execute-workflow", {
			nodes,
			edges,
		});
		res.json({ message: "Workflow queued for execution", jobId: job.id });
	} catch (error) {
		console.error("Error queuing workflow:", error);
		res.status(500).json({ error: "Failed to queue workflow" });
	}
});

app.get("/job-status/:jobId", async (req, res) => {
	try {
		const job = await workflowQueue.getJob(req.params.jobId);
		if (!job) {
			return res.status(404).json({ error: "Job not found" });
		}
		const state = await job.getState();
		const progress = await job.progress();
		res.json({ jobId: job.id, state, progress });
	} catch (error) {
		console.error("Error fetching job status:", error);
		res.status(500).json({ error: "Failed to fetch job status" });
	}
});

app.post("/execute-node", async (req, res) => {
	try {
		const { node } = req.body;
		const result = await processNode(node);
		res.json(result);
	} catch (error) {
		console.error("Error executing node:", error);
		res.status(500).json({ error: "Failed to execute node" });
	}
});

app.listen(port, () => {
	console.log(`Backend server running at http://localhost:${port}`);
});
