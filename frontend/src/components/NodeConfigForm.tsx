import React, { useState } from "react";
import { CustomNodeData } from "../types/types";

interface NodeConfigFormProps {
	data: CustomNodeData;
	onSave: (updatedData: CustomNodeData) => void;
}

const NodeConfigForm: React.FC<NodeConfigFormProps> = ({ data, onSave }) => {
	const [formData, setFormData] = useState(data);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label
					htmlFor="label"
					className="block text-sm font-medium text-gray-700"
				>
					Label
				</label>
				<input
					type="text"
					name="label"
					id="label"
					value={formData.label}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			{(data.type === "get" || data.type === "post") && (
				<>
					<div>
						<label
							htmlFor="url"
							className="block text-sm font-medium text-gray-700"
						>
							URL
						</label>
						<input
							type="text"
							name="url"
							id="url"
							value={formData.url || ""}
							onChange={handleChange}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					<div>
						<label
							htmlFor="headers"
							className="block text-sm font-medium text-gray-700"
						>
							Headers (JSON)
						</label>
						<textarea
							name="headers"
							id="headers"
							value={
								typeof formData.headers === "string"
									? formData.headers
									: JSON.stringify(formData.headers, null, 2)
							}
							onChange={handleChange}
							rows={3}
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
					</div>
					{data.type === "post" && (
						<div>
							<label
								htmlFor="body"
								className="block text-sm font-medium text-gray-700"
							>
								Body (JSON)
							</label>
							<textarea
								name="body"
								id="body"
								value={formData.body || ""}
								onChange={handleChange}
								rows={3}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							/>
						</div>
					)}
				</>
			)}
			{formData.response && (
				<div>
					<h3 className="text-lg font-medium text-gray-900">
						Response
					</h3>
					<div className="mt-2 bg-gray-50 p-4 rounded-md">
						<p>
							<strong>Status:</strong> {formData.response.status}{" "}
							{formData.response.statusText}
						</p>
						<p>
							<strong>Headers:</strong>
						</p>
						<pre className="mt-1 text-sm">
							{JSON.stringify(formData.response.headers, null, 2)}
						</pre>
						<p>
							<strong>Data:</strong>
						</p>
						<pre className="mt-1 text-sm">
							{JSON.stringify(formData.response.data, null, 2)}
						</pre>
					</div>
				</div>
			)}
			<div>
				<button
					type="submit"
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Save
				</button>
			</div>
		</form>
	);
};

export default NodeConfigForm;
