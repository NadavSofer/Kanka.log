// import React, { useState, useEffect } from 'react';
// import { auth, database } from '../utils/firebase';

// interface User {
//     id: string;
//     email?: string;
// }

// const Test: React.FC = () => {
//     const [API_KEY, setAPI_KEY] = useState<string>('');
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//             if (user) {
//                 const { uid, email } = user;
//                 setUser({ id: uid, email: email ?? undefined });
//             } else {
//                 setUser(null);
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setAPI_KEY(event.target.value);
//     };

//     const handleSaveAPI = () => {
//         if (user) {
//             database
//                 .collection('users')
//                 .doc(user.id)
//                 .update({
//                     API_KEY: API_KEY
//                 })
//                 .then(() => {
//                     console.log('API_KEY saved successfully');
//                 })
//                 .catch((error: Error) => {
//                     console.error('Failed to save API_KEY:', error);
//                 });
//         }
//     };

//     return (
//         <div>
//             <h1>API Settings</h1>
//             {user && (
//                 <div className="flex">
//                     <p>User: {user.email}</p>
//                 </div>
//             )}
//             <input
//                 type="text"
//                 value={API_KEY}
//                 onChange={handleInputChange}
//                 placeholder="Enter API Key"
//             />
//             <button onClick={handleSaveAPI}>Save</button>
//         </div>
//     );
// };

// export default Test;

import React from 'react'

const Test = () => {
    return (
        <div>Test</div>
    )
}

export default Test
