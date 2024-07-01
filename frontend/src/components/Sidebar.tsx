import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBars, FaCode, FaPlus } from "react-icons/fa";

const Sidebar: React.FC = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const navigate = useNavigate();

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div
			className={`bg-gray-800 text-white h-full transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-16"}`}
		>
			<div className="flex justify-between items-center p-4 border-b border-gray-700">
				{isExpanded && (
					<div className="text-2xl font-bold">WF Builder</div>
				)}
				<button
					onClick={toggleExpand}
					className="text-white focus:outline-none p-2 hover:bg-gray-700 rounded"
				>
					<FaBars size={20} />
				</button>
			</div>
			<div
				className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
				onClick={() => navigate("/")}
			>
				<FaHome size={20} />
				{isExpanded && <span className="ml-3">ダッシュボード</span>}
			</div>
			<div
				className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
				onClick={() => navigate("/pipelines")}
			>
				<FaCode size={20} />
				{isExpanded && <span className="ml-3">パイプライン</span>}
			</div>
			<div
				className="p-4 flex items-center hover:bg-gray-700 cursor-pointer"
				onClick={() => navigate("/create-workflow")}
			>
				<FaPlus size={20} />
				{isExpanded && <span className="ml-3">新規ワークフロー</span>}
			</div>
		</div>
	);
};

export default Sidebar;
