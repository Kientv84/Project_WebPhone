import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/Message'
import { useSelector } from 'react-redux'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useQuery } from 'react-query'


const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  });

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHook(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token // này là data nên phải là object
      )
      return res
    }
  )

  const mutationDeleted = useMutationHook(
    (data) => {
      const { id, token } = data
      const res = UserService.deleteUser(
        id, token
      )
      return res
    }
  )

  const mutationDeletedMany = useMutationHook(
    (data) => {
      const { token, ...ids } = data
      const res = UserService.deleteManyUser(
        ids, token
      )
      return res
    }
  )

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const getAllUsers = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await UserService.getAllUser(user?.access_token)
    return { data: res?.data, key: 'user' }
  }

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
      })
    }
    setIsLoadingUpdate(false)
  }
  // khi bấm edit sản phẩm nó giúp cho việc hiện ra lại các thông tin cần edit
  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  //
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)

  }

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany


  const queryUser = useQuery({ queryKey: ['user'], queryFn: getAllUsers })
  const { isLoading: isLoadingUsers, data: users } = queryUser

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '28px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'blue', fontSize: '28px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name') //search name
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.localeCompare(b.address),
      ...getColumnSearchProps('address'), //search name
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        { text: 'True', value: true },
        { text: 'False', value: false },
      ],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone'), //search phone
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' };
  })


  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCancelDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const confirmDelete = (onOk) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }


  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }


  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            }

          };
        }} />
      </div>
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: 'Please input your avatar!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button>Select File</Button>
                  {stateUserDetails?.avatar && (
                    <img src={stateUserDetails?.avatar} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '30px',

                    }} alt="avatar" />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminUser
