import React, { useEffect, useState } from "react";
import { Badge, Col, Popover, Button  } from "antd";
import {
  WrapperHeaderAccount,
  WrapperHeader,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
  WrapperContentPopup,
  WrapperTextHeaderSmall1,
  WrapperTypeProduct,
  WrapperLanguages
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "..//ButtonInputSearch/ButtonInputSearch";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slice/userslide";
import Loading from "../LoadingComponent/Loading";
import { searchProduct } from "../../redux/slice/productSlide";
// import Fuse from 'fuse.js';
import { setOrderItems } from "../../redux/slice/orderSlide";
import { resetOrder1 } from "../../redux/slice/orderSlide";
import { convertPrice } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "react-query";
import { useDebounce } from "../../hooks/useDebounce";
import TypeProduct from "../TypeProduct/TypeProduct";
import "./HeaderCoponent.css";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';

const HeaderComponent = ({
  isHiddenSearch = false,
  isHiddenCart = false,
  isHiddenCategory = false,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
  const [typeProducts, setTypeProducts] = useState([]);
  const [limit, setLimit] = useState(12);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [showTypeProduct, setShowTypeProduct] = useState(false);
  const location = useLocation();

  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18next.language); // Mặc định là tiếng Việt

  const toggleLanguage = (lang) => {
      i18next.changeLanguage(lang).then(() => {
      setLanguage(lang); // Cập nhật trạng thái ngôn ngữ
    });
  };
  

  const handleNavigateLogin = () => {
    setShowTypeProduct(false);
    navigate("/sign-in");

    const storedCartItems = localStorage.getItem("cartItems");
    console.log("storedCartItems", storedCartItems);
    if (storedCartItems) {
      dispatch(setOrderItems(JSON.parse(storedCartItems)));
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    dispatch(resetOrder1());
    localStorage.removeItem("cartItems");
    localStorage.removeItem("access_token");
    setLoading(false);
    navigate("/");
    setShowTypeProduct(false);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        {t('HEADER.MY_INFOR')}
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          {t('HEADER.MANAGE')}
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
        {t('HEADER.MY_ORDER')}
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        {t('HEADER.LOG_OUT')}
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    setShowTypeProduct(false);
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "my-order") {
      navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };

  const onSearch = (searchTerm) => {
    setSearch(searchTerm);
  };

  const handleCartClick = () => {
    setShowTypeProduct(false);
    if (!user?.id) {
      navigate("/sign-in");
    } else {
      navigate("/order");
    }
  };

  const handleOnChangeInput = (event) => {
    setSearch(event.target.value);
    setSearch("");
  };

  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") setTypeProducts(res?.data);
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const toggleTypeProduct = () => {
    setShowTypeProduct(!showTypeProduct);
  };

  const getImageIconByType = (type) => {
    const imageIcons = {
      "Phone, Tablet":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-3.svg",
      Laptop:
        "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon-cps-380.svg",

      Television:
        "https://cellphones.com.vn/media/icons/menu/icon-cps-1124.svg",
      Sound: "https://cellphones.com.vn/media/icons/menu/icon-cps-220.svg",
      Screen: "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon_cpu.svg",
    };

    // Trả về icon hoặc chuỗi rỗng nếu không có icon
    return imageIcons[type] || "";
  };

  const desiredOrder = [
    "Phone, Tablet",
    "Laptop",
    "Sound",
    "Screen",
    "Television",
  ]; // Thứ tự mong muốn

  // Sắp xếp typeProducts theo desiredOrder
  const sortedTypeProducts = typeProducts.sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/product")) {
      setShowTypeProduct(false); // Đóng new-wrapper-type-products khi đến trang sản phẩm
    }
  }, [location.pathname]);

  const handleTypeProductClick = (item) => {
    navigate(`/product/${item}`);
    setShowTypeProduct(false);
  };

   // Hàm renderLanguages
  const renderLanguages = () => (
    <div>
      <Button onClick={() => toggleLanguage('en')} style={{ margin: '8px', cursor:'pointer' , color: '#333'}}>
        English
      </Button>
      <Button onClick={() => toggleLanguage('vi')} style={{ margin: '8px', cursor:'pointer' , color: '#333'}}>
        Vietnamese
      </Button>
    </div>
  );

  return (
    <div>
      <div
        className={`overlay ${showTypeProduct ? "visible" : ""}`}
        onClick={toggleTypeProduct}
      ></div>
      <div
        className="header"
        style={{
          width: "100%",
          background: "#42C8B7",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          zIndex: 100,
        }}
      >
        <WrapperHeader
          style={{
            justifyContent:
              isHiddenSearch && isHiddenSearch ? "space-between" : "unset",
          }}
        >
          <Col span={5} style={{ display: "flex", alignItems: "center" }}>
            <WrapperTextHeader to="/"> WEBPHONE </WrapperTextHeader>
            {!isHiddenCategory && (
              <div className="btn-menu" onClick={toggleTypeProduct}>
                <div className="about__box-content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 26.99 26.99"
                    width="20"
                    height="20"
                    style={{ marginRight: "5px" }}
                  >
                    <defs>
                      <style>
                        {`.cls-1 {
              fill: none;
              stroke: #fff;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-width: 1.8px;
            }`}
                      </style>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <line
                          x1="7.06"
                          y1="7.52"
                          x2="19.92"
                          y2="7.52"
                          className="cls-1"
                        />
                        <line
                          x1="7.06"
                          y1="13.49"
                          x2="19.92"
                          y2="13.49"
                          className="cls-1"
                        />
                        <line
                          x1="7.06"
                          y1="19.47"
                          x2="11.95"
                          y2="19.47"
                          className="cls-1"
                        />
                        <rect
                          x="0.9"
                          y="0.9"
                          width="25.19"
                          height="25.19"
                          rx="4.71"
                          className="cls-1"
                        />
                      </g>
                    </g>
                  </svg>
                  <p>{t('HEADER.CATEGORY')}</p>
                </div>
              </div>
            )}
            <div
              className={`new-wrapper-type-products ${
                showTypeProduct ? "show" : ""
              }`}
            >
              <div style={{ flex: "2", marginTop: "20px" }}>
                <WrapperTypeProduct>
                  {sortedTypeProducts.map((item) => {
                    const imageIcon = getImageIconByType(item);
                    return (
                      <TypeProduct
                        name={item}
                        key={item}
                        imageIcon={imageIcon}
                        onClick={() => handleTypeProductClick(item)}
                      />
                    );
                  })}
                </WrapperTypeProduct>
              </div>
            </div>
          </Col>
          {!isHiddenSearch && (
            <Col span={13} style={{ position: "relative" }}>
              <ButtonInputSearch
                size="large"
                placeholder={t('HEADER.SEARCH_PLACEHODER')}
                textbutton={t('HEADER.BUTTON_SEARCH')}
                onChange={handleOnChangeInput}
              />
              <div className="dropdown">
                {products?.data?.filter((product) => {
                  const searchTerm = search.toLowerCase();
                  const productNameLower = product.name.toLowerCase();
                  return (
                    searchTerm &&
                    productNameLower.includes(searchTerm) &&
                    productNameLower !== searchTerm
                  );
                }).length > 0 && <p className="title-box">{t('PROFILE.PRODUCT_SUGGET')}</p>}

                {products?.data
                  ?.filter((product) => {
                    const searchTerm = search.toLowerCase();
                    const productNameLower = product.name.toLowerCase();
                    return (
                      searchTerm &&
                      productNameLower.includes(searchTerm) &&
                      productNameLower !== searchTerm
                    );
                  })
                  .slice(0, 10)
                  .map((product) => (
                    <div
                      onClick={() => onSearch(product.name)}
                      className="dropdown-row"
                      key={product._id}
                    >
                      <img
                        src={product.image} // Đường dẫn tới ảnh sản phẩm
                        alt={product.name}
                      />
                      <div>
                        <span onClick={() => handleDetailProduct(product._id)}>
                          {product.name}
                        </span>

                        <span
                          style={{
                            display: "block",
                            color: "#db003b",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {convertPrice(product.price)}VND
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </Col>
          )}
          <Col
            span={6}
            style={{ display: "flex", gap: "54px", alignItems: "center" }}
          >
            <Loading isLoading={loading}>
              <WrapperHeaderAccount>
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="avatar"
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <UserOutlined style={{ fontSize: "30px" }} />
                )}
                {user?.access_token ? (
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsOpenPopup((prev) => !prev)}
                    >
                      {userName?.length ? userName : user?.email}
                    </div>
                  </Popover>
                ) : (
                  <div
                    onClick={handleNavigateLogin}
                    style={{ cursor: "pointer" }}
                  >
                    <WrapperTextHeaderSmall>
                      {t('HEADER.SIGN_IN_UP')}
                    </WrapperTextHeaderSmall>
                    <div>
                      <WrapperTextHeaderSmall>{t('HEADER.ACCOUNT')}</WrapperTextHeaderSmall>
                      <CaretDownOutlined />
                    </div>
                  </div>
                )}
              </WrapperHeaderAccount>
            </Loading>
            {!isHiddenCart && (
              <div
                onClick={handleCartClick}
                style={{
                  cursor: "pointer",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <Badge count={order?.orderItems?.length} size="small">
                  <ShoppingCartOutlined
                    style={{ fontSize: "30px", color: "#fff" }}
                  />
                </Badge>
                <WrapperTextHeaderSmall1>{t('HEADER.CART')}</WrapperTextHeaderSmall1>
              </div>
            )}
          </Col>
        </WrapperHeader>
        <WrapperLanguages>
          <Popover content={renderLanguages()} trigger="click">
            <Button style={{cursor: 'pointer' , color: '#333'}}>
               {language === 'vi' ? 'VI' : language === 'en' ? 'EN' : ''}
            </Button>
          </Popover>
        </WrapperLanguages>
      </div>
    </div>
  );
};

export default HeaderComponent;
