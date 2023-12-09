import React, { useEffect } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperProducts, WrapperTextHeader, WrapperTextHeaderSmall, WrapperTextHeaderSmall1, WrapperTypeProduct } from "./style"
import slider1 from "../../assets/images/slider1.webp"
import slider2 from "../../assets/images/slider2.webp"
import slider3 from "../../assets/images/slider3.webp"
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "react-query";
import * as ProductService from '../../services/ProductService'
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { setOrderItems } from '../../redux/slice/orderSlide';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slice/userslide';
import { resetOrder1 } from '../../redux/slice/orderSlide';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Badge, Col, Popover } from "antd";
import ButtonInputSearch from "../../components/ButtonInputSearch/ButtonInputSearch";

const HomePage = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(12)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK')
            setTypeProducts(res?.data)
    }

    const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true })
    useEffect(() => {
        fetchAllTypeProduct()
    }, [])


    // header
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)

    const handleNavigateLogin = () => {
        navigate('/sign-in')


    }

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        dispatch(resetOrder1());
        setLoading(false);
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

    const handleCartClick = () => {
        if (!user?.id) {
            navigate('/sign-in');
        } else {
            navigate('/order');
        }
    };


    return (
        <div>
            <div style={{ width: '100%', background: '#42C8B7', display: 'flex', justifyContent: 'center' }}>
                <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
                    <Col span={5}>
                        <WrapperTextHeader to='/'> WEBPHONE </WrapperTextHeader>
                    </Col>
                    {!isHiddenSearch && (
                        <Col span={13}>
                            <ButtonInputSearch
                                size="large"
                                placeholder="What do you need to find?"
                                textbutton="Search"
                                onChange={(e) => setSearch(e.target.value)}
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
                            <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
                                <Badge count={order?.orderItems?.length} size='small'>
                                    <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                                </Badge>
                                <WrapperTextHeaderSmall1>Cart</WrapperTextHeaderSmall1>
                            </div>
                        )}
                    </Col>
                </WrapperHeader>
            </div>
            <Loading isLoading={isLoading || loading}>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <WrapperTypeProduct>
                        {typeProducts.map((item) => {
                            return (
                                <TypeProduct name={item} key={item} />
                            )
                        })}
                    </WrapperTypeProduct>
                </div>
                <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
                    <div id="container" style={{ height: 'auto', width: '1270px', margin: '0 auto' }}>
                        <SliderComponent arrImages={[slider1, slider2, slider3]} />
                        <WrapperProducts>
                            {products?.data?.filter((product) => {
                                const searchLower = search.toLowerCase();
                                const productNameLower = product.name.toLowerCase();
                                return productNameLower.includes(searchLower);
                            }).map((product) => {
                                return (
                                    <CardComponent
                                        key={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        rating={product.rating}
                                        type={product.type}
                                        sold={product.selled}
                                        discount={product.discount}
                                        id={product._id}
                                    />
                                )
                            })}
                        </WrapperProducts>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <WrapperButtonMore
                                textbutton={isPreviousData ? 'Loading..' : "Load more"} type="outline" styleButton={{
                                    border: '1px solid rgb(10, 104, 255)',
                                    color: `${products?.totalProduct === products?.data?.length ? '#ccc' : 'rgb(10, 104, 255)'}`,
                                    width: '240px',
                                    height: '38px',
                                    borderRadius: '4px',
                                }}
                                disabled={products?.totalProduct === products?.data?.length || products?.totalPage === 1}
                                styletextbutton={{ fontWeight: 500, color: products?.totalProduct === products?.data?.length && '#fff' }}
                                onClick={() => setLimit((prev) => prev + 6)}
                            />
                        </div>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default HomePage;