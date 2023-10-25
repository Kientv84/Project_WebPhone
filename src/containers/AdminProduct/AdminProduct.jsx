import React, { useState } from 'react'
import { WrapperHeader } from '../../components/HeaderComponent/style'
import { Button, Form, Modal } from 'antd'
import { PlusOutlined } from '@ant-desgin.icons'
import TableComponent from '../../components/TableComponent/TableComponent'
import InputComponent from '../../components/InputComponent/InputComponent'


const AdminProduct = () => {
  const [isModapOpen, setIsModalOpen] = useState(false);
  const [stateProduct, setStateProduct ] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInstock: '',
  })
  const handleOk =() => {
    onFinish()
  }

const handleCancel= () => {
setIsModalOpen(false)
}

const onFinish = () => {
  console.log('finish', stateProduct)
}

const handleOnchange = (e) => {
  setStateProduct({
    ...stateProduct,
    [e.target.name]: e.target.value
  })
}



  return (
    <div>
        <WrapperHeader >Quản lý sản phẩm</WrapperHeader>
        <div style={{marginTop: '10px'}}>
            <Button style={{height: '15px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px'}}/></Button>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TableComponent />
        </div>
        <Modal title="Tạo sản phẩm" open={isModapOpen}  onCancel={handleCancel} >
          <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name"/>
          </Form.Item>
      
          <Form.Item
            label="Type"
            name="Type"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="type" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="Price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="price" />
          </Form.Item>

          <Form.Item
            label="Instock"
            name="Instock"
            rules={[{ required: true, message: 'Please input your Instock!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="countInStock" />
          </Form.Item>

          <Form.Item
            label="Rating"
            name="Rating"
            rules={[{ required: true, message: 'Please input your Rating!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="rating" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="Description"
            rules={[{ required: true, message: 'Please input your Description!' }]}
          >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="description" />
          </Form.Item>

        
      
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Modal>
    </div>
  )
}

export default AdminProduct
