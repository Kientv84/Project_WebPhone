import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slice/userslide";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../ultis/firebase";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoadings, setIsLoadings] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    },
    [dispatch] // Thêm dispatch vào mảng phụ thuộc
  );

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });

  const { isLoading, isSuccess, isError } = mutation;
  const userId = user?.id;
  const userToken = user?.access_token;

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success(t("PROFILE.UPDATE_SUCCESS"));
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError, handleGetDetailsUser, userId, userToken]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangeName = (value) => {
    setName(value);
  };

  const handleOnChangePhone = (value) => {
    setPhone(value);
  };

  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setAvatar(file.preview);

    if (!file.url && !file.preview) {
      message.error(t("PROFILE.WARNING"), t("PROFILE.REQUIRE_UPLOAD_IMG"));
      setIsLoadings(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setAvatar(url);
        });
      }
    );
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "1270px", margin: "85px auto 0px", height: "500px" }}>
      <div
        style={{
          fontWeight: "normal",
          fontSize: "15px",
        }}
      >
        {" "}
        <span
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            color: "#707070",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          {t("PRODUCT_DETAILS.BACK_HOMEPAGE")}
        </span>{" "}
        <svg
          style={{
            margin: "0 10px 0 6px",
            width: "14px",
            color: "#707070",
            height: "14px",
            verticalAlign: "middle",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
          ></path>
        </svg>
        <span
          style={{
            fontSize: "14px", // Kích thước chữ
            fontWeight: "bold", // Kiểu chữ đậm
            color: "#707070", // Màu chữ (ví dụ: đỏ cam)
          }}
        >
          {t("PROFILE.TITLE")}
        </span>
      </div>
      <Loading isLoading={isLoading}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name"> {t("PROFILE.NAME")}</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="name"
              value={name}
              onChange={handleOnChangeName}
              placeholder={t("PROFILE.NAME_PLACEHOODER")}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="email"
              value={email}
              onChange={handleOnChangeEmail}
              readOnly
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">{t("PROFILE.PHONE")}</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="phone"
              value={phone}
              onChange={handleOnChangePhone}
              placeholder={t("PROFILE.PHONE_PLACEHOODER")}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">{t("PROFILE.AVATAR")}</WrapperLabel>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>
                {t("PROFILE.SELECT_FILE")}
              </Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">
              {t("PROFILE.ADDRESS")}
            </WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="address"
              value={address}
              onChange={handleOnChangeAddress}
              placeholder={t("PROFILE.ADDRESS_PLACEHOODER")}
            />
          </WrapperInput>

          <ButtonComponent
            onClick={handleUpdate}
            size={40}
            styleButton={{
              height: "30px",
              width: "fit-content",
              borderRadius: "4px",
              padding: "2px 6px 6px",
              marginLeft: "auto",
            }}
            textbutton={t("PROFILE.BTN_UPDATE")}
            styletextbutton={{
              color: "#42C8B7",
              fontSize: "15px",
              fontWeight: "700",
            }}
          ></ButtonComponent>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
