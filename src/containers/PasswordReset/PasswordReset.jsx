import React, { useEffect, useState } from "react";
import { WrapperContainerLeft } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import * as message from "../../components/Message/Message";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";

const PasswordReset = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { id, token } = useParams();

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const mutation = useMutationHook((data) =>
    UserService.resetPassword(id, token, data)
  );

  const { data, isLoading, isError, isSuccess } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "Success") {
      message.success("Send mail verify successfully");
      handleNavigateSignIn();
    } else if (isError && data?.status === "ERR") {
      message.error();
    }
  }, [isError, isSuccess]);

  const updatePassword = async () => {
    await mutation.mutate({
      password,
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
            Enter New Password
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
              placeholder="New password"
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
              onClick={updatePassword}
              size={40}
              styleButton={{
                background: "rgba(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Update"}
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
