import { ChangeEvent, MouseEventHandler, useState } from 'react';
import React from 'react';

export function MessageInput({ send }: { send: (input: string) => void }) {
    const [input, setInput] = useState('');

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    return (
        <div>
            <input
                onChange={onChange}
                value={input}
                placeholder="Type here..."
            />
            <button onClick={() => {send(input); setInput("")}}>Send</button>
        </div>
    );
}
