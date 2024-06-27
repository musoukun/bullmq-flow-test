import React, { useEffect, useState } from "react";
import axios from "axios";

interface Job {
	id: string;
	name: string;
	url: string;
	status: string;
}

const JobList: React.FC = () => {
	const [jobs, setJobs] = useState<Job[]>([]);

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/jobs"
				);
				setJobs(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchJobs();
	}, []);

	return (
		<div>
			<h2>ジョブ一覧</h2>
			<ul>
				{jobs.map((job) => (
					<li key={job.id}>
						{job.name} - {job.url} - {job.status}
					</li>
				))}
			</ul>
		</div>
	);
};

export default JobList;
