import { Form, Radio } from 'antd'
import React, { useEffect, useState } from 'react'
import { Label, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { removeAllOrderProduct } from '../../redux/slice/orderSlide';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService';
import * as  OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slice/userslide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import * as PaymentService from '../../services/PaymentService';

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm();

  const dispatch = useDispatch()

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 1 && priceMemo < 200000) {
      return 30000
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0
    } else {
      return 10000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])



  const handleAddOrder = () => {
    if (user?.access_token && order?.orderItemsSelected
      && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      // console.log('first', user)
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email,
        }
      )
    }
  }
  // console.log('order', order, user)

  const mutationUpdate = useMutationHook(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationAddOrder = useMutationHook(
    (data) => {
      const {
        token,
        ...rests } = data
      const res = OrderService.createOrder(
        { ...rests }, token)
      return res
    },
  )

  const { isLoading, data } = mutationUpdate
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order.orderItemsSelected.forEach(element => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        }
      })
    }
    else if (isError) {
      message.error('Đã xảy ra lỗi khi đặt hàng')
    }
  }, [isSuccess, isError])

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInfoUser = () => {
    // console.log('stateUserDetails', stateUserDetails)
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  // const itemsDelivery = [
  //   {
  //     title: '20.000 VND',
  //     description: 'Dưới 200.000 VND',
  //   },
  //   {
  //     title: '10.000 VND',
  //     description: 'Từ 200.000 VND đến dưới 500.000 VND',
  //   },
  //   {
  //     title: 'Free ship',
  //     description: 'Trên 500.000 VND',
  //   },
  // ]


  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }

  const handlePayment = (e) => {
    setPayment(e.target.value)
  }


  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      {
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        isPaid: true,
        paidAt: details.update_time,
        email: user?.email,
      }
    )
    // console.log('details, data', details, data)
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript()
    } else {
      setSdkReady(true)
    }
  }, [])

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h3 style={{ fontWeight: 'bold' }}>Payment</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Label>Choose payment method</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Choose payment method</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money"> Cash on Delivery" (COD)</Radio>
                    <Radio value="paypal"> Pay with PayPal</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>

            </WrapperLeft>

            <WrapperRight>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div>
                    <span>Address: </span>
                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{ color: '#9255FD', cursor: 'pointer' }}>Change</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Discount</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Delivery Cost</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Total</span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                    <span style={{ color: '#000', fontSize: '11px' }}>(Including VAT if applicable)</span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === 'paypal' && sdkReady ? (
                <div style={{ width: '320px' }}>
                  <PayPalButton
                    amount={Math.round(totalPriceMemo / 24000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("Error")
                    }}
                  />
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    background: 'rgb(255, 57, 69)',
                    height: '48px',
                    width: '320px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textbutton={'Order Now'}
                  styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent title="Update shipping address" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please input your city!' }]}
              >
                <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your  phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your  address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading >
    </div>
  )
}

export default PaymentPage