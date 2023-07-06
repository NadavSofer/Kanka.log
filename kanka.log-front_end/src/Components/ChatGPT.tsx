import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const ChatGPT = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
                prompt: input,
                max_tokens: 100,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                },
            });

            setOutput(response.data.choices[0].text);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
            <div>{output}</div>
        </div>
    );
};

export default ChatGPT;
