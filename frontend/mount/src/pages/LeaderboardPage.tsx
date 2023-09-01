import React, { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import ImageFriend from '../components/dashboard/friends/ImgFriend';
import { Link } from 'react-router-dom';

interface ResponseLeaderboard {
    avatarPath: string;
    createdAt: Date;
    elo: number;
    id: number;
    isConnected: boolean;
    nickname: string;
	nbGames: number;
}

interface Props {
	user: ResponseLeaderboard,
	rank: number,
}

const DashboardPage: React.FC = () => {
    const [leaderboard, setLeaderbord] = useState<ResponseLeaderboard[] | null>(
        null,
    );
    const { user } = useUserContext();
	let rank: number = 1;

    useEffect(() => {
        getLeaderboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getLeaderboard() {
        try {
            const response = await axios.get(
                `http://localhost:3333/stats/leaderboard/`,
                {
                    withCredentials: true,
                },
            );
            setLeaderbord(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    return leaderboard ? (
        <>
            <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
                <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
                    <article className="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
						<h1 className="text-5xl font-extrabold dark:text-white">Leaderboard</h1>
                        {leaderboard.map((elem) => 
							<ShowUserLeaderboard user={elem} rank={rank++} key={elem.id} />
						)}
                    </article>
                </div>
            </main>
        </>
    ) : (
        <div>No member yet</div>
    );
};

function ShowUserLeaderboard({user, rank}: Props) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center">
            <span className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mr-4">
                #{rank}
            </span>
            <div className="flex-shrink-0">
                <ImageFriend userId={user.id} textImg={user.nickname} size={12} />
            </div>
            <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
				<Link to={'/dashboard/' + user.id}>
					{user.nickname}
				</Link>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Score : <span className="font-semibold">{user.elo}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Games played : <span className="font-semibold">{user.nbGames}</span>
                </p>
            </div>
        </div>
    );
}

export default DashboardPage;
