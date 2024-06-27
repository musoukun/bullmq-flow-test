import React from "react";

const SearchBar: React.FC = () => {
	return (
		<input
			type="text"
			placeholder="パイプラインをフィルター"
			className="p-2 w-[400px] border border-gray-300 rounded"
			name="filter-pipelines"
		/>
	);
};

export default SearchBar;
