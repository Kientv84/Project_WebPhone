import React, { useEffect, useState } from "react";
import { WrapperContainerLeft } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";

const ForgotPassPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const mutation = useMutationHook((data) => UserService.forgotPassword(data));

  const { data, isLoading, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "Success") {
      message.success("Send mail verify successfully");
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isError, isSuccess]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const sendLink = async () => {
    await mutation.mutate({
      email,
    });
  };

  const handleNavigateSignIn = () => {
    navigate("/sign-in");
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
            Enter Your Email
          </h1>
          <InputForm
            style={{ marginBottom: "8px", marginTop: "10px" }}
            placeholder="Enter your email address"
            value={email}
            onChange={handleOnChangeEmail}
          />
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
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
              textbutton={"Send"}
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
