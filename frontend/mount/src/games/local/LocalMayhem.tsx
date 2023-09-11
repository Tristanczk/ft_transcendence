import React from 'react';
import LocalClassicMayhem, { Ball } from './LocalClassicMayhem';
import { maps } from './mayhem_maps';
import { randomChoice } from '../../shared/functions';

const LocalMayhem: React.FC = () => (
    <LocalClassicMayhem
        mayhemMap={randomChoice(maps)}
        balls={[new Ball(0.25), new Ball(0.5), new Ball(0.75)]}
        hasNet={false}
    />
);

export default LocalMayhem;
