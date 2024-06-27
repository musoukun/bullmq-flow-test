import React from "react";

interface StatusDisplayProps {
	error: string | null;
	isExecuting: boolean;
	configSaved: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
	error,
	isExecuting,
	configSaved,
}) => (
	<>
		{error && (
			<div className="absolute bottom-4 right-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
				{error}
			</div>
		)}
		{isExecuting && (
			<div className="absolute bottom-4 right-4 z-10 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
				Executing workflow...
			</div>
		)}
		{configSaved && (
			<div className="absolute bottom-4 right-4 z-10 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
				Configuration saved successfully!
			</div>
		)}
	</>
);

export default StatusDisplay;
