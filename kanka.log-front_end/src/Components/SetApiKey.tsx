import { auth, database } from '../utils/firebase';
import { doc, collection, setDoc, getDoc } from 'firebase/firestore';
import React, { useState, FormEvent } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAPI_KEY } from '../Redux/actions';
import { RootState } from '../Redux/store';

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
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter new API key"
                />
                <button type="submit">Update API Key</button>
            </form>
        </div>
    );
};

export default SetApiKey;
