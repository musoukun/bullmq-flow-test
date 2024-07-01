import express from "express";
import cors from "cors";
import { workflowQueue, initializeWorker, processNode } from "./queue";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { workflowRoutes } from "./routes/workflowRoutes";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

// Mongoose connection with authentication
const MONGODB_URI =
	"mongodb://root:example@localhost:27017/workflow_db?authSource=admin";

mongoose
	.connect(MONGODB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

const flowsFilePath = path.join(__dirname, "../flow/flows.json");

initializeWorker();

app.use("/api/workflow", workflowRoutes);

// フローファイルが存在しない場合に初期化する関数
async function initializeFlowFile() {
	try {
		await fs.access(flowsFilePath);
	} catch (error) {
		const initialFlow = {
			id: "default",
			nodes: [],
			edges: [],
		};
		await fs.writeFile(flowsFilePath, JSON.stringify(initialFlow, null, 2));
		console.log("Initialized flows.json file");
	}
}

// サーバー起動時にフローファイルを初期化
initializeFlowFile();

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
		const progress = await (job.progress as () => Promise<number>)();
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

// フローを保存するエンドポイント
app.post("/save-flow", async (req, res) => {
	try {
		const flowData = req.body;
		await fs.writeFile(flowsFilePath, JSON.stringify(flowData, null, 2));
		res.json({ message: "Flow saved successfully" });
	} catch (error) {
		console.error("Error saving flow:", error);
		res.status(500).json({ error: "Failed to save flow" });
	}
});

// フローを取得するエンドポイント
app.get("/get-flow", async (req, res) => {
	try {
		const flowData = await fs.readFile(flowsFilePath, "utf-8");
		res.json(JSON.parse(flowData));
	} catch (error) {
		console.error("Error reading flow:", error);
		res.status(500).json({ error: "Failed to read flow" });
	}
});

app.use(bodyParser.json());

app.listen(port, () => {
	console.log(`Backend server running at http://localhost:${port}`);
});
