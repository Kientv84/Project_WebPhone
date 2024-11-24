import { Button, Form, Input, Select, Space, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { convertPrice } from "../../utils";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "react-query";
import {
  DeleteOutlined,
  EditOutlined,
  MoneyCollectTwoTone,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import PieChartComponent from "./PieChart";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import { useTranslation } from "react-i18next";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);

  const { t } = useTranslation();

  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [orderState, setOrderState] = useState({
    isDelivered: null,
    isPaid: null,
    productNames: "",
  });
  const [isModalOpenDeleteAll, setIsModalOpenDeleteAll] = useState(false);
  const [isDeleteManySuccessNotified, setIsDeleteManySuccessNotified] =
    useState(false);
  const [form] = Form.useForm();

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.updateDeliveryState(
      id,
      token,
      { ...rests } // này là data nên phải là object
    );
    return res;
  });

  const mutationUpdatePayment = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.updatePaymentState(
      id,
      token,
      { ...rests } // này là data nên phải là object
    );
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = OrderService.deleteOrder(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = OrderService.deleteManyOrder(ids, token);
    return res;
  });

  const { isLoading: isLoadingUpdated } = mutationUpdate;
  const { isLoading: isLoadingUpdatedPayment } = mutationUpdatePayment;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: getAllOrder },
    {
      refetchOnMount: true, // Dữ liệu sẽ được fetch lại khi component được mount
      refetchOnWindowFocus: false, // Không fetch lại khi chuyển giữa các tab
    }
  );
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const renderAction = () => {
    return (
      <div style={{ display: "flex", gap: "6px" }}>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsOpenDrawer(true)}
        />
      </div>
    );
  };

  const handleDeleteOrder = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const handleDeleteManyOrders = (ids) => {
    setRowSelected(ids); // Lưu lại danh sách các ID muốn xóa
    setIsModalOpenDeleteAll(true); // Mở hộp thoại xác nhận
    setIsDeleteManySuccessNotified(false);
  };

  // show ra tình trạng đơn hàng
  const accessToken = user?.access_token;
  const fetchGetDetailsOrder = useCallback(
    async (rowSelected) => {
      const res = await OrderService.getDetailsOrder(rowSelected, accessToken);

      if (res?.status === "OK") {
        const productNames = res.data.orderItems
          .map((item) => `- ${item.name}`)
          .join("\n");
        setOrderState({
          isDelivered: res.data.isDelivered,
          isPaid: res.data.isPaid,
          productNames: productNames,
        });
      } else {
        message.error("Không thể lấy chi tiết đơn hàng");
      }

      setIsLoadingUpdate(false);
    },
    [accessToken]
  );

  useEffect(() => {
    form.setFieldsValue(orderState);
  }, [form, orderState]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer, fetchGetDetailsOrder]);

  const handleOnChange = (field, value) => {
    setOrderState({
      ...orderState,
      [field]: value,
    });
  };

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setOrderState({
      productNames: "",
    });
    form.resetFields();
  }, [form]);

  const handleConfirmDeleteAll = () => {
    mutationDeletedMany.mutate(
      { ids: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
          setIsModalOpenDeleteAll(false); // Đóng modal sau khi xóa
        },
      }
    );
  };

  //Xoá nhiều
  const statusDataDeletedMany = dataDeletedMany?.status;
  useEffect(() => {
    if (
      isSuccessDeletedMany &&
      statusDataDeletedMany === "OK" &&
      !isDeleteManySuccessNotified
    ) {
      message.success(t("ADMIN.DELETE_MANY_SUCCESS_ORDER"));
      setIsDeleteManySuccessNotified(true); // Đánh dấu đã hiển thị thông báo thành công
      queryOrder.refetch();
    } else if (isErrorDeletedMany) {
      message.error(t("ADMIN.DELETE_MANY_FAIL_ORDER"));
      setIsDeleteManySuccessNotified(false); // Đặt lại cờ nếu xảy ra lỗi
    }
  }, [
    isSuccessDeletedMany,
    statusDataDeletedMany,
    isErrorDeletedMany,
    isDeleteManySuccessNotified,
  ]);

  //Xoá 1
  const statusDataDeleted = dataDeleted?.status;
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success(t("ADMIN.DELETE_TOAST"));
      setIsModalOpenDelete(false);
    } else if (isErrorDeleted) {
      message.error(t("ADMIN.DELETE_TOAST_FAIL"));
    }
  }, [isSuccessDeleted, statusDataDeleted, isErrorDeleted]);

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
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          // ref={searchInput}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
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
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: t("ADMIN.ORDER_NUMBER"),
      dataIndex: "orderNumber",
      sorter: (a, b) => a.orderNumber.localeCompare(b.orderNumber),
      ...getColumnSearchProps("orderNumber"),
    },
    {
      title: t("ADMIN.ORDER_USER"),
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: t("ADMIN.ORDER_PHONE"),
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: t("ADMIN.ORDER_ADDRESS"),
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: t("ADMIN.ORDER_CITY"),
      dataIndex: "city",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("city"),
    },
    {
      title: t("ADMIN.ORDER_PAYMENT_METHOD"),
      dataIndex: "paymentMethod",
    },
    {
      title: t("ADMIN.ORDER_TYPE_OF_DELIVERY"),
      dataIndex: "typeofdelivery",
    },
    {
      title: t("ADMIN.ORDER_TOTAL_PRICE"),
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: t("ADMIN.ORDER_CREATED_AT"),
      dataIndex: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(), // Sắp xếp theo thời gian
      render: (createdAt) => new Date(createdAt).toLocaleDateString("en-GB"), // Hiển thị theo định dạng mong muốn
    },
    {
      title: t("ADMIN.ORDER_PAID"),
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
    },
    {
      title: t("ADMIN.ORDER_SHIPPED"),
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
    },
    {
      title: t("ADMIN.ACTION"),
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data
      ?.map((order) => {
        const productNames = order.orderItems
          .map((item) => item.name)
          .join(", ");
        console.log("Order typeofdelivery:", order.typeofdelivery);
        return {
          ...order,
          key: order._id,
          orderNumber: order?.orderNumber,
          userName: order?.shippingAddress?.fullName,
          phone: order?.shippingAddress?.phone,
          address: order?.shippingAddress?.address,
          city: order?.shippingAddress?.city,
          paymentMethod: orderConstant.payment[order?.paymentMethod],
          typeofdelivery: order.typeofdelivery,
          isPaid: order?.isPaid ? t("ADMIN.PAID") : t("ADMIN.UN_PAID"),
          isDelivered: (() => {
            switch (order.isDelivered) {
              case "cancelled":
                return t("ADMIN.CANCELLED");
              case "successful order":
                return t("ADMIN.SUCCESSFULL_ORDER");
              case "pending":
                return t("ADMIN.PENDING");
              case "sended":
                return t("ADMIN.SENDED");
              case "shipping":
                return t("ADMIN.SHIPPING");
              case "delivery success":
                return t("ADMIN.DELIVERY_SUCCESS");
              case "delivery fail":
                return t("ADMIN.DELIVERY_FAIL");
              default:
                return t("ADMIN.UNKNOWN");
            }
          })(),
          totalPrice: convertPrice(order?.totalPrice),
          productNames: productNames,
          createdAt: new Date(order?.createdAt),
        };
      })
      ?.sort((a, b) => b.createdAt - a.createdAt);

  const onUpdateOrder = (values) => {
    const isUnchanged =
      values.isDelivered === orderState.isDelivered &&
      values.isPaid === orderState.isPaid;

    if (isUnchanged) {
      message.error(t("ADMIN.APPLY_ERROR"));
      return; // Dừng xử lý nếu không có thay đổi
    }

    const updateDeliveryPromise = mutationUpdate.mutateAsync({
      id: rowSelected,
      token: user?.access_token,
      isDelivered: values.isDelivered, // Lấy giá trị giao hàng từ form
    });

    const updatePaymentPromise = mutationUpdatePayment.mutateAsync({
      id: rowSelected,
      token: user?.access_token,
      isPaid: values.isPaid, // Lấy giá trị thanh toán từ form
    });

    Promise.allSettled([updateDeliveryPromise, updatePaymentPromise])
      .then((results) => {
        const allSuccess = results.every(
          (result) => result.status === "fulfilled"
        );

        if (allSuccess) {
          message.success(t("ADMIN.UPDATE_SUCCESS_ORDER"));
          setIsOpenDrawer(false);
          queryOrder.refetch(); // Refetch lại dữ liệu
        } else {
          message.error(t("ADMIN.UPDATE_FAIL"));
        }
      })
      .catch(() => {
        message.error(t("ADMIN.UPDATE_FAIL"));
      })
      .finally(() => {
        // Refetch lại dữ liệu khi cả hai thao tác đều kết thúc
        queryOrder.refetch();
        setIsOpenDrawer(false);
      });
  };

  return (
    <div>
      <WrapperHeader>{t("ADMIN.MANAGE_ODERS")}</WrapperHeader>
      <div
        style={{
          height: 200,
          width: 200,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PieChartComponent data={orders?.data} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyOrders}
          columns={columns}
          isLoading={isLoadingOrders || isLoadingDeletedMany}
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
        title={t("ADMIN.UPDATE_DELIVERY")}
        isOpen={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
        styles={{ body: { padding: "24px" } }}
        centered
        width={800}
      >
        {/* ... */}
        <Loading
          isLoading={
            isLoadingUpdate ||
            isLoadingUpdated ||
            isLoadingUpdate ||
            isLoadingUpdatedPayment
          }
        >
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateOrder}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.PRODUCT_NAME")}
              name="productNames"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea
                value={orderState.productNames}
                name="productNames"
                style={{ minHeight: "150px", width: "100%" }}
                readOnly
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.DELIVERY_STATE")}
              name="isDelivered"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.SELECT_DELIVERY"),
                },
              ]}
            >
              <Select
                value={orderState.isDelivered}
                onChange={(value) => handleOnChange("isDelivered", value)}
              >
                <Select.Option value="cancelled">
                  {t("ADMIN.CANCELLED")}
                </Select.Option>
                <Select.Option value="successful order">
                  {t("ADMIN.SUCCESSFULL_ORDER")}
                </Select.Option>
                <Select.Option value="pending">
                  {t("ADMIN.PENDING")}
                </Select.Option>
                <Select.Option value="sended">
                  {t("ADMIN.SENDED")}
                </Select.Option>
                <Select.Option value="shipping">
                  {t("ADMIN.SHIPPING")}
                </Select.Option>
                <Select.Option value="delivery success">
                  {t("ADMIN.DELIVERY_SUCCESS")}
                </Select.Option>
                <Select.Option value="delivery fail">
                  {t("ADMIN.DELIVERY_FAIL")}
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t("ADMIN.PAYMENT_STATE")}
              name="isPaid"
              rules={[{ required: true, message: t("ADMIN.SELECT_PAY") }]}
            >
              <Select
                value={orderState.isPaid}
                onChange={(value) => handleOnChange("isPaid", value)}
              >
                <Select.Option value={true}>{t("ADMIN.PAID")}</Select.Option>
                <Select.Option value={false}>
                  {t("ADMIN.UN_PAID")}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {t("ADMIN.DETAIL_USER_APPLY")}
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title={t("ADMIN.DELETE_ALL_ORDER")}
        open={isModalOpenDeleteAll}
        onCancel={() => setIsModalOpenDeleteAll(false)}
        onOk={handleConfirmDeleteAll}
      >
        <Loading isLoading={isLoadingDeletedMany}>
          <div>{t("ADMIN.MESS_DELETE_ALL_ORDER")}</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title={t("ADMIN.DELETE_ORDER")}
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteOrder}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>{t("ADMIN.MESS_DELETE_ORDER")}</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminOrder;
