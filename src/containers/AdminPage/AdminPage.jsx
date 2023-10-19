import { Menu } from 'antd';
import React from 'react'
import { useState } from 'react';
import { getItem } from '../../utils';
import {UserOutlined, AppstoreOutlined } from '@ant-design/icons'
const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />, [
            getItem('Option 1', '1'),
            getItem('Option 2', '2'),
            getItem('Option 3', '3'),
            getItem('Option 4', '4'),
        ]),

        getItem(' Sản phẩm', 'product', <AppstoreOutlined />, [
            getItem('Option 5', '5'),
            getItem('Option 6', '6'),
            getItem('Option 7', '7'),
            getItem('Option 8', '8'),
        ]),
    ];

    
    const rootSubmeuKeys = ['user', 'product'];
    const [openKeys, setOpenkeys] = useState(['user']);
    const [keySelected, setKeySlected] = useState('')

    const oneOpenChange = (keys) => {
        const latestOpenKey = keys.find(key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenkeys(keys);
        } else {
            setOpenkeys(latesOpenKey ? [latesOpenKey] : []);
        }
    };

    const handleOnclick = ({ key }) => {
        setKeySlected(key)
    }

  return (
    <>
    <HeaderComponent isHiddenSearch isHiddenCart />  
    <div style={{ display: 'flex',}}>
        <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{
                width: 256,
            }}
            items={items}
            onClick={handleOnclick}
        />
        <div>
            {keySelected === 6 && <span> Key la 6 </span>}
        </div>
    </div>
    </>
  )
}
     

export default AdminPage
