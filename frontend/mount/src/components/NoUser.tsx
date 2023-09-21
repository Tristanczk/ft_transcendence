import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NoUser: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/404');
    });
    return null;
};

export default NoUser;
