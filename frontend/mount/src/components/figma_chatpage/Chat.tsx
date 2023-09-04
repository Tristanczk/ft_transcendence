import { MessageProps } from "../chatpage/Message";

export function Chat({ currentChannel, messages }: { currentChannel: number, messages: MessageProps[] }) {
	return (
		<div className="Chat w-96 grow shrink basis-0 flex-col justify-start items-start flex">
			<div className="Chatheader w-96 px-5 py-4 bg-zinc-100 rounded-tl-3xl rounded-tr-3xl shadow-inner border border-black border-opacity-0 justify-center items-center gap-6 inline-flex">
				<div className="Profilepicture w-20 h-20 bg-amber-400 rounded-full shadow" />
				<div className="Nickname grow shrink basis-0 self-stretch text-black text-3xl font-normal">Nickname</div>
			</div>
			<div className="Chatbox w-96 grow shrink basis-0 bg-gray-200 bg-opacity-90 shadow-inner flex-col justify-start items-start flex">
				<div className="Frame1 self-stretch h-96 p-7 flex-col justify-start items-start gap-7 flex">
					<div className="Messagebubbleother w-96 h-20 relative">
						<div className="Rectangle8 w-80 h-20 left-[370px] top-0 absolute origin-top-left rotate-180 bg-zinc-300 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
					<div className="Messagebubbleself w-96 h-32 relative">
						<div className="Rectangle9 w-80 h-32 left-0 top-0 absolute bg-blue-500 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
					<div className="Messagebubbleother w-96 h-20 relative">
						<div className="Rectangle8 w-80 h-20 left-[370px] top-0 absolute origin-top-left rotate-180 bg-zinc-300 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
					<div className="Messagebubbleself w-96 h-32 relative">
						<div className="Rectangle9 w-80 h-32 left-0 top-0 absolute bg-blue-500 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
					<div className="Messagebubbleother w-96 h-20 relative">
						<div className="Rectangle8 w-80 h-20 left-[370px] top-0 absolute origin-top-left rotate-180 bg-zinc-300 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
					<div className="Messagebubbleself w-96 h-12 relative">
						<div className="Rectangle7 w-80 h-12 left-0 top-0 absolute bg-blue-500 rounded-3xl shadow-inner border border-black border-opacity-0" />
					</div>
				</div>
			</div>
			<div className="Chatmessage w-96 px-3 py-5 bg-zinc-100 rounded-bl-3xl rounded-br-3xl justify-center items-center gap-2.5 inline-flex">
				<div className="Rectangle11 grow shrink basis-0 h-16 bg-white rounded-3xl" />
				<div className="Ellipse5 w-16 h-16 bg-green-600 rounded-full" />
			</div>
		</div>
	);
}