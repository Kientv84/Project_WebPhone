import React, { useEffect, useState } from "react";
import { Badge, Col, Popover } from "antd";
import {
  WrapperHeaderAccount,
  WrapperHeader,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
  WrapperContentPopup,
  WrapperTextHeaderSmall1,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "..//ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
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

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
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

  const handleNavigateLogin = () => {
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
    setLoading(false);
    navigate("/");
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
        My Information
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Management
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>
        My Order
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Log Out
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
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
    if (!user?.id) {
      navigate("/sign-in");
    } else {
      navigate("/order");
    }
  };

  const handleOnChangeInput = (event) => {
    setSearch(event.target.value);
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

  return (
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
        <Col span={5}>
          <WrapperTextHeader to="/"> WEBPHONE </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13} style={{ position: "relative" }}>
            <ButtonInputSearch
              size="large"
              placeholder="What do you need to find?"
              textbutton="Search"
              onChange={handleOnChangeInput}
            />
            <div className="dropdown">
              {products?.data?.filter((product) => {
                const searchTerm = search.toLowerCase();
                const fullName = product.name.toLowerCase();
                return (
                  searchTerm &&
                  fullName.includes(searchTerm) &&
                  fullName !== searchTerm
                );
              }).length > 0 && <p className="title-box">Product suggests</p>}

              {products?.data
                ?.filter((product) => {
                  const searchTerm = search.toLowerCase();
                  const fullName = product.name.toLowerCase();
                  return (
                    searchTerm &&
                    fullName.includes(searchTerm) &&
                    fullName !== searchTerm
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
                    Sign-In/ Sign-Up
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Account</WrapperTextHeaderSmall>
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
              <WrapperTextHeaderSmall1>Cart</WrapperTextHeaderSmall1>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponent;
