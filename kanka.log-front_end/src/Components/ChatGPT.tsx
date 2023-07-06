import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const ChatGPT: React.FC = () => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY || '',
    });
    const openai = new OpenAIApi(configuration);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const prompt = `${input}`;

        try {
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 1000,
            });
            const outputText = response.data.choices[0]?.text || '';
            setOutput(outputText);

            console.log(response.data);
            console.log(outputText);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea value={input} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
            <pre>{output}</pre>
        </div>
    );
};

export default ChatGPT;
