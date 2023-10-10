import { useState } from "react";
import { UseSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { Home, Login, Public } from './containers/public/'
import {Routes, Route} from 'react-router-dom' 
import path from "./ultis/path";
import { DatePicker } from 'antd';
import SignIn from "./containers/public/SignIn/SignIn";

import ProductDetail from "./containers/public/ProductDetail";
import SignUp from "./containers/public/Register/SignUp";

function App() {

 

  return (
    <>
    <div className="">
      <Routes>
        <Route path={path.PUBLIC} element ={<Public />} >
          <Route path={path.HOME} element = {<Home />} />
          <Route path={path.LOGIN} element = {<Login />} />
          <Route path={path.PRODUCTDETAIL} element = {<ProductDetail />} />
        </Route>
        <Route path="/sign-in" element = {<SignIn />} />
        <Route path="/register" element = {<SignUp />} />
      </Routes>

    </div>
    </>
  );
}

export default App;
