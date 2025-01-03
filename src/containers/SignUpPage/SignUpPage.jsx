import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import imageLogo from "../../assets/images/SignIn.png";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { t } = useTranslation();

  const mutation = useMutationHook((data) => UserService.signupUser(data));

  const { data, isLoading, isError, isSuccess } = mutation;

  const handleNavigateSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const status = data?.status;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success(t("SIGN_IN.SIGN_UP_MESS_SUCCESS"));
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isError, isSuccess, handleNavigateSignIn, status]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      message.error(
        "Please fill in both email, password, and confirm password!"
      ); // Hiển thị popup lỗi
      return;
    }
    mutation.mutate(
      {
        email,
        password,
        confirmPassword,
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
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        message.error(
          "Please fill in both email, password, and confirm password!"
        ); // Hiển thị popup lỗi
        return;
      }
      handleSignUp();
    }
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
            style={{ fontSize: "30px", marginBottom: "8px", marginTop: "0px" }}
          >
            {t("SIGN_IN.REGISTER")}
          </h1>
          <InputForm
            style={{ marginBottom: "8px", marginTop: "10px" }}
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
              style={{ marginBottom: "10px" }}
              value={password}
              onChange={handleOnChangePassword}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "5px",
                right: "8px",
                fontSize: "15px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder={t("SIGN_IN.CONFIRM_PASS")}
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnChangeConfirmPassword}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Loading isLoading={isLoading}>
            <ButtonComponent
              // disabled={
              //   !email.length || !password.length || !confirmPassword.length
              // }
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgba(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={t("SIGN_IN.RES_BUTTON")}
              styletextbutton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
          <p style={{ fontSize: " 15px" }}>
            {t("SIGN_IN.RES_TEXT")}{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              {" "}
              {t("SIGN_IN.SIGN_IN_BUTTON")}
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

export default SignUpPage;
