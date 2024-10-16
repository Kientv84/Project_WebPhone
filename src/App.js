import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes/index";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { isJsonString } from "./utils";
import jwt_decode from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slice/userslide";
import Loading from "./components/LoadingComponent/Loading";
import DefautFooterComponent from "./components/DefautFooterComponent/DefautFooterComponent";
import Chatbot from "./components/ChatbotComponent/Chatbot";

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Memoize handleDecoded để tránh tái tạo lại hàm trong mỗi lần render
  const handleDecoded = useCallback(() => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData };
  }, []);

  // Memoize handleGetDetailsUser để tránh tái tạo lại hàm trong mỗi lần render
  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    setIsLoading(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded.id, storageData);
    }
    setIsLoading(false);
  }, [handleDecoded, handleGetDetailsUser]); // Thêm handleDecoded và handleGetDetailsUser vào mảng phụ thuộc

  // Add a request interceptor
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              const LayoutFooter = route.isShowFooter
                ? DefautFooterComponent
                : Fragment;
              const isShowChatbox = route.isShowChatbox !== false;
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Layout>
                      <div style={{ flex: 1 }}>
                        <Page />
                        {isShowChatbox && <Chatbot />}
                      </div>
                      <LayoutFooter />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
