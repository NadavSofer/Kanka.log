import React, { useEffect } from 'react';
import './App.css';
import {Routes, Route } from 'react-router-dom';
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
import About from './Components/About';
import Test from './Components/Test';
import ChatGPT from './Components/ChatGPT';





function App() {

  
  return (
    <>
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/:campaignId" element={<Campaign/>}/>
        <Route path="/:campaignId/:category" element={<Category/>}/>
        <Route path="/:campaignId/:category/:entity_id" element={<Entity/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/SetKey' element={<SetApiKey/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/ResetPassword' element={<ResetPassword/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Test' element={<Test/>}/>
        <Route path='/gpt' element={<ChatGPT/>}/>
      </Routes>
      <br/><br/><br/>
      <Footer/>
    </div>
    </>
  );
}

export default App;
