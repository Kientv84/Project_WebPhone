import { Menu } from 'antd';
import React from 'react'
import { useState } from 'react';
import { getItem } from '../../utils';
import {UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import AdminUser from '../AdminUser/AdminUser';
import AdminProduct from '../AdminProduct/AdminProduct';
const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),

        getItem(' Sản phẩm', 'product', <AppstoreOutlined />),
    ];

    
    // const rootSubmeuKeys = ['user', 'product'];
    // const [openKeys, setOpenkeys] = useState(['user']);
    const [keySelected, setKeySlected] = useState('')

    // const oneOpenChange = (keys) => {
    //     const latestOpenKey = keys.find(key) => openKeys.indexOf(key) === -1);
    //     if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //         setOpenkeys(keys);
    //     } else {
    //         setOpenkeys(latesOpenKey ? [latesOpenKey] : []);
    //     }
    // };

    const  renderPage = (key) => {
        switch(key) {
            case 'user':
                return (
                    <AdminUser />
                )
            case 'product':
                return (
                    <AdminProduct />
                )
            default:
                return 
        }
    }

    const handleOnclick = ({ key }) => {
        setKeySlected(key)
    }

  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart />  
    <div style={{ display: 'flex',}}>
        <Menu
            mode="inline"
            // openKeys={openKeys}
            // onOpenChange={onOpenChange}
            style={{
                width: 256,
                boxShadow: '1px 1px 2px #ccc',
                height: '100vh'
            }}
            items={items}
            onClick={handleOnclick}
        />
        <div style={{flex: 1, padding: '15px' }}>
           {renderPage(keySelected)}
        </div>
    </div>
    </>
  )
}
     

export default AdminPage
