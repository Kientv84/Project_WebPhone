import React from 'react'
import { Label, WrapperCountOrder, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperLeft, WrapperItemOrderInfo, WrapperInfo1 } from './style';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderConstant } from '../../constant';

const OrderSuccess = () => {
  const order = useSelector((state) => state.order)
  const location = useLocation()
  // console.log('location', location)
  const { state } = location
  // console.log('state', state)

  return (
    <div style={{ background: '#f5f5fa', with: '100%', height: 'auto', paddingTop: '0.1px' }}>
      <Loading isLoading={false}>
        <div style={{ height: '100%', width: '1270px', margin: '0px auto', padding: '0.1px 0px ' }}>
          <h3 style={{ fontWeight: 'bold' }}>Order Success</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
              <WrapperInfo1>
                <div>
                  <Label>Shipping method</Label>
                  <WrapperValue>
                    <span style={{ color: '#ea8500', fontWeight: 'bold' }}>{orderConstant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo1>
              <WrapperInfo>
                <div>
                  <Label>Payment method</Label>
                  <WrapperValue>
                    {orderConstant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.product}>
                      <div style={{ width: '500px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                        <div style={{
                          width: 260,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{order?.name}</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Price: {convertPrice(order?.price)}</span>
                        </span>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>Quantity: {order?.amount}</span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: '16px', color: 'red' }}>Total: {convertPrice(state?.totalPriceMemo)}</span>
              </div>
            </div>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSuccess