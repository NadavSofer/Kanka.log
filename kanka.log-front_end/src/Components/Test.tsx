import React, { useState, useEffect } from 'react';
import { auth, database } from '../utils/firebase';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface User {
    id: string;
    email?: string;
}

interface LogData {
    entity_id: string;
    entity_name: string;
    entry: string;
}

const Test: React.FC = () => {
    const [API_KEY, setAPI_KEY] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [logData, setLogData] = useState<LogData>({
        entity_id: '123',
        entity_name: 'Entity 1',
        entry: 'Log entry',
    });

    useEffect(() => {
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAPI_KEY(event.target.value);
    };

    const handleSaveAPI = () => {
        if (user) {
            const userRef = doc(collection(database, "usersInfo"), user.email);
            console.log(user);

            const data = {
                email: user.email,
                API_KEY: API_KEY,
                Logs: [],
            };

            setDoc(userRef, data)
                .then(() => {
                    console.log("API_KEY saved successfully");
                })
                .catch((error: Error) => {
                    console.error("Failed to save API_KEY:", error);
                });
        }
    };

    const addLogToCollection = () => {
        if (user) {

            
            const userRef = doc(
                collection(database as any, 'usersInfo'),
                user.email as string
            );
            const logsRef = collection(userRef, 'Logs');
            const logDocRef = doc(logsRef, logData.entity_id);

            const data = {
                entity_id: logData.entity_id,
                entity_name: logData.entity_name,
                entry: logData.entry,
                created_at: serverTimestamp(),
            };

            setDoc(logDocRef, data)
                .then(() => {
                    console.log('Log added successfully');
                })
                .catch((error) => {
                    console.error('Failed to add log:', error);
                });
        }
        else {
            alert('not connected to user')
        }
    };

    const handleLogChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLogData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div>
            <div>
                <h1>API Settings</h1>
                {user && (
                    <div className="flex">
                        <p>User: {user.email}</p>
                    </div>
                )}
                <input
                    type="text"
                    value={API_KEY}
                    onChange={handleInputChange}
                    placeholder="Enter API Key"
                />
                <button onClick={handleSaveAPI}>Save</button>
            </div>
            <br />
            <div>
                <h1>Add Log</h1>
                <div>
                    <label>
                        Entity ID:
                        <input
                            type="text"
                            name="entity_id"
                            value={logData.entity_id}
                            onChange={handleLogChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Entity Name:
                        <input
                            type="text"
                            name="entity_name"
                            value={logData.entity_name}
                            onChange={handleLogChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Entry:
                        <input
                            type="text"
                            name="entry"
                            value={logData.entry}
                            onChange={handleLogChange}
                        />
                    </label>
                </div>
                <button onClick={addLogToCollection}>Add Log</button>
            </div>
        </div>
    );
};

export default Test;
