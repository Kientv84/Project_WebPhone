import { useState } from "react";
import { UseSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { Home, Login, Public } from './containers/public/'
import {Routes, Route} from 'react-router-dom' 
import path from "./ultis/path";
import { DatePicker } from 'antd';

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
    </>
  );
}

export default App;
