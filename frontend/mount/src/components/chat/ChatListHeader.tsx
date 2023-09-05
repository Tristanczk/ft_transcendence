export default function ChatPage() {
	return (
		<div className="flex sm:items-center justify-between py-1 bg-slate-100 px-3 rounded-tl-3xl rounded-tr-3xl shadow-2xl">
			<div className="relative flex items-center space-x-4">
				<div className="flex flex-col leading-tight">
					<div className="text-2xl mt-1 flex items-center"><span className="text-gray-700 mr-3">Friends</span></div>
				</div>
			</div>
			<div className="relative flex items-center space-x-4">
				<div className="flex flex-col leading-tight">
					<div className="text-2xl mt-1 flex items-center"><span className="text-gray-700 mr-3">Channels</span></div>
				</div>
			</div>
		</div>
	);
}