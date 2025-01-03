import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as UserService from "../../services/UserService";
import { updateUser } from "../../redux/slice/userslide";
import jwt_decode from "jwt-decode";
import * as authService from "../../services/authService";
import * as message from "../../components/Message/Message";
import "./LoginSuccessComponent.css";
import { useTranslation } from "react-i18next";

const LoginSuccessComponent = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchToken = async () => {
      try {
        let response = await authService.apiLoginSuccess(userId);
        if (response && response.status === "OK") {
          // Lưu token vào localStorage
          localStorage.setItem(
            "access_token",
            JSON.stringify(response?.access_token)
          );

          // Điều hướng sau khi đăng nhập thành công
          if (location?.state) {
            navigate(location.state);
          } else {
            message.success(t("LOGIN_TOAST.TOAST_SUCCESS"));
            navigate("/");
          }

          if (response.access_token) {
            const decoded = jwt_decode(response.access_token);
            if (decoded?.id) {
              handleGetDetailsUser(decoded.id, response.access_token);
            }
          }
        } else {
          message.error(t("LOGIN_TOAST.TOAST_SUCCESS"));
        }
      } catch (error) {
        message.error("An error occurred during login.");
      }
    };

    fetchToken();
  }, [userId, navigate, handleGetDetailsUser, location]);

  return <div className="conatainer_proccess">Processing login...</div>;
};

export default LoginSuccessComponent;
