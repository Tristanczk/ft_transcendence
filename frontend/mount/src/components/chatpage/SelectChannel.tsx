import React from 'react';

export function SelectChannel({
    setCurrentChannel,
    channels,
}: {
    setCurrentChannel: (newValue: number) => void;
    channels: number;
}) {
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        setCurrentChannel(parseInt(event.target.value));
    };

    return (
        <div>
            <select onChange={onChange} name="channel" id="channel">
                {Array.from({ length: channels }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                        Channel {index + 1}
                    </option>
                ))}
            </select>
        </div>
    );
}
