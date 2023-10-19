import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/index';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import axios from 'axios';
import { useQuery } from 'react-query';
import { isJsonString } from './utils';
import jwt_decode from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch } from 'react-redux'
import { updateUser } from './redux/slice/userslice';

function App() {
      const dispatch = useDispatch();

      useEffect(() => {
        const { storageData, decoded } = handleDecoded()
          if(decoded?.id) {
            handleGetDetailsUser(decoded.id, storageData)
          }
      }, [])

      const handleDecoded = () => {
        let storageData = localStorage.getItem('access_token')
        let decoded = {}
        // console.log('storageData', storageData, isJsonString(JSON.stringify(storageData)));
        if ( storageData && isJsonString(storageData)) {
          storageData = JSON.parse(storageData);
          decoded = jwt_decode(storageData)
        }
        // console.log('decoded', decoded);
        return { decoded, storageData}
      }

      // Add a request interceptor
      UserService.axiosJWT.interceptors.request.use(async (config) => {
        // Do something before request is sent
        const currentTime = new Date()
        const { decoded } = handleDecoded()
        console.log('decoded', decoded)
        if (decoded?.exp < currentTime.getTime() / 1000) {  
          const data = await UserService.refreshToken()
          config.headers['token'] = `Bearer ${data?.access_token}`
        }
        return config;
      }, function (error) {
        // Do something with request error
        return Promise.reject(error);
      });

      const handleGetDetailsUser = async(id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token}))
        // console.log('res', res)
      }

      
      
      // useEffect(() => {
        //   fetchApi()
        // }, [])
        // const fetchApi = async() => {
        //   const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-all`)
        //   return res.data
        // }
        
        // const query = useQuery('todos', fetchApi)
        // console.log('query', query)

      return (
        <div>
            <Router>
              <Routes>
                {routes.map((route) => {
                  const Page = route.page
                  const Layout = route.isShowHeader ? DefaultComponent :Fragment
                  return (
                    <Route key={route.path} path={route.path} element={
                      <Layout>
                        <Page />
                      </Layout>
                  } />
                  )
                })}
              </Routes>
            </Router>
        </div>
      )
};

export default App
