import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo from "../../assets/images/SignIn.png";
import { Image } from "antd";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slice/userslide";
import styles from "./styles.module.css";
import googleIcon from "../../assets/images/image45.93ceca6.png";
import { useTranslation } from "react-i18next";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  const mutation = useMutationHook((data) => UserService.loginUser(data));

  const { data, isLoading, isSuccess } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch]
  ); // memoize với 'dispatch'
  const locations = location?.state;
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if (locations) {
        navigate(locations);
      } else {
        message.success(t("SIGN_IN.SIGN_IN_MESS_SUCCESS"));
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data?.access_token);
        }
      }
    }
  }, [isSuccess, data, handleGetDetailsUser, navigate, locations]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      message.error("Please fill in both email and password!");
      return;
    }

    // Gửi request và xử lý lỗi
    mutation.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          // Xử lý nếu thành công (đã có trong useEffect)
        },
        onError: (error) => {
          message.error("An error occurred. Please try again later."); // Lỗi không dự đoán được
        },
        onSettled: (data) => {
          // Xử lý lỗi trả về từ API
          if (data?.status === "ERR") {
            message.error(data?.message || "An error occurred!");
          }
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!email.trim() || !password.trim()) {
        message.error("Please fill in both email and password!"); // Hiển thị popup lỗi
        return;
      }
      handleSignIn();
    }
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleNavigateForgotPass = () => {
    navigate("/forgot-password");
  };

  const handleSignInAuth = (type) => {
    window.open(`http://localhost:3001/api/auth/${type}`, "_self");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "400px",
          borderRadius: "6px",
          border: "1px solid #42C8B7",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1
            style={{ fontSize: "30px", marginBottom: "5px", marginTop: "0px" }}
          >
            {t("SIGN_IN.TITLE")}
          </h1>
          <InputForm
            style={{ marginBottom: "10px", marginTop: "25px" }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail}
            onKeyDown={handleKeyDown}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "5px",
                right: "8px",
                fontSize: "15px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder={t("SIGN_IN.PASSWORD_PLACEHOODER")}
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Loading isLoading={isLoading}>
            <ButtonComponent
              // disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgba(255, 57, 69)",
                height: "45px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "15px 0 10px",
              }}
              textbutton={t("SIGN_IN.SIGN_IN_BUTTON")}
              styletextbutton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
            <p className={styles.text}>{t("SIGN_IN.OR")}</p>
            <div className={styles.container_btn}>
              <button
                className={styles.google_btn}
                onClick={() => handleSignInAuth("google")}
              >
                <img src={googleIcon} alt="google icon" />
                <span>Google</span>
              </button>
            </div>
          </Loading>
          <p
            style={{ marginBottom: "-10px", marginTop: "-8px" }}
            onClick={handleNavigateForgotPass}
          >
            <WrapperTextLight>{t("SIGN_IN.FORGOT_PASS")}</WrapperTextLight>
          </p>
          <p style={{ fontSize: " 15px" }}>
            {t("SIGN_IN.TEXT")}{" "}
            <WrapperTextLight onClick={handleNavigateSignUp}>
              {" "}
              {t("SIGN_IN.REGISTER")}
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="image-logo"
            height="400px"
            width="300px"
          />
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
