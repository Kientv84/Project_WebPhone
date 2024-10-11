import React, { useEffect, useState, useCallback } from "react";
import { WrapperContainerLeft } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import * as message from "../../components/Message/Message";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { id, token } = useParams();

  const { t } = useTranslation();

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const mutation = useMutationHook((data) =>
    UserService.resetPassword(id, token, data)
  );

  const { data, isLoading, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "Success") {
      message.success(t("SIGN_IN.RESET_MESS_SUCCESS"));
      handleNavigateSignIn();
    } else if (isError && data?.status === "ERR") {
      message.error();
    }
  }, [isError, isSuccess]);

  const handleNavigateSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const status = data?.status;

  useEffect(() => {
    if (isSuccess && status === "Success") {
      message.success("Send mail verify successfully");
      handleNavigateSignIn();
    } else if (isError && status === "ERR") {
      message.error();
    }
  }, [isError, isSuccess, handleNavigateSignIn, status]);

  const updatePassword = async () => {
    await mutation.mutate({
      password,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "300px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1
            style={{ fontSize: "30px", marginBottom: "8px", marginTop: "0px" }}
          >
            {t("SIGN_IN.ENTER_NEW_PASS")}
          </h1>
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
              placeholder={t("SIGN_IN.NEW_PASS")}
              type={isShowPassword ? "text" : "password"}
              style={{ marginBottom: "10px" }}
              value={password}
              onChange={handleOnChangePassword}
            />
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              onClick={t("SIGN_IN.UPDATE_PASS")}
              size={40}
              styleButton={{
                background: "rgba(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={t("SIGN_IN.UPDATE_BTN")}
              styletextbutton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
        </WrapperContainerLeft>
      </div>
    </div>
  );
};

export default PasswordReset;
