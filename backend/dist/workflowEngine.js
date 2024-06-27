"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWorkflow = void 0;
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const workflowQueue = new bullmq_1.Queue("workflow");
const queueEvents = new bullmq_1.QueueEvents("workflow");
const executeWorkflowNode = (node, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response;
        if (node.type === "get") {
            response = yield axios_1.default.get(node.endpoint, { params: data });
        }
        else {
            response = yield axios_1.default.post(node.endpoint, data);
        }
        return response.data;
    }
    catch (error) {
        console.error(`Error executing node ${node.id}:`, error);
        throw error;
    }
});
const workerFunction = (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const workflow = job.data.workflow;
    let currentNodeId = (_a = workflow.nodes[0]) === null || _a === void 0 ? void 0 : _a.id;
    let data = {};
    while (currentNodeId) {
        const currentNode = workflow.nodes.find((node) => node.id === currentNodeId);
        if (!currentNode) {
            throw new Error(`Node with id ${currentNodeId} not found`);
        }
        data = yield executeWorkflowNode(currentNode, data);
        currentNodeId = currentNode.nextNodeId;
    }
    return data;
});
const worker = new bullmq_1.Worker("workflow", workerFunction);
const executeWorkflow = (workflow) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield workflowQueue.add("execute", { workflow });
    return job.waitUntilFinished(queueEvents);
});
exports.executeWorkflow = executeWorkflow;
// エラーハンドリングとクリーンアップ
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    yield worker.close();
    yield workflowQueue.close();
    yield queueEvents.close();
}));
