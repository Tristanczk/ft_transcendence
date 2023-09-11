import React from 'react';
import LocalClassicMayhem from './LocalClassicMayhem';
import { randomChoice } from '../../shared/functions';
import { maps } from '../../shared/mayhem_maps';

const LocalMayhem: React.FC = () => (
    <LocalClassicMayhem
        mayhemMap={randomChoice(maps)}
        numBalls={3}
        hasNet={false}
    />
);

export default LocalMayhem;
