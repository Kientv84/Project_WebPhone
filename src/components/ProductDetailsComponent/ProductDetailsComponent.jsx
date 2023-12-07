import { Col, Row, Image, Rate, InputNumber, Form } from 'antd'
import React, { useEffect, useState } from 'react'
// import imageProduct from '../../assets/images/image.png.webp'
import imageProductSmall from '../../assets/images/imagesmall1.png.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleImageSmall, WrapperStyleTextSell, WrapperDecriptionTextProduct, WrapperStyleImageSmall1 } from './style'
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
import ModalComponent from '../ModalComponent/ModalComponent.jsx'
import { useMutationHook } from '../../hooks/useMutationHook.js'
import * as  UserService from '../../services/UserService'
import { updateAddress } from '../../redux/slice/userslide';
import InputComponent from '../InputComponent/InputComponent.jsx'


const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [ErrorLimitOrder, setErrorLimitOrder] = useState(false)
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)


    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })

    const [form] = Form.useForm();
    const navigate = useNavigate()
    const location = useLocation()
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
                localStorage.setItem('cartItems', JSON.stringify(order?.orderItems));

                // Use setTimeout to check localStorage after a short delay
            } else {
                setErrorLimitOrder(true)
            }
        }

    }

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

    const { isLoading1, data } = mutationUpdate

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
                    dispatch(updateAddress({ name, address, city, phone }))
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

    const [currentImage, setCurrentImage] = useState(productDetails?.image);

    const handleThumbnailClick = (thumbnailImage) => {
        setCurrentImage(thumbnailImage);
    };

    useEffect(() => {
        // Set initial image
        setCurrentImage(productDetails?.image);
    }, [productDetails?.image]);

    return (
        <div>
            <Loading isLoading={isLoading}>
                <Row style={{ padding: '25px', background: '#fff', borderRadius: '4px' }}>
                    <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                        <Image src={currentImage} alt="image product" preview={false} />
                        <Row style={{ paddingTop: '10px', marginLeft: '100px' }}>
                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image1} alt="image small" preview={false}
                                    onClick={() => handleThumbnailClick(productDetails?.image1)} />
                            </WrapperStyleColImage>
                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image2} alt="image small" preview={false}
                                    onClick={() => handleThumbnailClick(productDetails?.image2)} />
                            </WrapperStyleColImage>
                        </Row>
                    </Col>

                    <Col span={14} style={{ paddingLeft: ' 90px' }}>
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
                        </div>

                    </Col>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderBottom: '1px solid #e5e5e5', }}>
                        <div style={{ marginBottom: '5px', fontSize: '20px' }}>Description</div>
                        <WrapperDecriptionTextProduct>{(productDetails?.description)}</WrapperDecriptionTextProduct>
                    </div>
                    <CommentComponent datahref={process.env.REACT_APP_IS_LOCAL
                        ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                        : window.location.href} width="1265" />
                </Row>
            </Loading>
            <ModalComponent title="Update Information" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
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
                        <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                    >
                        <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
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
            </ModalComponent>
        </div>
    )
}

export default ProductDetailsComponent
