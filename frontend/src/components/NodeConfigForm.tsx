// NodeConfigForm.tsx
import React, { useState } from "react";
import { CustomNodeData } from "../types/types";

interface NodeConfigFormProps {
	data: CustomNodeData;
	onSave: (updatedData: CustomNodeData) => void;
}

const NodeConfigForm: React.FC<NodeConfigFormProps> = ({ data, onSave }) => {
	const [formData, setFormData] = useState(data);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.label) newErrors.label = "Label is required";
		if ((data.type === "get" || data.type === "post") && !formData.url) {
			newErrors.url = "URL is required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			onSave(formData);
		}
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
					className={`mt-1 block w-full border ${
						errors.label ? "border-red-500" : "border-gray-300"
					} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
				/>
				{errors.label && (
					<p className="mt-1 text-sm text-red-500">{errors.label}</p>
				)}
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
							Headers
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
					<div>
						<label
							htmlFor="body"
							className="block text-sm font-medium text-gray-700"
						>
							Body
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
				</>
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
