import { Col, Row, Image, Rate, InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'
// import imageProduct from '../../assets/images/image.png.webp'
import imageProductSmall from '../../assets/images/imagesmall1.png.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleImageSmall, WrapperStyleTextSell } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from 'react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slice/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../../components/Message/Message'
import { resetOrder } from '../../redux/slice/orderSlide.js'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent.jsx'
import CommentComponent from '../CommentComponent/CommentComponent.jsx'
import './style.css'

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [ErrorLimitOrder, setErrorLimitOrder] = useState(false)
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)

    // console.log('order1', order)
    const navigate = useNavigate()
    const location = useLocation()
    // console.log('dd', location)
    const dispatch = useDispatch()


    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }

    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    // useEffect(() => {
    //     const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    //     console.log('orderReduxx', orderRedux)
    //     if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
    //         setErrorLimitOrder(false)
    //     } else if (productDetails?.countInStock === 0) {
    //         setErrorLimitOrder(true)
    //     }
    // }, [numProduct])

    useEffect(() => {
        if (order.isSuccessOrder) {
            message.success('Success to add product to cart')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSuccessOrder])

    const handleChangeCount = (type, limit) => {
        if (type === 'increase') {
            if (!limit) {
                setNumProduct(numProduct + 1)
            }
        } else {
            if (!limit) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled: !!idProduct })

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails._id)
            // console.log('productDetails', productDetails)
            // console.log('orderRedux', orderRedux)
            // console.log('orderReduxAmount', orderRedux?.amount)
            if ((orderRedux?.amount + numProduct) <= productDetails.countInStock || (!orderRedux && productDetails.countInStock > 0)) {
                // console.log('productDetails', productDetails)

                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,
                        countInStock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    // console.log('productDetails', productDetails, user)

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image product" preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>

                <Col span={14} style={{ paddingLeft: ' 10px' }}>
                    <WrapperStyleNameProduct> {productDetails?.name} </WrapperStyleNameProduct>
                    {/* <StarFilled style={{ fontSize:'16px', color: '#FFC400' }} /><StarFilled/> */}
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Sold {productDetails?.selled}</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Delivery To </span>
                        <span className='address'> {user?.address}  </span>
                        <span className='change-address' onClick={handleChangeAddress} style={{ color: 'rgb(66, 200, 183)', cursor: 'pointer' }}>Change Address</span>
                    </WrapperAddressProduct>
                    <LikeButtonComponent
                        datahref={process.env.REACT_APP_IS_LOCAL
                            ? "https://developers.facebook.com/docs/plugins/"
                            : window.location.href}
                    />
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Quantity</div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} defaultValue={1} value={numProduct} size="middle" />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgba(13, 129, 115, 0.82)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    pointerEvents: ErrorLimitOrder ? 'none' : 'auto',
                                    opacity: ErrorLimitOrder ? 0.5 : 1,
                                }}
                                onClick={handleAddOrderProduct}
                                textbutton={'Add Product to Cart'}
                                styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                            {ErrorLimitOrder && <span style={{ color: 'red', display: 'flex', alignItems: 'center' }} >Sold Out</span>}
                        </div>

                        {/* <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13,92,182',
                                borderRadius: '4px'
                            }}
                            textbutton={'Post Purchase'}
                            styletextbutton={{ color: 'rgb(13,92,182)', fontSize: '15px' }}
                        ></ButtonComponent> */}
                    </div>
                </Col>
                <CommentComponent datahref={process.env.REACT_APP_IS_LOCAL
                    ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                    : window.location.href} width="1001" />
            </Row>
        </Loading>
    )
}

export default ProductDetailsComponent
