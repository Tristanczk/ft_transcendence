export interface ChannelProps {
    idAdmin: number;
    idChannel: number;
    name: string;
}

interface ChannelsBoxProps {
    channels: ChannelProps[];
}

const ChannelsBox = ({ channels }: { channels: ChannelProps[] }) => {
    return (
        <div>
            {channels.map((channel, index) => (
                <div className="channels" key={index}>
                    <p>
                        {channel.idAdmin} {channel.idChannel} {channel.name}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ChannelsBox;
