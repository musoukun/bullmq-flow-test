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
const express_1 = __importDefault(require("express"));
const workflowEngine_1 = require("./workflowEngine");
const app = (0, express_1.default)();
app.use(express_1.default.json());
let workflows = [];
app.post("/api/workflows", (req, res) => {
    const workflow = req.body;
    workflows.push(workflow);
    res.status(201).json(workflow);
});
app.get("/api/workflows", (req, res) => {
    res.json(workflows);
});
app.post("/api/workflows/:id/execute", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workflow = workflows.find((w) => w.id === req.params.id);
    if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
    }
    try {
        const result = yield (0, workflowEngine_1.executeWorkflow)(workflow);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Workflow execution failed" });
    }
}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
