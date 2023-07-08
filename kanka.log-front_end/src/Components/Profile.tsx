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

    const handleSaveInfo = (e: React.FormEvent) => {

        e.preventDefault()

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

    return (
        <div>
            {user && (
                <form className='w-3/5 mx-auto mt-20' style={{height:'70vh'}} onSubmit={handleSaveInfo}>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_API_key" id="floating_API_key" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            value={API_KEY}
                            onChange={handleInputChange}
                            placeholder="Enter API Key" />
                        <label htmlFor="floating_API_key" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Kanka API Key</label>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" name="floating_bio" id="floating_bio" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={user.bio ?? ''}
                            onChange={(e) => setUser({ ...user, bio: e.target.value })} />
                        <label htmlFor="floating_bio" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Bio</label>
                    </div>

                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" name="floating_first_name" id="floating_first_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                value={user.firstName ?? ''}
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })} />

                            <label htmlFor="floating_first_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" name="floating_last_name" id="floating_last_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                value={user.lastName ?? ''}
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })} />

                            <label htmlFor="floating_last_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" name="floating_age" id="floating_age" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                value={user.age ?? ''}
                                onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) })} />

                            <label htmlFor="floating_age" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Age</label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                            <input type="text" name="floating_address" id="floating_address" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                value={user.address ?? ''}
                                onChange={(e) => setUser({ ...user, address: e.target.value })} />

                            <label htmlFor="floating_address" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
