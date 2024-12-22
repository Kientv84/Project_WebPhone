import React, { useCallback, useEffect, useState } from "react";
import { WrapperContainerLeft } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useTranslation } from "react-i18next";

const ForgotPassPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  const mutation = useMutationHook((data) => UserService.forgotPassword(data));

  const { data, isLoading, isError, isSuccess } = mutation;

  const handleNavigateSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const status = data?.status;

  useEffect(() => {
    if (isSuccess && status === "Success") {
      message.success("Send mail verify successfully");
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isError, isSuccess, handleNavigateSignIn, status]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const sendLink = async () => {
    await mutation.mutate(
      {
        email,
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
      if (!email.trim()) {
        message.error("Please fill in email!"); // Hiển thị popup lỗi
        return;
      }
      sendLink();
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
          width: "400px",
          height: "300px",
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
            {t("SIGN_IN.TITLE_FORGOT_PASS")}
          </h1>
          <InputForm
            style={{ marginBottom: "8px", marginTop: "10px" }}
            placeholder={t("SIGN_IN.FORGOT_PLACEHOODER")}
            value={email}
            onChange={handleOnChangeEmail}
            onKeyDown={handleKeyDown}
          />
          {/* {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )} */}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              onClick={sendLink}
              size={40}
              styleButton={{
                background: "rgba(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={t("SIGN_IN.BUTTON_FORGOT")}
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

export default ForgotPassPage;
