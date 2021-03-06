import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './core/assets/styles/custom.scss';
import './app.scss';
import Routes from './Routes';

function App() {
  return (
    <>
      <ToastContainer position="top-center" theme="colored" />
      <Routes />    
    </>
  );
}

export default App;
