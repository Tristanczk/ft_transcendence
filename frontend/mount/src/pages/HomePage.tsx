import React from 'react';
import { NAVBAR_HEIGHT } from '../constants';
import { useNavigate } from 'react-router-dom';

const GameButton = ({
    mode,
    onClick,
}: {
    mode: string;
    onClick: () => void;
}) => (
    <button
        className="flex justify-center items-center py-4 px-8 bg-white border-4 border-black text-black text-2xl font-mono tracking-widest hover:bg-black hover:text-white transition duration-300 w-2/3 max-w-sm"
        onClick={onClick}
    >
        {mode}
    </button>
);

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div
            className="flex flex-col justify-center items-center bg-rose-600 space-y-4"
            style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
            <GameButton mode="CLASSIC" onClick={() => navigate('/classic')} />
            <GameButton
                mode="BATTLE ROYALE"
                onClick={() => navigate('/battle')}
            />
        </div>
    );
};

export default HomePage;
