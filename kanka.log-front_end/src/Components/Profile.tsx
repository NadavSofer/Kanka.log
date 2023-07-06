import React, { useEffect, useState } from 'react';
import { auth, database } from '../utils/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    address?: string;
}

interface UserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    address?: string;
}

const Profile: React.FC = () => {
    const [API_KEY, setAPI_KEY] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        if (user) {
            getFireBaseData(user.email || '');
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const { uid, email } = user;
                setUser({ id: uid, email: email ?? undefined });
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
        }
    }, [userData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAPI_KEY(event.target.value);
    };

    const handleSaveAPI = () => {
        if (user) {
            const userRef = doc(collection(database, 'usersInfo'), user.email);

            const data = {
                email: user.email,
                API_KEY: API_KEY,
                firstName: user.firstName ?? '',
                lastName: user.lastName ?? '',
                age: user.age ?? 0,
                bio: user.bio ?? '',
                address: user.address ?? '',
                Logs: [],
            };

            setDoc(userRef, data)
                .then(() => {
                    console.log('API_KEY saved successfully');
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
                console.log(userData);

                return logData;
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
                        address:
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
