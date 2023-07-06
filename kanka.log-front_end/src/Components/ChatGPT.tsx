import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const ChatGPT: React.FC = () => {
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;
    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY || '',
    });
    const openai = new OpenAIApi(configuration);
    const [GPTinput, setGPTInput] = useState('');
    const [GPToutput, setGPTOutput] = useState('');

    const handleGPTChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setGPTInput(e.target.value);
    };

    const handleGPTSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const prompt = `${GPTinput}`;

        try {
            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: prompt,
                max_tokens: 1000,
            });
            const outputText = response.data.choices[0]?.text || '';
            setGPTOutput(outputText);

            console.log(response.data);
            console.log(outputText);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleGPTSubmit}>
                <textarea value={GPTinput} onChange={handleGPTChange} />
                <button type="submit">Send</button>
            </form>
            <pre>{GPToutput}</pre>
        </div>
    );
};

export default ChatGPT;
