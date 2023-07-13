import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import SetApiKey from './Components/SetApiKey';
import Login from './Components/Login';
import Profile from './Components/Profile';
import ResetPassword from './Components/ResetPassword';
import Homepage from './Components/Homepage';
import Campaign from './Components/Campaign';
import Category from './Components/Category'
import Entity from './Components/Entity';
import Footer from './Components/Footer';
import { auth, database } from './utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { setAPI_KEY, setCampaigns } from './Redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Redux/store';

function App() {

  interface UserData {
    email?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    address?: string;
    API_KEY?: string;
}

  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const dispatch = useDispatch();
  const url: string = useSelector((state: RootState) => state.baseURL);
  const key: string = useSelector((state: RootState) => state.key);


  const getFireBaseData = async (email: string) => {
    try {
      const userDocRef = doc(database, 'usersInfo', `${email}`);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const logData = userDocSnap.data();
        setUserData(logData);
        dispatch(setAPI_KEY(logData?.API_KEY || '')); // Dispatch the action here
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  useEffect(() => {
    getFireBaseData(user?.email || '');
  }, [user]); // Run the effect whenever the `user` changes

  useEffect(() => {
    getData();
  }, [userData]); // Run the effect whenever `userData` changes

  const getData = () => {
    fetch(`${url}/campaigns`, {
        headers: {
            Authorization: 'Bearer ' + key,
            'Content-type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            dispatch(setCampaigns(data.data));
        });
};

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900">
        <h1>hello</h1>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/:campaignId" element={<Campaign />} />
          <Route path="/:campaignId/:category" element={<Category />} />
          <Route path="/:campaignId/:category/:entity_id" element={<Entity />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/SetKey' element={<SetApiKey />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
        </Routes>
        <br /><br /><br />
        <Footer />
      </div>
    </>
  );
}

export default App;
