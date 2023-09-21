import React from 'react';
import LocalClassicMayhem from './LocalClassicMayhem';
import { EMPTY_MAP } from '../../shared/mayhem_maps';

const LocalClassic: React.FC = () => (
    <LocalClassicMayhem mayhemMap={EMPTY_MAP} numBalls={1} hasNet={true} />
);

export default LocalClassic;
