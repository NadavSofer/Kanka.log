import React from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Homepage from './Components/Homepage';
import {Routes, Route } from 'react-router-dom';
import Campaign from './Components/Campaign';

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/:id" element={<Campaign />}/>
      </Routes>
      <br/><br/><br/>
      <Footer/>


    </>
  );
}

export default App;
