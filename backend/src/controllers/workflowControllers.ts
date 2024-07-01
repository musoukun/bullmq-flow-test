import { Request, Response } from "express";
import { Workflow } from "../models/Workflow";

export const getWorkflow = async (req: Request, res: Response) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) {
			return res.status(404).json({ message: "Workflow not found" });
		}
		res.json(workflow);
	} catch (error) {
		console.error("Error fetching workflow:", error);
		res.status(500).json({ message: "Error fetching workflow" });
	}
};

export const getWorkflows = async (req: Request, res: Response) => {
	try {
		const workflows = await Workflow.find();
		res.json(workflows);
	} catch (error) {
		console.error("Error fetching workflows:", error);
		res.status(500).json({ message: "Error fetching workflows" });
	}
};

export const createWorkflow = async (req: Request, res: Response) => {
	try {
		console.log("Received request body:", req.body);

		if (!req.body.name || typeof req.body.name !== "string") {
			return res.status(400).json({
				message: "Workflow name is required and must be a string",
			});
		}

		const newWorkflow = new Workflow({
			name: req.body.name,
			columns: [
				{
					id: "column-1",
					title: "To Do",
					cards: [],
				},
				{
					id: "column-2",
					title: "In Progress",
					cards: [],
				},
				{
					id: "column-3",
					title: "Done",
					cards: [],
				},
			],
		});

		const savedWorkflow = await newWorkflow.save();
		console.log("Saved workflow:", savedWorkflow);

		res.status(201).json(savedWorkflow);
	} catch (error: any) {
		console.error("Error in createWorkflow:", error);
		res.status(500).json({
			message: "Error creating workflow",
			error: error.message,
		});
	}
};
export const executeWorkflow = async (req: Request, res: Response) => {
	try {
		const workflow = await Workflow.findById(req.params.id);
		if (!workflow) {
			return res.status(404).json({ message: "Workflow not found" });
		}
		// Execute workflow logic here
		res.json({ message: "Workflow executed successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error executing workflow" });
	}
};

export const updateWorkflow = async (req: Request, res: Response) => {
	try {
		const updatedWorkflow = await Workflow.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!updatedWorkflow) {
			return res.status(404).json({ message: "Workflow not found" });
		}
		res.json(updatedWorkflow);
	} catch (error) {
		res.status(400).json({ message: "Error updating workflow" });
	}
};

export const deleteWorkflow = async (req: Request, res: Response) => {
	try {
		const deletedWorkflow = await Workflow.findByIdAndDelete(req.params.id);
		if (!deletedWorkflow) {
			return res.status(404).json({ message: "Workflow not found" });
		}
		res.json({ message: "Workflow deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting workflow" });
	}
};
