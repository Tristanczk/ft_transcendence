import React from 'react';
import { NAVBAR_HEIGHT } from '../constants';

const GameButton = ({ mode }: { mode: string }) => (
    <button className="py-4 px-8 bg-white border-4 border-black text-black text-2xl font-mono tracking-widest hover:bg-black hover:text-white transition duration-300">
        {mode}
    </button>
);

const HomePage: React.FC = () => {
    return (
        <div
            className="flex justify-center items-center bg-rose-600"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            <GameButton mode="NEW GAME" />
        </div>
    );
};

export default HomePage;
