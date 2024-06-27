import React from "react";
// import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import Button from "./Button";
import PipelinesList from "./PipelinesList";

const MainComponent: React.FC = () => {
	return (
		<div className="flex-1 bg-gray-100 p-8">
			<div className="flex justify-between items-center mb-8">
				<SearchBar />
				<div className="space-x-4">
					<Button />
				</div>
			</div>
			<PipelinesList />
		</div>
	);
};

export default MainComponent;
