import React from 'react';
import LocalClassicMayhem from './LocalClassicMayhem';
import { maps } from './mayhem_maps';
import { randomChoice } from '../../shared/functions';

const LocalMayhem: React.FC = () => (
    <LocalClassicMayhem
        mayhemMap={randomChoice(maps)}
        numBalls={3}
        hasNet={false}
    />
);

export default LocalMayhem;
