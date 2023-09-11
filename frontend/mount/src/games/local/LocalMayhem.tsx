import React from 'react';
import LocalClassicMayhem from './LocalClassicMayhem';
import { randomMap } from '../../shared/mayhem_maps';

const LocalMayhem: React.FC = () => (
    <LocalClassicMayhem mayhemMap={randomMap()} numBalls={3} hasNet={false} />
);

export default LocalMayhem;
