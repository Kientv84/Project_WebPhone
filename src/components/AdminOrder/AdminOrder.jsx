import { Button, Form, Select, Space, message } from "antd";
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
  const [isOpenDrawerPayment, setIsOpenDrawerPayment] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [stateOrderDelivery, setStateOrderDelivery] = useState({
    isDelivered: null,
  });
  const [stateOrderPayment, setStateOrderPayment] = useState({ isPaid: null });
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

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataUpdatedPayment,
    isLoading: isLoadingUpdatedPayment,
    isSuccess: isSuccessUpdatedPayment,
    isError: isErrorUpdatedPayment,
  } = mutationUpdatePayment;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    // isLoading: isLoadingDeletedMany,
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
      <div>
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

  const renderActionPay = () => {
    return (
      <div>
        <MoneyCollectTwoTone
          style={{ color: "green", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsOpenDrawerPayment(true)}
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
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  // show ra tình trạng đơn hàng
  const accessToken = user?.access_token;
  const fetchGetDetailsOrder = useCallback(
    async (rowSelected) => {
      const res = await OrderService.getDetailsOrder(rowSelected, accessToken);

      if (res?.status === "OK") {
        setStateOrderDelivery({ isDelivered: res.data.isDelivered });
      } else {
        message.error("Failed to fetch order details");
      }

      setIsLoadingUpdate(false);
    },
    [accessToken]
  );

  useEffect(() => {
    form.setFieldsValue(stateOrderDelivery);
  }, [form, stateOrderDelivery]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer, fetchGetDetailsOrder]);

  //Show tinh trang thanh toan
  const fetchGetDetailsOrderPayment = useCallback(
    async (rowSelected) => {
      const res = await OrderService.getDetailsOrder(rowSelected, accessToken);

      if (res?.status === "OK") {
        // Giả sử bạn muốn lấy chi tiết thanh toán và lưu vào state
        setStateOrderPayment({ isPaid: res?.data?.isPaid });
      } else {
        message.error("Failed to fetch payment details");
      }

      setIsLoadingUpdate(false);
    },
    [accessToken]
  );

  useEffect(() => {
    form.setFieldsValue(stateOrderPayment);
  }, [form, stateOrderPayment]);

  useEffect(() => {
    if (rowSelected && isOpenDrawerPayment) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrderPayment(rowSelected);
    }
  }, [rowSelected, isOpenDrawerPayment, fetchGetDetailsOrderPayment]);

  const handleOnchangePayment = (value) => {
    setStateOrderPayment({
      ...stateOrderPayment,
      isPaid: value,
    });
  };

  //Cập nhật giao hàng
  const statusDataUpdated = dataUpdated?.status;
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success(t("ADMIN.UPDATE_DELIVERY_SUCC"));
      setIsOpenDrawer(false);
    } else if (isErrorUpdated) {
      message.error(t("ADMIN.UPDATE_DELIVERY_FAIL"));
    }
  }, [isSuccessUpdated, isErrorUpdated, statusDataUpdated]);

  //Cập nhật payment
  const statusDataUpdatedPayment = dataUpdatedPayment?.status;
  useEffect(() => {
    if (isSuccessUpdatedPayment && dataUpdatedPayment?.status === "OK") {
      message.success(t("ADMIN.UPDATE_PAY_SUCC"));
      setIsOpenDrawerPayment(false);
    } else if (isErrorUpdatedPayment) {
      message.error(t("ADMIN.UPDATE_PAY_FAIL"));
    }
  }, [
    isSuccessUpdatedPayment,
    isErrorUpdatedPayment,
    statusDataUpdatedPayment,
  ]);

  //Xoá nhiều
  const statusDataDeletedMany = dataDeletedMany?.status;
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success(t("ADMIN.DELETE_MANY_SUCCESS"));
    } else if (isErrorDeletedMany) {
      message.error(t("ADMIN.DELETE_MANY_FAIL"));
    }
  }, [isSuccessDeletedMany, statusDataDeletedMany, isErrorDeletedMany]);

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
      title: t("ADMIN.ORDER_PAYMENT_METHOD"),
      dataIndex: "paymentMethod",
    },
    {
      title: t("ADMIN.ORDER_TOTAL_PRICE"),
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
    },
    {
      title: t("ADMIN.ORDER_PAID"),
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
    },
    {
      title: t("ADMIN.ORDER_UPDATE_PAY"),
      dataIndex: "isPaid",
      render: renderActionPay,
    },
    {
      title: t("ADMIN.ORDER_SHIPPED"),
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
    },
    {
      title: t("ADMIN.ORDER_UPDATE_DELIVERED"),
      dataIndex: "isDelivered",
      render: renderAction,
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? t("ADMIN.PAID") : t("ADMIN.UN_PAID"),
        isDelivered: (() => {
          switch (order.isDelivered) {
            case "not shipped":
              return t("ADMIN.NOT_SHIPPED");
            case "pending":
              return t("ADMIN.PENDING");
            case "shipped":
              return t("ADMIN.SHIPPED");
            case "delivered":
              return t("ADMIN.DELIVERED");
            case "cancelled":
              return t("ADMIN.CANCELLED");
            default:
              return t("ADMIN.UNKNOWN");
          }
        })(),
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  // const onUpdateDelivery = () => {
  //   mutationUpdate.mutate(
  //     { id: rowSelected, token: user?.access_token, ...stateOrderDelivery },
  //     {
  //       onSettled: () => {
  //         queryOrder.refetch();
  //       },
  //     }
  //   );
  // };
  const onUpdateDelivery = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        isDelivered: stateOrderDelivery.isDelivered,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const onUpdatePayment = () => {
    mutationUpdatePayment.mutate(
      { id: rowSelected, token: user?.access_token, ...stateOrderPayment },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
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
          isLoading={isLoadingOrders}
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
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="updateDeliveryStateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateDelivery}
            autoComplete="on"
            form={form}
          >
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
                value={stateOrderDelivery.isDelivered}
                onChange={(value) =>
                  setStateOrderDelivery({ isDelivered: value })
                }
              >
                <Select.Option value="not shipped">
                  {t("ADMIN.NOT_SHIPPED")}
                </Select.Option>
                <Select.Option value="pending">
                  {t("ADMIN.PENDING")}
                </Select.Option>
                <Select.Option value="shipped">
                  {t("ADMIN.SHIPPED")}
                </Select.Option>
                <Select.Option value="delivered">
                  {t("ADMIN.DELIVERED")}
                </Select.Option>
                <Select.Option value="cancelled">
                  {t("ADMIN.CANCELLED")}
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

      <DrawerComponent
        title={t("ADMIN.ORDER_UPDATE_PAY")}
        isOpen={isOpenDrawerPayment}
        onCancel={() => setIsOpenDrawerPayment(false)}
        footer={null}
        styles={{ body: { padding: "24px" } }}
        centered
        width={800}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdatedPayment}>
          <Form
            name="updatePaymentStateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdatePayment}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.PAYMENT_STATE")}
              name="isPaid"
              rules={[{ required: true, message: t("ADMIN.SELECT_PAY") }]}
            >
              <Select
                value={stateOrderPayment.isPaid}
                onChange={handleOnchangePayment}
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
        title="Delete order"
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
