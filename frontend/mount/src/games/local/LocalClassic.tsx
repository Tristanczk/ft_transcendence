import React from 'react';
import LocalClassicMayhem, { Ball } from './LocalClassicMayhem';
import { EMPTY_MAP } from './mayhem_maps';

const LocalMayhem: React.FC = () => (
    <LocalClassicMayhem
        mayhemMap={EMPTY_MAP}
        balls={[new Ball(0.5)]}
        hasNet={true}
    />
);

export default LocalMayhem;
