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

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isOpenDrawerPayment, setIsOpenDrawerPayment] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [stateOrderDelivery, setStateOrderDelivery] = useState({
    isDelivered: true,
  });
  const [stateOrderPayment, setStateOrderPayment] = useState({ idPaid: true });

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

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrder });
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  // console.log(queryOrder)
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
        setStateOrderDelivery(res.data);
      } else {
        message.error("Failed to fetch order details");
      }

      setIsLoadingUpdate(false);
    },
    [accessToken]
  );

  //Show tinh trang thanh toan
  const fetchGetDetailsOrderPayment = useCallback(
    async (rowSelected) => {
      const res = await OrderService.getDetailsOrder(rowSelected, accessToken);

      if (res?.status === "OK") {
        // Giả sử bạn muốn lấy chi tiết thanh toán và lưu vào state
        setStateOrderPayment(res.data);
      } else {
        message.error("Failed to fetch payment details");
      }

      setIsLoadingUpdate(false);
    },
    [accessToken]
  );

  //Cập nhật giao hàng
  const statusDataUpdated = dataUpdated?.status;
  useEffect(() => {
    if (isSuccessUpdated && statusDataUpdated === "OK") {
      message.success("Update Delivery Success");
      setIsOpenDrawer(false);
    } else if (isErrorUpdated) {
      message.error("Update Fail");
    }
  }, [isSuccessUpdated, isErrorUpdated, statusDataUpdated]);

  //Cập nhật payment
  const statusDataUpdatedPayment = dataUpdatedPayment?.status;
  useEffect(() => {
    if (isSuccessUpdatedPayment && statusDataUpdatedPayment === "OK") {
      message.success("Update Payment Success");
      setIsOpenDrawerPayment(false);
    } else if (isErrorUpdatedPayment) {
      message.error("Update Fail");
    }
  }, [
    isSuccessUpdatedPayment,
    isErrorUpdatedPayment,
    statusDataUpdatedPayment,
  ]);

  //Xoá nhiều
  const statusDataDeletedMany = dataDeletedMany?.status;
  useEffect(() => {
    if (isSuccessDeletedMany && statusDataDeletedMany === "OK") {
      message.success("Delete orders Success");
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany, statusDataDeletedMany, isErrorDeletedMany]);

  //Xoá 1
  const statusDataDeleted = dataDeleted?.status;
  useEffect(() => {
    if (isSuccessDeleted && statusDataDeleted === "OK") {
      message.success("Delete order Success");
      setIsModalOpenDelete(false);
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, statusDataDeleted, isErrorDeleted]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrder(rowSelected);
    }
  }, [rowSelected, isOpenDrawer, fetchGetDetailsOrder]);

  useEffect(() => {
    if (rowSelected && isOpenDrawerPayment) {
      setIsLoadingUpdate(true);
      fetchGetDetailsOrderPayment(rowSelected);
    }
  }, [rowSelected, isOpenDrawerPayment, fetchGetDetailsOrderPayment]);

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
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            // onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            // onClick={() => clearFilters && handleReset(clearFilters)}
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        // setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "User name",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Payment method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Paid",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Update Payment",
      dataIndex: "isPaid",
      render: renderActionPay,
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps("isPaid"),
    },
    {
      title: "Shipped",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
    },
    {
      title: "Update Delivered",
      dataIndex: "isDelivered",
      render: renderAction,
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps("isDelivered"),
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
        isPaid: order?.isPaid ? "TRUE" : "FALSE",
        isDelivered: order?.isDelivered ? "Delivered" : "Not Shipped",
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  const onUpdateDelivery = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateOrderDelivery },
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
      <WrapperHeader>Manage Orders</WrapperHeader>
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
        title="Update Delivery"
        isOpen={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        {/* ... */}
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="updateDeliveryStateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateDelivery}
            autoComplete="on"
          >
            <Form.Item
              label="Delivery State:"
              name="isDelivered"
              rules={[
                {
                  required: true,
                  message: "Please select the delivery state!",
                },
              ]}
            >
              <Select
                defaultValue={stateOrderDelivery.isDelivered}
                onChange={(value) =>
                  setStateOrderDelivery({ isDelivered: value })
                }
              >
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <DrawerComponent
        title="Update Payment"
        isOpen={isOpenDrawerPayment}
        onCancel={() => setIsOpenDrawerPayment(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdatedPayment}>
          <Form
            name="updatePaymentStateForm"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdatePayment}
            autoComplete="on"
          >
            <Form.Item
              label="Payment State:"
              name="isPaid"
              rules={[
                { required: true, message: "Please select the payment state!" },
              ]}
            >
              <Select
                defaultValue={stateOrderPayment.isPaid}
                onChange={(value) => setStateOrderPayment({ isPaid: value })}
              >
                <Select.Option value={true}>True</Select.Option>
                <Select.Option value={false}>False</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
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
          <div>Are you sure you want to delete this order?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderAdmin;
