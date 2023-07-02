import React from 'react';
import './App.css';
import {Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Homepage from './Components/Homepage';
import Campaign from './Components/Campaign';
import Category from './Components/Category'
import Entity from './Components/Entity';
import Footer from './Components/Footer';


function App() {
  return (
    <>
    <div className="bg-gray-50 dark:bg-gray-900">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/:campaignId" element={<Campaign />}/>
        <Route path="/:campaignId/:category" element={<Category />}/>
        <Route path="/:campaignId/:category/:entity_id" element={<Entity />}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Signup' element={<Signup/>}/>
      </Routes>
      <br/><br/><br/>
      <Footer/>
    </div>

    </>
  );
}

export default App;
