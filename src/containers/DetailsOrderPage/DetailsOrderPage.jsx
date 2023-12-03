import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
// import logo from '../../assets/images/logo.png'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import { useQuery } from 'react-query'
import { orderConstant } from '../../constant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'

const DetailsOrderPage = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params
    // console.log('id', id)

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        return res.data
    }

    const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
        enabled: id
    })
    const { isLoading, data } = queryOrder

    useEffect(() => {
        if (!isLoading) {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
        }
    }, [isLoading]);

    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [data])

    return (
        <Loading isLoading={isLoading}>
            <div style={{ width: '100%', background: '#f5f5fa' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '1270px' }}>
                    <h4>Order Details</h4>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Recipient's address</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                                <div className='address-info'><span>Address: </span> {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                                <div className='phone-info'><span>Phone Number: </span> {data?.shippingAddress?.phone}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Shipping method</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='delivery-info'><span className='name-delivery'>FAST </span>Giao hàng tiết kiệm</div>
                                <div className='delivery-fee'><span>Shipping Cost: </span> {data?.shippingPrice}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Payment method</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='payment-info'>{orderConstant.payment[data?.paymentMethod]}</div>
                                <div className='status-payment'>{data?.isPaid ? 'Paid' : 'Unpaid'}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>
                    <WrapperStyleContent>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ width: '670px' }}>Product</div>
                            <WrapperItemLabel>Price</WrapperItemLabel>
                            <WrapperItemLabel>Quantity</WrapperItemLabel>
                            <WrapperItemLabel>Discount</WrapperItemLabel>
                        </div>
                        {data?.orderItems?.map((order) => {
                            return (
                                <WrapperProduct>
                                    <WrapperNameProduct>
                                        <img src={order?.image}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                objectFit: 'cover',
                                                border: '1px solid rgb(238, 238, 238)',
                                                padding: '2px'
                                            }}
                                        />
                                        <div style={{
                                            width: 260,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '10px',
                                            height: '70px',
                                        }}>Phone Number</div>
                                    </WrapperNameProduct>
                                    <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                                    <WrapperItem>{order?.amount}</WrapperItem>
                                    <WrapperItem>{order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}</WrapperItem>


                                </WrapperProduct>
                            )
                        })}

                        <WrapperAllPrice>
                            <WrapperItemLabel>Subtotal</WrapperItemLabel>
                            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Shipping Cost</WrapperItemLabel>
                            <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
                        </WrapperAllPrice>
                        <WrapperAllPrice>
                            <WrapperItemLabel>Total</WrapperItemLabel>
                            <WrapperItem><WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem></WrapperItem>
                        </WrapperAllPrice>
                    </WrapperStyleContent>
                </div>
            </div>
        </Loading>
    )
}

export default DetailsOrderPage