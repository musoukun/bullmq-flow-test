import React from "react";
import { useNavigate } from "react-router-dom";

const PipelinesList: React.FC = () => {
	const navigate = useNavigate();

	const handlePlayClick = (id: string | number) => {
		navigate(`/flow/${id}`);
	};

	return (
		<div className="bg-white rounded shadow">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							ステータス
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							パイプライン番号
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							パイプライン名
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							トリガー元
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							説明
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					<tr>
						<td className="px-6 py-4 whitespace-nowrap">
							<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
								running
							</span>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							#146411330
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							Sample Pipeline 1
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<i className="fas fa-user-circle text-2xl text-gray-800"></i>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div> Merge branch 'nicolasdu... </div>
							<div className="text-xs text-gray-500">
								⌁31649 - dacc7ea3
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-2">
							<button
								className="p-2 bg-gray-200 text-gray-800 rounded"
								onClick={() => handlePlayClick("testID")}
							>
								<i className="fas fa-play"></i>
							</button>
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-wrench"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 whitespace-nowrap">
							<span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
								failed
							</span>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							#146410995
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							Sample Pipeline 2
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<i className="fas fa-user-circle text-2xl text-gray-800"></i>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div> Merge branch '12-10-sta... </div>
							<div className="text-xs text-gray-500">
								⌁32306 - 9a5d2aa1
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-2">
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-play"></i>
							</button>
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-wrench"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 whitespace-nowrap">
							<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
								passed
							</span>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							#146410705
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							Sample Pipeline 3
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<i className="fas fa-user-circle text-2xl text-gray-800"></i>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div> Merge branch '210018-re... </div>
							<div className="text-xs text-gray-500">
								⌁31801 - 42738af2
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-2">
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-play"></i>
							</button>
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-wrench"></i>
							</button>
						</td>
					</tr>
					<tr>
						<td className="px-6 py-4 whitespace-nowrap">
							<span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
								passed
							</span>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							#146410223
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							Sample Pipeline 4
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<i className="fas fa-user-circle text-2xl text-gray-800"></i>
						</td>
						<td className="px-6 py-4 whitespace-nowrap">
							<div> Merge branch '22691-ext... </div>
							<div className="text-xs text-gray-500">
								⌁master - d635c709
							</div>
						</td>
						<td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-2">
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-play"></i>
							</button>
							<button className="p-2 bg-gray-200 text-gray-800 rounded">
								<i className="fas fa-wrench"></i>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default PipelinesList;
