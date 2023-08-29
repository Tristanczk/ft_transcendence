import { ResponsiveLine, Serie } from '@nivo/line';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

function HistoryElo() {
    const [data, setGraph] = useState<Serie[] | null>(null);
    const { user } = useUserContext();

    useEffect(() => {
        async function getStats() {
            try {
                const response = await axios.get(
                    `http://localhost:3333/stats/graph/1`,
                    {
                        withCredentials: true,
                    },
                );
                setGraph(response.data);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }
        if (user) getStats();
    }, []);

    return (
        data && (
            <div className="parent-container">
                <div className="graph-container" style={{ height: '400px' }}>
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
                            legend: 'Last 90 days',
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
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        enableCrosshair={false}
                        legends={[
                            {
                                anchor: 'bottom-right',
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
        )
    );
}

export default HistoryElo;

//  {/* <ResponsiveBump
//                     data={data}
//                     xPadding={0.65}
//                     xOuterPadding={0.2}
//                     yOuterPadding={0.65}
//                     colors={{ scheme: 'spectral' }}
//                     lineWidth={3}
//                     activeLineWidth={6}
//                     inactiveLineWidth={3}
//                     inactiveOpacity={0.15}
//                     startLabelTextColor={{ from: 'color', modifiers: [] }}
//                     activePointSize={9}
//                     inactivePointSize={0}
//                     pointColor={{ theme: 'background' }}
//                     pointBorderWidth={3}
//                     activePointBorderWidth={3}
//                     pointBorderColor={{ from: 'serie.color' }}
//                     axisTop={null}
//                     axisBottom={{
//                         tickSize: 5,
//                         tickPadding: 5,
//                         tickRotation: 0,
//                         legend: '',
//                         legendPosition: 'middle',
//                         legendOffset: 32,
//                     }}
//                     axisLeft={null}
//                     margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
//                     axisRight={null}
//                 /> */}
