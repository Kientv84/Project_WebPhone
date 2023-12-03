import React, { useEffect, useState } from 'react';
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
import { resetUser } from '../../redux/slice/userslide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slice/productSlide';


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  // console.log('user ', user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
    navigate('/');
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>My Information</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Management</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>My Order</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Log Out</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{ width: '100%', background: '#42C8B7', display: 'flex', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader onClick={() => navigate('/')}> WEBPHONE </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              placeholder="What do you need to find?"
              textbutton="Search"
              onChange={onSearch}
            />
          </Col>
        )}
        <Col span={6} style={{ display: "flex", gap: '54px', alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '40px',
                  width: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <Popover content={content} trigger="click" open={isOpenPopup} >
                  <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Sign-In/ Sign-Up</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size='small'>
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall>Cart</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
