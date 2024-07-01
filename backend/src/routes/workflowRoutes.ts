import express from "express";
import {
	getWorkflow,
	createWorkflow,
	updateWorkflow,
	deleteWorkflow,
} from "../controllers/workflowControllers";

const router = express.Router();

router.get("/", getWorkflow);
router.get("/:id", getWorkflow);
router.post("/", createWorkflow);
router.put("/:id", updateWorkflow);
router.delete("/:id", deleteWorkflow);

export const workflowRoutes = router;
