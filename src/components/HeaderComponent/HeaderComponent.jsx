import React, { useState } from 'react';
import { Badge, Col, Popover } from 'antd';
import { WrapperHeaderAccount, WrapperHeader, WrapperTextHeader, WrapperTextHeaderSmall, WrapperContentPopup } from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '..//ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slice/userslice'
import Loading from '../LoadingComponent/Loading';

const HeaderComponent = () => {
      const navigate = useNavigate()
      const user = useSelector((state) => state.user)
      const dispatch = useDispatch()
      const [ loading, setLoading ] = useState(false) 
      console.log('user ',user)
      
      const handleNavigateLogin = () => {
        navigate('/sign-in')
      }
      const handleLogout = async() => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser({}))
        setLoading(false)
      }

      const content = (
        <div>
          <WrapperContentPopup onClick={handleLogout}>Logout</WrapperContentPopup>
          <WrapperContentPopup onClick={() => navigate('/profile-user')}>Information</WrapperContentPopup>
        </div>
      );

      return (
        <div style={{ width: '100%', background: '#42C8B7', display:'flex', justifyContent: 'center'}}>      
          <WrapperHeader>
            <Col span={5}>
              <WrapperTextHeader> WEBPHONE </WrapperTextHeader>
            </Col>
            <Col span={13}>
              <ButtonInputSearch 
                size = "large"
                placeholder="What do you need to find?"
                textButton="Search"
              />
            </Col>
            <Col span={6} style={{display: "flex", gap: '54px', alignItems: 'center'}}>
            <Loading isLoading={loading} >
              <WrapperHeaderAccount>
                <UserOutlined style={{fontSize: '30px'}} />
                {user?.access_token ? (
                    <>
                      <Popover content={content} trigger="click">
                        <div style={{ cursor:'pointer'}}>{user?.name.length ? user?.name : user?.email}</div>
                      </Popover>  
                    </>
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
            </Loading>
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
