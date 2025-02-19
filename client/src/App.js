import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Contact from './pages/Contact';
import Pagenotfound from './pages/Pagenotfound';
import Policy from './pages/Policy';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
     <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path ='/contact' element ={<Contact/>}/>
      <Route path ='/policy' element ={<Policy/>}/>
      <Route path = '/login' element ={<Login/>}/>
      <Route path='/register' element ={<Register/>}/>
      <Route path ='*' element ={<Pagenotfound/>}/>
     </Routes>
    </>
  );
}

export default App;