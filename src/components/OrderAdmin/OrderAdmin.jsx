import { Button, Form, Select, Space } from 'antd'
import React, { useState } from 'react'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { convertPrice } from '../../utils'
import * as OrderService from '../../services/OrderService'
import { useQuery } from 'react-query'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderConstant } from '../../constant'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
// import PieChartComponent from './PieChart'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder
  // console.log(queryOrder)

  const renderAction = () => {
    return (
      <div>
        <EditOutlined style={{ color: 'blue', fontSize: '28px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          // onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          color: filtered ? '#1890ff' : undefined,
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
      title: 'User name',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps('userName')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Shipped',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
    {
      title: 'Update Delivered',
      dataIndex: 'isDelivered',
      render: renderAction,
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered')
    },
  ];

  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    console.log('order', order)
    return {
      ...order, key: order._id,
      userName: order?.shippingAddress?.fullName,
      phone: order?.shippingAddress?.phone,
      address: order?.shippingAddress?.address,
      paymentMethod: orderConstant.payment[order?.paymentMethod],
      isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
      isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
      totalPrice: convertPrice(order?.totalPrice)
    }
  })

  const onUpdateProduct = async () => {
    // Assuming you have an API endpoint to update the delivery state
    try {
      // console.log(orders?.data?._id, orders?.data.isDelivered, orders?.data?.access_token)
      // Make an API call to update the delivery state
      await OrderService.updateDeliveryState(orders?.data?._id, orders?.data.isDelivered, orders?.data?.access_token);

      // Close the drawer after successful update
      setIsOpenDrawer(false);

      // Refetch the orders to update the table
      queryOrder.refetch();
    } catch (error) {
      // Handle errors
      console.error('Error updating delivery state:', error);
    }
  };

  return (
    <div>
      <WrapperHeader>Manage Orders</WrapperHeader>
      <div style={{ height: 200, width: 200 }}>
        {/* <PieChartComponent data={orders?.data} /> */}
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
      </div>

      <DrawerComponent title='Update Delivery State' isOpen={isOpenDrawer} onCancel={() => setIsOpenDrawer(false)} footer={null}>
        {/* ... */}
        <Form
          name="updateDeliveryStateForm"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
        >
          {/* Assuming isDelivered is a boolean field */}
          <Form.Item
            label="Update Delivered"
            name="isDelivered"
            rules={[{ required: true, message: 'Please select the delivery state!' }]}
          >
            <Select>
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
      </DrawerComponent>

    </div>
  )
}

export default OrderAdmin