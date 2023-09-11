import React from 'react';
import LocalClassicMayhem, { Ball } from './LocalClassicMayhem';
import { EMPTY_MAP } from './mayhem_maps';

const LocalClassic: React.FC = () => (
    <LocalClassicMayhem
        mayhemMap={EMPTY_MAP}
        balls={[new Ball(0.5)]}
        hasNet={true}
    />
);

export default LocalClassic;
