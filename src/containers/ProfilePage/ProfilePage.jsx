import React, { useEffect, useState } from "react";
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

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoadings, setIsLoadings] = useState(false);
  const { t } = useTranslation();

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests, access_token);
  });
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError } = mutation;
  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);
  useEffect(() => {
    if (isSuccess) {
      message.success(t('PROFILE.UPDATE_SUCCESS'));
      handleGetDetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };
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

    // Nếu file chưa có URL hoặc preview, tạo preview từ file gốc
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setAvatar(file.preview); // Cập nhật ảnh đại diện bằng preview

    setIsLoadings(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error(t('PROFILE.WARNING'), t('PROFILE.REQUIRE_UPLOAD_IMG'));
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
        setIsLoadings(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setAvatar(url); // Cập nhật URL ảnh đã tải lên
          setIsLoadings(false); // Hoàn thành upload và kết thúc loading
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
    <div style={{ width: "1270px", margin: "75px auto 0px", height: "500px" }}>
      <WrapperHeader>{t('PROFILE.TITLE')}</WrapperHeader>
      <Loading isLoading={isLoading}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name"> {t('PROFILE.NAME')}</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="name"
              value={name}
              onChange={handleOnChangeName}
              placeholder={t('PROFILE.NAME_PLACEHOODER')}
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
            <WrapperLabel htmlFor="phone">{t('PROFILE.PHONE')}</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="phone"
              value={phone}
              onChange={handleOnChangePhone}
              placeholder={t('PROFILE.PHONE_PLACEHOODER')}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">{t('PROFILE.AVATAR')}</WrapperLabel>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>{t('PROFILE.SELECT_FILE')}</Button>
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
            <WrapperLabel htmlFor="address">{t('PROFILE.ADDRESS')}</WrapperLabel>
            <InputForm
              style={{ width: "300px" }}
              id="address"
              value={address}
              onChange={handleOnChangeAddress}
              placeholder={t('PROFILE.ADDRESS_PLACEHOODER')}
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
            textbutton={t('PROFILE.BTN_UPDATE')}
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
