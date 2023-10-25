import React from 'react'
import { WrapperHeader } from '../../components/HeaderComponent/style'
import { Button } from 'antd'
import { PlusOutlined} from '@ant-desgin.icons'
import TableComponent from '../../components/TableComponent/TableComponent'

const AdminUser = () => {
  return (
    <div>
        <WrapperHeader >Quản lý người dùng</WrapperHeader>
        <div>
            <Button style={{height: '15px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}}><PlusOutlined style={{ fontSize: '60px'}}/>  </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
            <TableComponent />
        </div>
    </div>
  )
}

export default AdminUser
