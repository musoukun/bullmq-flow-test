const express = require("express");
const { Queue, Worker } = require("bullmq");
const Redis = require("ioredis");
const cors = require("cors");

const app = express();
const port = 3000;

// Redisの設定
const redisOptions = {
	host: "localhost", // 必要に応じて変更
	port: 6379, // 必要に応じて変更
	maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisOptions);

const jobQueue = new Queue("jobQueue", {
	connection: redisConnection,
});

app.use(cors());
app.use(express.json());

app.post("/api/jobs", async (req, res) => {
	const { url } = req.body;
	try {
		const job = await jobQueue.add("fetch-url", { url });
		res.status(201).json({ id: job.id, name: job.name, url: job.data.url });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/api/jobs", async (req, res) => {
	const jobs = await jobQueue.getJobs();
	res.json(
		jobs.map((job) => ({
			id: job.id,
			name: job.name,
			url: job.data.url,
			status: job.getState(),
		}))
	);
});

const worker = new Worker(
	"jobQueue",
	async (job) => {
		// ジョブ処理のロジック
		console.log(`Processing job ${job.id} with url ${job.data.url}`);
	},
	{
		connection: redisConnection,
	}
);

worker.on("completed", (job) => {
	console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
	console.log(`Job ${job.id} failed: ${err.message}`);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
