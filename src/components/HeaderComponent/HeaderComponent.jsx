import React from 'react';
import { Badge, Col } from 'antd';
import { WrapperHeaderAccount, WrapperHeader, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '..//ButtonInputSearch/ButtonInputSearch';


const HeaderComponent = () => {
  return (
    <div style={{ width: '100%', background: '#42C8B7', display:'flex', justifyContent: 'center'}}>      
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader> WEBPHONE </WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonInputSearch 
            bordered = {false}
            size = "large"
            placeholder="What do you need to find?"
            textButton="Search"
           />
        </Col>
        <Col span={6} style={{display: "flex", gap: '54px', alignItems: 'center'}}>
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
              <Badge count={4} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff'}} />
              </Badge>         
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>    
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
