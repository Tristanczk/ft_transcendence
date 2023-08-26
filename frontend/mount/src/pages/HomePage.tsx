import React from 'react';
import { NAVBAR_HEIGHT } from '../constants';

const GameButton = ({ mode }: { mode: string }) => (
    <button className="flex justify-center items-center py-4 px-8 bg-white border-4 border-black text-black text-2xl font-mono tracking-widest hover:bg-black hover:text-white transition duration-300 w-1/2 max-w-xs">
        {mode}
    </button>
);

const HomePage: React.FC = () => {
    return (
        <div
            className="flex flex-col justify-center items-center bg-rose-600 space-y-4"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            <GameButton mode="CLASSIC" />
            <GameButton mode="BATTLE ROYALE" />
        </div>
    );
};

export default HomePage;
