import React, { useEffect, useState } from 'react';
import { auth, database } from '../utils/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setAPI_KEY } from '../Redux/actions';


interface Log {
    name: {
        entity_id: string;
        entity_name: string;
        entry: string;
        created_at: any;
    };
}

interface User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    address?: string;
    API_KEY?: string; // Add API_KEY property
}

interface UserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    address?: string;
    API_KEY?: string;
}

const Profile: React.FC = () => {
    const [API_KEY, setAPI_Key_Input] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const dispatch = useDispatch();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { uid, email } = user;
                setUser({ id: uid, email: email ?? undefined });
                getFireBaseData(user.email || '');
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userData) {
            setUser((prevUser) => ({
                ...prevUser!,
                firstName: userData?.firstName ?? '',
                lastName: userData?.lastName ?? '',
                age: userData?.age ?? 0,
                bio: userData?.bio ?? '',
                address: userData?.address ?? '',
            }));
            setAPI_Key_Input(userData?.API_KEY ?? ''); // Set API_KEY from userData
        }
    }, [userData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAPI_Key_Input(event.target.value);
    };

    const handleSaveAPI = () => {
        if (user) {
            const userRef = doc(collection(database, 'usersInfo'), user.email);

            const data = {
                email: user.email,
                API_KEY: API_KEY, // Update to use API_KEY from state
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                age: user.age ?? 0,
                bio: user.bio ?? '',
                address: user.address ?? '',
            };

            setDoc(userRef, data)
                .then(() => {
                    console.log('API_KEY saved successfully');
                    dispatch(setAPI_KEY(API_KEY));
                })
                .catch((error: Error) => {
                    console.error('Failed to save API_KEY:', error);
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
                setUserData(logData);
                console.log(logData);
            } else {
                console.log('No such document!');

            }
        } catch (error) {
            console.error('Error getting document:', error);
        }
    };

    const handleGetFireBaseData = () => {
        if (user) {
            getFireBaseData(user.email || '');
        }
    };

    return (
        <div>
            <h1>API Settings</h1>
            {user && <p>User: {user.email}</p>}
            <input
                type="text"
                value={API_KEY}
                onChange={handleInputChange}
                placeholder="Enter API Key"
            />

            <h1>Additional Information</h1>
            {user && (
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={user.firstName ?? ''}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={user.lastName ?? ''}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Age:
                        <input
                            type="number"
                            value={user.age ?? ''}
                            onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) })}
                        />
                    </label>
                    <br />
                    <label>
                        Bio:
                        <textarea
                            value={user.bio ?? ''}
                            onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input
                            type="text"
                            value={user.address ?? ''}
                            onChange={(e) => setUser({ ...user, address: e.target.value })}
                        />
                    </label>
                </div>
            )}
            <button onClick={handleSaveAPI}>Save</button>
            <br />
            <button onClick={handleGetFireBaseData}>Get Firebase Data</button>
        </div>
    );
};

export default Profile;
