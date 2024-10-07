import { Col, Row, Image, Rate, Form } from "antd";
import React, { useEffect, useState } from "react";
import {
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleNameProduct,
  WrapperStyleImageSmall,
  WrapperStyleTextSell,
  WrapperDecriptionTextProduct,
  Box,
  PromotionHeader,
  IconGift,
  BoxDecriptionContent,
  PromotionHeaderDecription,
} from "./style";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slice/orderSlide";
import { convertPrice, initFacebookSDK } from "../../utils";
import * as message from "../../components/Message/Message";
import { resetOrder } from "../../redux/slice/orderSlide.js";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent.jsx";
import CommentComponent from "../CommentComponent/CommentComponent.jsx";
import "./ProductDetailsComponent.css";
import { useMutationHook } from "../../hooks/useMutationHook.js";
import * as UserService from "../../services/UserService";
import { updateAddress } from "../../redux/slice/userslide";
import InputComponent from "../InputComponent/InputComponent.jsx";
import addToCart from "../../assets/images/art-to-carts.png";
import { useTranslation } from "react-i18next";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [ErrorLimitOrder, setErrorLimitOrder] = useState(false);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const { t } = useTranslation();

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // const handleChangeAddress = () => {
  //   setIsOpenModalUpdateInfo(true);
  // };

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  useEffect(() => {
    initFacebookSDK();
  }, []);

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
      message.success(t('PRODUCT_DETAILS.MESSAGE_SUCCESS'));
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSuccessOrder, dispatch]);

  const handleChangeCount = (type, limit) => {
    if (type === "increase") {
      if (!limit && numProduct < productDetails.countInStock) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limit && numProduct > 1) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const { isLoading, data: productDetails } = useQuery(
    ["product-details", idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  );

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails._id
      );
      if (
        orderRedux?.amount + numProduct <= productDetails.countInStock ||
        (!orderRedux && productDetails.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
            },
          })
        );
        localStorage.setItem("cartItems", JSON.stringify(order?.orderItems));

        // Use setTimeout to check localStorage after a short delay
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const handleBuyOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails._id
      );
      if (
        orderRedux?.amount + numProduct <= productDetails.countInStock ||
        (!orderRedux && productDetails.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
            },
          })
        );
        localStorage.setItem("cartItems", JSON.stringify(order?.orderItems));
        navigate("/order");
        // Use setTimeout to check localStorage after a short delay
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  // const { isLoading1, data } = mutationUpdate;

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInfoUser = () => {
    // console.log('stateUserDetails', stateUserDetails)
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateAddress({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleThumbnailClick = (Image) => {
    // Ngược lại, thực hiện chức năng thay đổi ảnh và làm gì đó khác (nếu cần)
    setSelectedImage(Image);
  };

  const productDetailss = productDetails?.image;
  useEffect(() => {
    // Set initial image
    setSelectedImage(productDetailss);
  }, [productDetailss]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Row
          style={{ padding: "25px", background: "#fff", borderRadius: "4px" }}
        >
          <Col
            span={10}
            style={{
              borderRight: "1px solid #e5e5e5",
              paddingRight: "5px",
              paddingLeft: "inherit",
            }}
          >
            <Image
              src={selectedImage}
              alt="image product"
              preview={false}
              style={{
                width: "400px",
                height: "400px",
                // maxHeight: "400px",
                marginLeft: "50px",
                marginTop: "30px",
                objectFit: "cover",
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                overflow: "hidden",
              }}
            />
            <Row
              style={{
                paddingTop: "10px",
                marginLeft: "100px",
                cursor: "pointer",
              }}
            >
              <WrapperStyleColImage
                span={4}
                style={{
                  marginRight: "15px",
                  border: "1px solid rgb(66, 200, 183)",
                }}
              >
                <WrapperStyleImageSmall
                  src={productDetails?.image}
                  alt="image small"
                  preview={false}
                  onClick={() => handleThumbnailClick(productDetails?.image)}
                  style={{ height: "64px", width: "64px" }}
                />
              </WrapperStyleColImage>
              <WrapperStyleColImage
                span={4}
                style={{
                  marginRight: "15px",
                  border: "1px solid rgb(66, 200, 183)",
                }}
              >
                <WrapperStyleImageSmall
                  src={productDetails?.image1}
                  alt="image small"
                  preview={false}
                  onClick={() => handleThumbnailClick(productDetails?.image1)}
                  style={{ height: "64px", width: "64px" }}
                />
              </WrapperStyleColImage>
              <WrapperStyleColImage
                span={4}
                style={{ border: "1px solid rgb(66, 200, 183)" }}
              >
                <WrapperStyleImageSmall
                  src={productDetails?.image2}
                  alt="image small"
                  preview={false}
                  onClick={() => handleThumbnailClick(productDetails?.image2)}
                  style={{ height: "64px", width: "64px" }}
                />
              </WrapperStyleColImage>
            </Row>
            <BoxDecriptionContent
              style={{
                margin: "10px 0 20px",
                padding: "10px 0",
                marginTop: "80px",
              }}
            >
              <PromotionHeaderDecription
                style={{
                  marginBottom: "5px",
                  fontSize: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {t('PRODUCT_DETAILS.DESCRIPTION')}
              </PromotionHeaderDecription>
              <WrapperDecriptionTextProduct>
                {productDetails?.description}
              </WrapperDecriptionTextProduct>
            </BoxDecriptionContent>
          </Col>

          <Col span={14} style={{ paddingLeft: " 90px" }}>
            <WrapperStyleNameProduct>
              {" "}
              {productDetails?.name}{" "}
            </WrapperStyleNameProduct>
            {/* <StarFilled style={{ fontSize:'16px', color: '#FFC400' }} /><StarFilled/> */}
            <div>
              <Rate
                allowHalf
                defaultValue={productDetails?.rating}
                value={productDetails?.rating}
              />
              <WrapperStyleTextSell>
                {" "}
                | {t('PRODUCT_DETAILS.STAR')} {productDetails?.selled}
              </WrapperStyleTextSell>
            </div>
            <WrapperPriceProduct>
              <WrapperPriceTextProduct>
                {convertPrice(productDetails?.price)}
              </WrapperPriceTextProduct>
            </WrapperPriceProduct>
            <LikeButtonComponent
              datahref={
                process.env.REACT_APP_IS_LOCAL
                  ? "https://developers.facebook.com/docs/plugins/"
                  : window.location.href
              }
            />
            <Box>
              <PromotionHeader
                style={{ display: "flex", alignItems: "center" }}
              >
                <IconGift style={{ marginLeft: "10px", fill: "#fff" }}>
                  <svg
                    height="15"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M152 0H154.2C186.1 0 215.7 16.91 231.9 44.45L256 85.46L280.1 44.45C296.3 16.91 325.9 0 357.8 0H360C408.6 0 448 39.4 448 88C448 102.4 444.5 115.1 438.4 128H480C497.7 128 512 142.3 512 160V224C512 241.7 497.7 256 480 256H32C14.33 256 0 241.7 0 224V160C0 142.3 14.33 128 32 128H73.6C67.46 115.1 64 102.4 64 88C64 39.4 103.4 0 152 0zM190.5 68.78C182.9 55.91 169.1 48 154.2 48H152C129.9 48 112 65.91 112 88C112 110.1 129.9 128 152 128H225.3L190.5 68.78zM360 48H357.8C342.9 48 329.1 55.91 321.5 68.78L286.7 128H360C382.1 128 400 110.1 400 88C400 65.91 382.1 48 360 48V48zM32 288H224V512H80C53.49 512 32 490.5 32 464V288zM288 512V288H480V464C480 490.5 458.5 512 432 512H288z"></path>
                  </svg>
                </IconGift>
                <div
                  style={{
                    margin: "10px 0 20px",
                    padding: "10px 0",
                    display: "block",
                    marginBlockStart: "1em",
                    marginBlockEnd: "1em",
                    marginInlineStart: "0px",
                    marginInlineEnd: "0px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#fff",
                      marginLeft: "-10px",
                    }}
                  >
                    {t('PRODUCT_DETAILS.PROMOTION')}
                  </div>
                </div>
              </PromotionHeader>
              <WrapperDecriptionTextProduct>
                {productDetails?.promotion}
              </WrapperDecriptionTextProduct>
            </Box>

            <div
              style={{
                margin: "10px 0 20px",
                padding: "10px 0",
                borderTop: "1px solid #e5e5e5",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              <div style={{ marginBottom: "10px" }}>{t('PRODUCT_DETAILS.QUANTITY')}</div>
              <WrapperQualityProduct>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleChangeCount("decrease", numProduct === 1)
                  }
                >
                  <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
                <WrapperInputNumber
                  onChange={onChange}
                  defaultValue={1}
                  value={numProduct}
                  size="middle"
                />
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleChangeCount(
                      "increase",
                      numProduct === productDetails.countInStock
                    )
                  }
                >
                  <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
                </button>
              </WrapperQualityProduct>
            </div>

            <div className="container-buttons">
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "rgba(13, 129, 115, 0.82)",
                  height: "60px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                  pointerEvents: ErrorLimitOrder ? "none" : "auto",
                  opacity: ErrorLimitOrder ? 0.5 : 1,
                }}
                onClick={handleBuyOrderProduct}
                textbutton={t('PRODUCT_DETAILS.PURCHASE')}
                styletextbutton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
              <button
                className="btn-add-to-cart"
                onClick={handleAddOrderProduct}
                style={{
                  pointerEvents: ErrorLimitOrder ? "none" : "auto",
                  opacity: ErrorLimitOrder ? 0.5 : 1,
                }}
              >
                <img src={addToCart} alt="cart-icon" />
                <span>{t('PRODUCT_DETAILS.ADD_CART')}</span>
              </button>
            </div>
            {ErrorLimitOrder && (
              <span
                style={{
                  color: "red",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {t('PRODUCT_DETAILS.SOLD_OUT')}
              </span>
            )}
          </Col>

          <CommentComponent
            datahref={
              process.env.REACT_APP_IS_LOCAL
                ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                : window.location.href
            }
            width="1234"
          />
        </Row>
      </Loading>
    </div>
  );
};

export default ProductDetailsComponent;
