import React, { useState } from "react";
import axios from "axios";

const AddJobForm: React.FC = () => {
	const [url, setUrl] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:3000/api/jobs", { url });
			alert("ジョブが追加されました");
			setUrl("");
		} catch (error) {
			console.error(error);
			alert("ジョブの追加に失敗しました");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				URL:
				<input
					type="text"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</label>
			<button type="submit">追加</button>
		</form>
	);
};

export default AddJobForm;
