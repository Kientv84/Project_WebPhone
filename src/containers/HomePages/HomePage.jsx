import React, { useEffect } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import BranchProduct from "../../components/BranchProduct/BranchProduct";
import {
  WrapperButtonMore,
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperProducts,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
  WrapperTextHeaderSmall1,
  WrapperTypeProduct,
  WrapperBranchProduct,
} from "./style";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "react-query";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { setOrderItems } from "../../redux/slice/orderSlide";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slice/userslide";
import { resetOrder1 } from "../../redux/slice/orderSlide";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Badge, Col, Popover } from "antd";
import ButtonInputSearch from "../../components/ButtonInputSearch/ButtonInputSearch";
import "./HomePage.css";
import { convertPrice } from "../../utils";

const HomePage = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);
  const [branchProducts, setBranchProducts] = useState([]);

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

  const fetchAllBranchProduct = async () => {
    const res = await ProductService.getAllBranchProduct();
    if (res?.status === "OK") setBranchProducts(res?.data);
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
  useEffect(() => {
    fetchAllTypeProduct();
    fetchAllBranchProduct();
  }, []);

  // header
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const order = useSelector((state) => state.order);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    dispatch(resetOrder1());
    localStorage.removeItem("access_token");
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

  // Hiển thị dropdown khi input được focus
  const handleFocus = () => {
    setShowDropdown(true);
  };
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200); // Thêm delay để người dùng có thể chọn item
  };

  const onSearch = (searchTerm) => {
    setSearch(searchTerm);
  };

  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`);
  };

  return (
    <div>
      <div
        className="header"
        style={{
          width: "100%",
          background: "#42C8B7",
          display: "flex",
          justifyContent: "center",
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
              <div onClick={handleCartClick} style={{ cursor: "pointer" }}>
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
      <Loading isLoading={isLoading || loading}>
        <div
          className="body"
          style={{ width: "100%", backgroundColor: "#efefef" }}
        >
          <div
            className="type-product"
            style={{
              display: "flex",
              width: "1270px",
              margin: "60px auto 0",
              gap: "20px",
            }}
          >
            <div style={{ flex: "2", marginTop: "20px" }}>
              <WrapperTypeProduct>
                {typeProducts.map((item) => {
                  return <TypeProduct name={item} key={item} />;
                })}
              </WrapperTypeProduct>
            </div>
            <div
              className="slider"
              style={{ flex: "1", maxWidth: "100%", marginTop: "20px" }}
            >
              <SliderComponent arrImages={[slider1, slider2, slider3]} />
            </div>
          </div>
          <div
            className="branch-product"
            style={{ width: "1270px", margin: "10px auto" }}
          >
            <WrapperBranchProduct>
              {branchProducts.map((item) => {
                return <BranchProduct name={item} key={item} />;
              })}
            </WrapperBranchProduct>
          </div>
          <div
            id="container"
            style={{ height: "auto", width: "1270px", margin: "0 auto" }}
          >
            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    sold={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProducts>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <WrapperButtonMore
                textbutton={isPreviousData ? "Loading.." : "Load more"}
                type="outline"
                styleButton={{
                  border: "1px solid rgb(10, 104, 255)",
                  color: `${
                    products?.totalProduct === products?.data?.length
                      ? "#ccc"
                      : "rgb(10, 104, 255)"
                  }`,
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                disabled={
                  products?.totalProduct === products?.data?.length ||
                  products?.totalPage === 1
                }
                styletextbutton={{
                  fontWeight: 500,
                  color:
                    products?.totalProduct === products?.data?.length && "#fff",
                }}
                onClick={() => setLimit((prev) => prev + 6)}
              />
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default HomePage;
