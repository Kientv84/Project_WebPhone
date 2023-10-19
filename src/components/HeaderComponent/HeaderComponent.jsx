import React from 'react';
import { Badge, Col } from 'antd';
import { WrapperHeaderAccount, WrapperHeader, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '..//ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const HeaderComponent = ( isHiddenSearch = false, isHiddenCart = false) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  console.log('user ',user)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

const content = (
  <div>
    {user?.isAdmin && (
      <WrapperContentPopup onClick={() => navigate('/system/admin')}> quản lý hệ thống </WrapperContentPopup>
    )}
    
  </div>
) ;

  return (
    <div style={{ width: '100%', background: '#42C8B7', display:'flex', justifyContent: 'center'}}>      
      <WrapperHeader style = {{ justifyContent: isHiddenSearch && isHiddenCart ? | 'space-betwween' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader> WEBPHONE </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
          <ButtonInputSearch 
            size = "large"
            placeholder="What do you need to find?"
            textButton="Search"
           />
        </Col>
        )}
        
        <Col span={6} style={{display: "flex", gap: '54px', alignItems: 'center'}}>
          <WrapperHeaderAccount>
            <UserOutlined style={{fontSize: '30px'}} />
            {user?.name ? (
              <div style={{ cursor:'pointer'}}>{user.name}</div>
            ) : (
            <div onClick={handleNavigateLogin} style={{ cursor:'pointer' }}>
              <WrapperTextHeaderSmall>Đăng Nhập/Đăng Ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>Tài Khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
            )}
          </WrapperHeaderAccount>
          {!isHiddenCart && (
             <div>    
              <Badge count={4} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff'}} />
              </Badge>         
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>  
          )}
             
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
