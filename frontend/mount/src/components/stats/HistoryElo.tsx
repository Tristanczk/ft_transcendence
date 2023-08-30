import { ResponsiveLine, Serie } from '@nivo/line';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { User } from '../../types';

interface PresentationUserProps {
    user: User;
}

function HistoryElo({ user }: PresentationUserProps) {
    const [data, setGraph] = useState<Serie[] | null>(null);
	const [nbGame, setnbGames] = useState<number>(0)

    useEffect(() => {
        async function getStats() {
            try {
                const response = await axios.get(
                    `http://localhost:3333/stats/graph/${user?.id}`,
                    {
                        withCredentials: true,
                    },
                );
                setGraph(response.data);
				if (response.data) setnbGames(response.data[0].data.length)
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }
        if (user) getStats();
    }, []);

    return data && data.length > 0 ? (
        <div className="w-full  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="parent-container">
                <div className="graph-container" style={{ height: '300px' }}>
                    <ResponsiveLine
                        data={data}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false,
                        }}
                        yFormat=" >-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: `Last ${nbGame} games`,
                            legendOffset: 36,
                            legendPosition: 'middle',
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Elo',
                            legendOffset: -40,
                            legendPosition: 'middle',
                        }}
                        enableGridX={false}
                        lineWidth={5}
                        curve="monotoneX"
                        enablePoints={false}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        enableCrosshair={false}
                        legends={[
                            {
                                anchor: 'right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground:
                                                'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
}

export default HistoryElo;
