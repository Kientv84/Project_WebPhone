import { Button, Form, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from 'react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user)
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
  });

  const [form] = Form.useForm();

  const mutation = useMutationHook(
    (data) => {
      const { name, price, description, rating, image, type,
        countInStock } = data
      const res = ProductService.createProduct({
        name, price,
        description, rating, image, type, countInStock
      })
      return res
    }
  )

  const mutationUpdate = useMutationHook(
    (data) => {
      const { id, token, ...rests } = data
      const res = ProductService.updateProduct(
        id, token,
        { ...rests } // này là data nên phải là object
      )
      return res
    }
  )

  const mutationDeleted = useMutationHook(
    (data) => {
      const { id, token} = data
      const res = ProductService.deleteProduct(
        id, token
      )
      return res
    }
  )

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock
      })
    }
    setIsLoadingUpdate(false)
  }
  // khi bấm edit sản phẩm nó giúp cho việc hiện ra lại các thông tin cần edit
  useEffect(() => {
    form.setFieldsValue(stateProductDetails)
  }, [form, stateProductDetails])

  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected])

  //
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)

  }

  const { data, isLoading, isSuccess, isError } = mutation
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProduct })
  const { isLoading: isLoadingProducts, data: products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '28px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'red', fontSize: '28px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
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
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'), //search name
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        { text: '>= 10000000', value: '>=' },
        { text: '<= 10000000', value: '<=' },
      ],
      onFilter: (value, record) => {
        if(value === '>='){
          return record.price >= 10000000;
        }
        return record.price <=10000000;
        
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        { text: '>= 3.5', value: '>=' },
        { text: '<= 3.5', value: '<=' },
      ],
      onFilter: (value, record) => {
        if(value === '>='){
          return record.rating >= 3.5;
        }
        return record.rating <=3.5;
        
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      ...getColumnSearchProps('type'), //search type

    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,

    },

  ];
  const dataTable = products?.data?.length && products?.data?.map((product) => {
    return { ...product, key: product._id };
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])


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
    setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
    })
    form.resetFields()
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token}, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
    })
    form.resetFields()
  };

  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button
          style={{
            height: '150px',
            width: '150px',
            borderRadius: '6px',
            borderStyle: 'dashed',
          }} onClick={() => setIsModalOpen(true)}>
          <PlusOutlined style={{ fontSize: '60px' }} /></Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            }

          };
        }} />
      </div>
      <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null} >
        <Loading isLoading={isLoading || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type" />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please input your rating!' }]}
            >
              <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button>Select File</Button>
                  {stateProduct?.image && (
                    <img src={stateProduct?.image} style={{
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
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
            >
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
              <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
            >
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
            >
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[{ required: true, message: 'Please input your rating!' }]}
            >
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button>Select File</Button>
                  {stateProductDetails?.image && (
                    <img src={stateProductDetails?.image} style={{
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
      <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk = {handleDeleteProduct} >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm không?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct
