import { UserSimplified } from "../../types";

export function FriendElement({ index, friend }: { index: number, friend: UserSimplified }) {
	const connected = friend.isConnected ? "green" : "red";
	const color = index % 2 ? "stone-300" : "zinc-300";


	return (
		<button onClick={() => console.log("miao")} className={`w-96 h-8 px-1.5 py-1 bg-${color} justify-start items-start gap-2.5 inline-flex`}>
			<div className={`w-6 h-6 bg-${connected}-600 rounded-full`} />
			<div className={`grow shrink basis-0 self-stretch text-black text-base font-normal`}>
				{friend.nickname}
			</div>
		</button>
	);
}