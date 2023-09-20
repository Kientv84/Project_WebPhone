import { useState } from "react";
import { UseSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Home, Login, Public } from './containers/public/'
import {Routes, Route} from 'react-router-dom' 
import path from "./ultis/path";

function App() {

 

  return (
    <>
    <div className="">
      <Routes>
        <Route path={path.PUBLIC} element ={<Public />} >
          <Route path={path.HOME} element = {<Home />} />
          <Route path={path.LOGIN} element = {<Login />} />
        </Route>
      </Routes>

    </div>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
  {/* Same as */}
  <ToastContainer />
    </>
  );
}

export default App;
