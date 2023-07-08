import { auth, database } from '../utils/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore';
import React, { useState, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAPI_KEY } from '../Redux/actions';
import { RootState } from '../Redux/store';
import instructions1 from '../assets/instructions1.png'
import instructions2 from '../assets/instructions2.png'
import instructions3 from '../assets/instructions3.png'

const SetApiKey: React.FC = () => {
    const [user, loading] = useAuthState(auth);
    const [apiKey, setApiKey] = useState<string>('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const key: string = useSelector((state: RootState) => state.key);


    const handleUpdateAPIKey = (newAPIKey: string) => {
        if (user) {
            const userRef = doc(collection(database, 'usersInfo'), `${user.email}`);

            const data = {
                API_KEY: newAPIKey,
            };

            setDoc(userRef, data)
                .then(() => {
                    console.log('API_KEY updated successfully');
                })
                .catch((error) => {
                    console.error('Failed to update API_KEY:', error);
                });
        }
    };

    const getFireBaseData = async (email: string) => {
        try {
            const collectionName = 'usersInfo';
            const userDocRef = doc(database, collectionName, email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const logData = userDocSnap.data();

            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error getting document:', error);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleUpdateAPIKey(apiKey);
        dispatch(setAPI_KEY(apiKey));
        navigate('/')
    };

    return (
        <div>
            <div className='h-38 mt-20'>
            <h1 className='text-3xl text-center text-red-500'>important! the key is required</h1>

            <form onSubmit={handleSubmit} className='h-28 flex justify-center items-center gap-4 border-red-500 border-2 w-fit mx-auto my-5'>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter new API key"
                    className='h-fit ml-4 border-blue-500 border-2 py-2 px-1'
                />
                <button type="submit" className='h-fit mr-4 flex items-center gap-1 text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'>Update API Key</button>
            </form>
            </div>

            <div>
                <h1 className="flex items-center justify-center my-10 text-2xl font-bold dark:text-white mt-5 ml-14">How to get an API key?</h1>

                <div className="grid md:grid-cols-2 md:gap-6 justify-center items-center w-4/5 mx-auto my-10">
                    <p className='text-xl mb-5'>1. Open the sidebar to the right and at the bottom enter Setting.</p>
                    <img src={instructions1} alt="" className='h-80 border-blue-500 border-2' />
                </div>

                <div className="grid md:grid-cols-2 md:gap-6 justify-center items-center w-4/5 mx-auto my-10">
                    <p className='text-xl mb-5'>3. Look at the sidebar to the left and at the bottom enter API.</p>
                    <img src={instructions2} alt="" className='h-80 border-blue-500 border-2' />
                </div>

                <div className="grid md:grid-cols-2 md:gap-6 justify-center items-center w-4/5 h-fit mx-auto my-10">
                    <p className='text-xl mb-5'>3. Click the "create new token" button and copy the key to the input at the top of this page.</p>
                    <img src={instructions3} alt="" className='h-80 border-blue-500 border-2' />
                </div>
            </div>
        </div>
    );
};

export default SetApiKey;
