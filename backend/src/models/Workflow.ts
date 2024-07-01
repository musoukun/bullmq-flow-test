import mongoose, { Schema, Document } from "mongoose";

export interface IWorkflow extends Document {
	name: string;
	columns: {
		id: string;
		title: string;
		cards: {
			id: string;
			title: string;
			type: string;
			config: Record<string, any>;
		}[];
	}[];
}

const WorkflowSchema: Schema = new Schema({
	name: { type: String, required: true },
	columns: [
		{
			id: { type: String, required: true },
			title: { type: String, required: true },
			cards: [
				{
					id: { type: String, required: true },
					title: { type: String, required: true },
					type: { type: String, required: true },
					config: { type: Schema.Types.Mixed },
				},
			],
		},
	],
});

export const Workflow = mongoose.model<IWorkflow>("Workflow", WorkflowSchema);
