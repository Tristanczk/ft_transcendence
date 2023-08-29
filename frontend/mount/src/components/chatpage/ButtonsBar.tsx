import { socket } from '../../context/WebsocketContext';
import Button from '../Button';
import { ChannelProps } from './Channels';

const ButtonsBar = ({
    createChannel,
}: {
    createChannel: (channel: ChannelProps) => void;
}) => {
    return (
        <div className="flex">
            <Button
                onClick={(event) => {
					event.preventDefault();
                    console.log('Create channel');
                    createChannel({
                        idAdmin: 2,
                        idChannel: 3,
                        name: 'test',
                    });
                }}
                text="Create channel"
                type="button"
            />
            <Button text="Delete channel" type="button" />
            <Button text="Invite to channel" type="button" />
        </div>
    );
};

export default ButtonsBar;
