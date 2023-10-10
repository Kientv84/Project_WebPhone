import { Col } from 'antd'
import React from 'react'
import { WrapperHeader,WrapperTextHeader, WrapperHeaderAccount, WrapperTextHeaderSmall
, } from './style'
import Search from 'antd/es/input/Search'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';




const Header = () => {
  return (

    <div>   
      <WrapperHeader gutter={16}>
        <Col span={6}>
          <WrapperTextHeader> WEBPHONE </WrapperTextHeader>
        </Col>
        <Col span={12}>
          <ButtonInputSearch 
            bordered = {false}
            size = "large"
            placeholder = "search webphone"
            textButton = "search"

          
           />
        </Col>
        <Col span={6} style={{display: "flex", gap: '20px', alignItems: 'center'}}>
          <WrapperHeaderAccount>
            <UserOutlined style={{fontSize: '30px'}} />
            <div>
              <WrapperTextHeaderSmall>Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
            <div>             
              <ShoppingCartOutlined style={{fontSize: "40px", color: "#fff"}} />
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>    
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default Header
