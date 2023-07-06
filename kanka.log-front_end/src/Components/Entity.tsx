import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { TbReplaceFilled } from 'react-icons/tb';
import { RiGitRepositoryCommitsFill } from 'react-icons/ri';
import { RootState } from '../Redux/store';
import { setCurrentEntity } from '../Redux/actions';
import { auth, database } from '../utils/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

function Entity() {

    interface User {
        id: string;
        email?: string;
    }

    const key: string = useSelector((state: RootState) => state.key);
    const baseURL: string = useSelector((state: RootState) => state.baseURL);
    const entity: unknown = useSelector((state: RootState) => state.currentEntity);
    const { campaignId, category, entity_id } = useParams();
    const dispatch = useDispatch();
    const [user, setUser] = useState<User | null>(null);

    const [entityToUpload, setEntityToUpload] = useState({
        name: (entity as any).name || '',
        is_private: true,
        entry: (entity as any).entry || '',
    });

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
            getFireBaseData(user.email);
        }

        return () => unsubscribe();
    }, []);

    const getData = () => {
        fetch(fullURL, {
            headers: {
                'Authorization': 'Bearer ' + key,
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch(setCurrentEntity(data.data));
                setEntityToUpload({
                    name: data.data.name || '',
                    is_private: true,
                    entry: data.data.entry || '',
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    const uploadEntity = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entityToUpload),
        };

        try {
            fetch(fullURL, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log('updated successfully');
                console.log(data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const addLogToCollection = () => {
        if (user) {
            const userRef = doc(collection(database, 'usersInfo'), user.email);
            const logsRef = collection(userRef, 'Logs');
            const logDocRef = doc(logsRef, `${entityToUpload.name}: ${new Date()}`);

            const data = {
                entity_id: entity_id,
                entity_name: entityToUpload.name,
                entry: entityToUpload.entry,
                created_at: serverTimestamp()
            };

            setDoc(logDocRef, data)
                .then(() => {
                    console.log('Log document created successfully');
                    const entityCollectionRef = collection(logDocRef, 'Entities');
                    return addDoc(entityCollectionRef, data);
                })
                .then(() => {
                    console.log('Collection created and data added successfully');
                })
                .catch((error) => {
                    console.error('Failed to add log:', error);
                });
        } else {
            alert('Not connected to user');
        }
    };

    const getFireBaseData = async (email: string) => {
        try {
            const collectionName = 'usersInfo';
            const userDocRef = doc(database, collectionName, email);

            const userDocSnap = await getDoc(userDocRef);
            console.log('userDocSnap==>',userDocSnap);
            
            if (userDocSnap.exists()) {
                const logData = userDocSnap.data();
                // Do something with the log data
                console.log(logData);
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
        addLogToCollection()
    }

    const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEntityToUpload((prevEntity) => ({
            ...prevEntity,
            entry: e.target.value,
        }));
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
                                <img className="h-auto w-full mx-auto"
                                    src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                                    alt="" />
                            </div>
                            <h1 className="text-white font-bold text-xl leading-8 my-1 px-4 py-1 rounded bg-black bg-opacity-50"
                                style={{ background: '00000050' }}>{(entity as any).name}</h1>
                            <ul
                                className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-xl">
                                <li className="flex items-center py-3">
                                    <span>Status</span>
                                    <span className="ml-auto">
                                        <span
                                            className=" py-1 px-2 rounded text-sm">{!(entity as any).is_dead ? 'Alive' : 'Dead'}
                                        </span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="w-full md:w-9/12 mx-2 h-64">
                        <div className="bg-white p-3 shadow-xl rounded-sm">
                            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                                <span className="tracking-wide text-xl mb-2">Entry</span>
                            </div>
                            <div className="text-gray-700">
                                <div className="grid md:grid-cols-1 text-sm">
                                    <textarea
                                        id="entry"
                                        rows={4}
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={cleanHtml(entityToUpload.entry) || ''}
                                        placeholder="Write something about the entity"
                                        onChange={handleEntryChange}
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end w-full mt-3 items-center gap-3'>
                                <form onSubmit={uploadEntity}>
                                    <button type='submit' className='flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
                                        <TbReplaceFilled />
                                        <p>Upload</p>
                                    </button>
                                </form>
                                <form onSubmit={handleUploadSave}>
                                    <button type='submit' className='flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>
                                        <RiGitRepositoryCommitsFill />
                                        <p>Save and Upload</p>
                                    </button>
                                </form>
                            </div>
                        </div>


                        <div className="my-4"></div>


                        <div className="bg-white p-3 shadow-xl rounded-sm">

                            <div className="grid grid-cols-2">
                                <div>
                                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                        <span className="text-blue-500">
                                            <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="tracking-wide">Experience</span>
                                    </div>
                                    <ul className="list-inside space-y-2">
                                        <li>
                                            <div className="text-teal-600">Owner at Her Company Inc.</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                        <li>
                                            <div className="text-teal-600">Owner at Her Company Inc.</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                        <li>
                                            <div className="text-teal-600">Owner at Her Company Inc.</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                        <li>
                                            <div className="text-teal-600">Owner at Her Company Inc.</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                        <span className="text-blue-500">
                                            <svg className="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path fill="#fff"
                                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                            </svg>
                                        </span>
                                        <span className="tracking-wide">Education</span>
                                    </div>
                                    <ul className="list-inside space-y-2">
                                        <li>
                                            <div className="text-teal-600">Masters Degree in Oxford</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                        <li>
                                            <div className="text-teal-600">Bachelors blue in LPU</div>
                                            <div className="text-gray-500 text-xs">March 2020 - Now</div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Entity