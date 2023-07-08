import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TbReplaceFilled } from 'react-icons/tb';
import { RiGitRepositoryCommitsFill } from 'react-icons/ri';
import { BsFillSendFill } from 'react-icons/bs';
import { BiSolidUpArrowSquare } from 'react-icons/bi';
import { RootState } from '../Redux/store';
import { setCurrentEntity } from '../Redux/actions';
import { auth, database } from '../utils/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Configuration, OpenAIApi } from 'openai';

const Entity: React.FC = () => {
    interface Log {
        [key: string]: {
            entity_id: string;
            entity_name: string;
            entry: string;
            created_at: Date;
        };
    }

    interface User {
        id: string;
        email?: string;
    }

    const key: string = useSelector((state: RootState) => state.key);
    const baseURL: string = useSelector((state: RootState) => state.baseURL);
    const entity: unknown = useSelector((state: RootState) => state.currentEntity);
    const { campaignId, category, entity_id } = useParams();
    const dispatch = useDispatch();
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

    const configuration = new Configuration({
        apiKey: OPENAI_API_KEY || '',
    });
    const openai = new OpenAIApi(configuration);
    const [GPTinput, setGPTInput] = useState('');
    const [GPToutput, setGPTOutput] = useState('');

    const [user, setUser] = useState<User | null>(null);

    const [entityToUpload, setEntityToUpload] = useState({
        name: (entity as any).name || '',
        is_private: true,
        entry: (entity as any).entry || '',
    });

    const [logs, setLogs] = useState<Log[]>([]);

    const fullURL = `${baseURL}/campaigns/${campaignId}/${(category as string).toLowerCase()}/${entity_id}`;

    useEffect(() => {
        getData();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { uid, email } = user;
                setUser({ id: uid, email: email ?? undefined });
            } else {
                setUser(null);
            }
        });

        if (user && user.email) {
            getFireBaseData();
        }

        return () => unsubscribe();
    }, []);

    const getData = () => {
        fetch(fullURL, {
            headers: {
                Authorization: 'Bearer ' + key,
                'Content-type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch(setCurrentEntity(data.data));
                setEntityToUpload({
                    name: data.data.name || '',
                    is_private: true,
                    entry: data.data.entry || '',
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const uploadEntity = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entityToUpload),
        };

        try {
            fetch(fullURL, requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    console.log('updated successfully');
                    console.log(data);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const addLogToCollection = () => {
        if (user) {
            const dataRef = doc(database, 'usersInfo', `${user.email}`, 'Logs', `${(entity as any).name}`, `${new Date()}`,'data');

            const data = {
                entity_id: entity_id,
                entity_name: entityToUpload.name,
                entry: entityToUpload.entry,
                created_at: serverTimestamp(),
            };
    
            setDoc(dataRef, data)
                .then(() => {
                    console.log('Log document created and data added successfully');
                })
                .catch((error) => {
                    console.error('Failed to add log:', error);
                });
        } else {
            alert('Not connected to user');
        }
    };
    

    const getFireBaseData = async () => {
        try {
            const dbRef = collection(database, 'usersInfo');
            const userRef = doc(dbRef, user?.email || '');

            const userRefSnap = await getDoc(userRef);
            console.log('userRefSnap==>', userRefSnap);

            if (userRefSnap.exists()) {
                const logData = userRefSnap.data();
                console.log(logData['Logs']);
                return logData;
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error getting document:', error);
        }
    };

    const handleUploadSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        uploadEntity(e);
        addLogToCollection();
    };

    const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEntityToUpload((prevEntity) => ({
            ...prevEntity,
            entry: e.target.value,
        }));
    };

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

    const handleGPTOutChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setGPTOutput(e.target.value);
    };

    const handleGPTUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedEntity = { ...entityToUpload, entry: GPToutput };
        setEntityToUpload(updatedEntity);
    };


    const divStyle: React.CSSProperties = {
        backgroundImage: `url(${(entity as any).image_full})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    function cleanHtml(html: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }

    return (
        <div>
            <div className="container mx-auto my-5 p-5">
                <div className="md:flex no-wrap md:-mx-2 ">
                    <div className="w-full md:w-3/12 md:mx-2">
                        <div className="bg-white p-3 border-t-4 border-blue-500 shadow-xl" style={divStyle}>
                            <div className="image overflow-hidden h-48">
                            </div>
                            <h1
                                className="text-white font-bold text-xl leading-8 my-1 px-4 py-1 rounded bg-black bg-opacity-50"
                                style={{ background: '00000050' }}
                            >
                                {(entity as any).name}
                            </h1>
                            <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-xl">
                                <li className="flex items-center py-3">
                                    <span>Status</span>
                                    <span className="ml-auto">
                                        <span className="py-1 px-2 rounded text-sm">
                                            {!(entity as any).is_dead ? 'Alive' : 'Dead'}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full md:w-9/12 mx-2 h-full">
                        <div className="bg-white p-3 shadow-xl rounded-sm">
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                <span className="tracking-wide text-xl mb-2">Entry</span>
                            </div>
                            <div className="text-gray-700">
                                <div className="grid md:grid-cols-1 text-sm">
                                    <textarea
                                        id="entry"
                                        rows={4}
                                        className="block p-2.5 w-full h-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={cleanHtml(entityToUpload.entry) || ''}
                                        placeholder="Write something about the entity"
                                        onChange={handleEntryChange}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end w-full mt-3 items-center gap-3">
                                <form onSubmit={uploadEntity}>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        <TbReplaceFilled />
                                        <p>Upload</p>
                                    </button>
                                </form>
                                <form onSubmit={handleUploadSave}>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    >
                                        <RiGitRepositoryCommitsFill />
                                        <p>Save and Upload</p>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="bg-white p-3 mt-4 shadow-xl rounded-sm">
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                <span className="tracking-wide text-xl mb-2">Chat GPT</span>
                            </div>
                            <div className="text-gray-700">
                                <div className="grid md:grid-cols-1 text-sm">
                                    <span className="tracking-wide text-xl mb-2">input</span>
                                    <form onSubmit={handleGPTSubmit}>
                                        <textarea
                                            id="entry"
                                            rows={4}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Write your prompt"
                                            value={GPTinput}
                                            onChange={handleGPTChange}
                                        />

                                        <button
                                            type="submit"
                                            className="flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm mt-2 px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        >
                                            <BsFillSendFill />
                                            <p>send</p>
                                        </button>
                                    </form>
                                </div>

                                <div className="grid md:grid-cols-1 text-sm">
                                    <span className="tracking-wide text-xl mb-2">output</span>
                                    <form onSubmit={e => handleGPTUpload(e)}>
                                        <textarea
                                            id="entry"
                                            rows={4}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="output here"
                                            value={GPToutput}
                                            onChange={handleGPTOutChange}
                                        />

                                        <button
                                            type="submit"
                                            className="flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                        >
                                            <BiSolidUpArrowSquare />
                                            <p>Move to Entry</p>
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>
                        <div className="bg-white p-3 mt-4 shadow-xl rounded-sm">
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                <span className="tracking-wide text-xl mb-2">History</span>
                            </div>
                            <div className="text-gray-700">
                                <div className="gridmd:grid-cols-1 text-sm">
                                    <h1>info here</h1>
                                </div>
                            </div>
                            <div className="flex justify-end w-full mt-3 items-center gap-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Entity;
