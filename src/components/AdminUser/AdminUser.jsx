import React, { useCallback, useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";
import * as message from "../../components/Message/Message";
import { useSelector } from "react-redux";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useQuery } from "react-query";
import { storage } from "../../ultis/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useTranslation } from "react-i18next";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const { t } = useTranslation();

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: "",
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(
      id,
      { ...rests },
      token // này là data nên phải là object
    );
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  });

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
      });
    }
    setIsLoadingUpdate(false);
  };
  // khi bấm edit sản phẩm nó giúp cho việc hiện ra lại các thông tin cần edit
  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUsers,
  });
  const { isLoading: isLoadingUsers, data: users } = queryUser;

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "28px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            {t("ADMIN.SEARCH")}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            {t("ADMIN.RESET")}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            {t("ADMIN.CLOSE")}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: t("ADMIN.USER_NAME"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"), //search name
    },
    {
      title: t("ADMIN.USER_EMAIL"),
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: t("ADMIN.USER_ADDRESS"),
      dataIndex: "address",
      sorter: (a, b) => {
        const addressA = a.address || ""; // Tránh null/undefined
        const addressB = b.address || ""; // Tránh null/undefined
        return addressA.localeCompare(addressB);
      },
      ...getColumnSearchProps("address"), // search address
      onFilter: (value, record) => {
        const address = record.address || ""; // Đảm bảo address không null hoặc undefined
        return address.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: t("ADMIN.ADMIN"),
      dataIndex: "isAdmin",
      filters: [
        { text: "True", value: true },
        { text: "False", value: false },
      ],
    },
    {
      title: t("ADMIN.USER_PHONE"),
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"), //search phone
      onFilter: (value, record) => {
        const phone = record.phone ? record.phone.toString() : ""; // Chuyển về string nếu cần
        return phone.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: t("ADMIN.ACTION"),
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? t("ADMIN.TRUE") : t("ADMIN.FALSE"),
      };
    });

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success(t("ADMIN.DELETE_USER_SUCCESS"));
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error(t("ADMIN.DELETE_USER_FAIL"));
    }
  }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success(t("ADMIN.DELETE_MANY_SUCCESS"));
    } else if (isErrorDeletedMany) {
      message.error(t("ADMIN.DELETE_MANY_FAIL"));
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany, dataDeletedMany]);

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success(t("ADMIN.UPDATE_USER_SUCCESS"));
      handleCancelDrawer();
    } else if (isErrorUpdated) {
      message.error(t("ADMIN.UPDATE_USER_FAIL"));
    }
  }, [isSuccessUpdated, isErrorUpdated, dataUpdated, handleCancelDrawer]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  // const confirmDelete = (onOk) => {
  //   Modal.confirm({
  //     title: 'Confirm Deletion',
  //     content: 'Are you sure you want to DELETE?',
  //     okText: 'DELETE',
  //     okType: 'Danger',
  //     cancelText: 'Cancel',
  //     onOk,
  //   });
  // };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error(t("ADMIN.WARNING"), t("ADMIN.REQUIRE_UPLOAD_IMG"));
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateUserDetails((stateUserDetails) => ({
            ...stateUserDetails,
            avatar: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>{t("ADMIN.MANAGE_USER")}</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          isLoading={isLoadingUsers}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <DrawerComponent
        title={t("ADMIN.USER_DETAIL")}
        isOpen={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateUser}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.USER_NAME")}
              name="name"
              rules={[
                { required: true, message: t("ADMIN.DETAIL_NAME_PLACEHOODER") },
              ]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
                readOnly
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.USER_EMAIL")}
              name="email"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.DETAIL_EMAIL_PLACEHOODER"),
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnchangeDetails}
                name="email"
                readOnly
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.USER_PHONE")}
              name="phone"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.DETAIL_PHONE_PLACEHOODER"),
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
                readOnly
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.USER_ADDRESS")}
              name="address"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.DETAIL_ADDRESS_PLACEHOODER"),
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.AVATAR")}
              name="avatar"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.DETAIL_AVARTA_PLACEHOODER"),
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnChangeAvatarDetails}
                maxCount={1}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button>{t("ADMIN.DETAIL_SELECT_PLACEHOODER")}</Button>
                  {stateUserDetails?.avatar && (
                    <img
                      src={stateUserDetails?.avatar}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "30px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {t("ADMIN.DETAIL_USER_APPLY")}
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        forceRender
        title={t("ADMIN.DELETE_USER")}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>{t("ADMIN.MESS_DELETE_USER")}</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
