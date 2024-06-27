import React from "react";

interface HeaderProps {
	onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSave }) => (
	<div className="bg-gray-400 text-white p-1 flex justify-between items-center">
		<h1 className="text-2xl font-bold">Workflow Builder</h1>
		<button
			onClick={onSave}
			className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		>
			Save Flow
		</button>
	</div>
);

export default Header;
