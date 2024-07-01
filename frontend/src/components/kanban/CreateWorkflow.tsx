import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkflow } from "../../api/WorkflowApi";
import axios from "axios";

const CreateWorkflow: React.FC = () => {
	const [name, setName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const newWorkflow = await createWorkflow({ name });
			console.log("New workflow created:", newWorkflow);
			navigate(`/flow/${newWorkflow.id}`);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage =
					error.response?.data?.message || error.message;
				setError(`Failed to create workflow: ${errorMessage}`);
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
			console.error("Error creating workflow:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<h2 className="text-2xl font-bold mb-5">Create New Workflow</h2>
			{error && <div className="text-red-500 mb-4">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Workflow Name
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						required
					/>
				</div>
				<button
					type="submit"
					className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
					disabled={isLoading}
				>
					{isLoading ? "Creating..." : "Create Workflow"}
				</button>
			</form>
		</div>
	);
};

export default CreateWorkflow;
