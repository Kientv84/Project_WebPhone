import React, { useState } from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperLabelDay,
  WrapperLabelOrderDetail,
  WrapperLabelOrderNumber,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
  WrapperStyleHeader,
  WrapperStyleHeaderDelivery,
} from "./style";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "react-query";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Steps } from "antd";
import "./DetailsOrderPage.css";
import * as PromotionService from "../../services/PromotionService";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    console.log("object", res);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders-details", id], queryFn: fetchDetailsOrder },
    {
      enabled: Boolean(id),
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );
  const { isLoading, data } = queryOrder;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await PromotionService.getAllPromotion(); // Giả sử PromotionService có hàm lấy danh sách khuyến mãi
        setPromotions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch promotions", error);
      }
    };

    fetchPromotions();
  }, []);

  const calculatePromotionDiscount = (orderItems, promotions) => {
    let discountTotal = 0;
    let extraDiscountTotal = 0;
    console.log("Promotions:", promotions);
    console.log("Order Items:", orderItems);

    // Lấy tháng và năm hiện tại
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Group items by brand và tính tổng số lượng sản phẩm từ cùng một thương hiệu
    const itemsByBrand = {};
    orderItems.forEach((item) => {
      if (!itemsByBrand[item.branch]) {
        itemsByBrand[item.branch] = { items: [], totalQuantity: 0 };
      }
      itemsByBrand[item.branch].items.push(item);
      itemsByBrand[item.branch].totalQuantity += item.amount;
    });

    // Điều kiện 1: Giảm giá số tiền cố định khi mua tối thiểu 2 sản phẩm từ cùng một brand
    for (const [brand, { items, totalQuantity }] of Object.entries(
      itemsByBrand
    )) {
      const brandPromotion = promotions.find(
        (promo) =>
          promo.branch === brand &&
          promo.minimumQuantity <= totalQuantity &&
          promo.discountAmount &&
          promo.month === currentMonth &&
          promo.year === currentYear
      );
      if (brandPromotion) {
        const discountAmount = brandPromotion.discountAmount;
        extraDiscountTotal += discountAmount;
      }
    }

    // Kiểm tra các điều kiện khuyến mãi khác
    orderItems.forEach((item) => {
      let itemDiscount = 0;

      // Điều kiện 2: Nếu sản phẩm là sản phẩm kích hoạt, giảm giá cho bundle product
      const triggerPromotion = promotions.find(
        (promo) =>
          promo.triggerProduct?._id?.toString() === item.product.toString() &&
          promo.month === currentMonth &&
          promo.year === currentYear
      );
      if (triggerPromotion && item.amount >= 1) {
        const bundleProductItem = orderItems.find(
          (bundleItem) =>
            bundleItem.product.toString() ===
            triggerPromotion.bundleProduct?.productId._id.toString()
        );

        if (bundleProductItem) {
          const discountAmount =
            triggerPromotion.bundleProduct.discountPrice *
            bundleProductItem.amount;
          extraDiscountTotal += discountAmount;
        }
      }

      // Điều kiện 3: Thêm sản phẩm bundle với giá giảm khi mua sản phẩm từ brand đó
      const brandBundlePromotion = promotions.find(
        (promo) =>
          promo.branch === item.branch &&
          promo.bundleProduct &&
          promo.month === currentMonth &&
          promo.year === currentYear
      );
      if (brandBundlePromotion) {
        const bundleProductItem = orderItems.find(
          (bundleItem) =>
            bundleItem.product.toString() ===
            brandBundlePromotion.bundleProduct?.productId._id.toString()
        );

        if (bundleProductItem) {
          const bundleDiscountAmount =
            brandBundlePromotion.bundleProduct.discountPrice *
            bundleProductItem.amount;
          extraDiscountTotal += bundleDiscountAmount;
        }
      }

      // Điều kiện bổ sung: Tính giảm giá từ `item.discount` nếu có và không bị bỏ qua
      if (!item.skipDiscount) {
        const productDiscount = item.discount ? item.discount : 0;
        const discountFromItemDiscount =
          item.price * (productDiscount / 100) * item.amount;
        itemDiscount += discountFromItemDiscount;
      }

      discountTotal += itemDiscount;
    });

    console.log("Extra Discount Total:", extraDiscountTotal); // Thêm log kiểm tra
    return { discountTotal, extraDiscountTotal };
  };

  const order = useSelector((state) => state.order);

  const { discountTotal, extraDiscountTotal } = useMemo(() => {
    const result = calculatePromotionDiscount(
      data?.orderItems || [],
      promotions
    );
    console.log("Discounts:", result); // Kiểm tra kết quả tính toán
    return result;
  }, [data, promotions]);

  useEffect(() => {
    if (!isLoading) {
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [isLoading, id]);

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  const user = useSelector((state) => state.user);

  // Cập nhật hàm currentStep
  const currentStep = () => {
    if (!data || !data.isDelivered) {
      return 0; // Mặc định là bước 0 nếu dữ liệu không có
    }

    switch (data?.isDelivered) {
      case "cancelled":
        return 0;
      case "successful order":
        return 0;
      case "pending":
        return 1;
      case "sended":
        return 2;
      case "shipping":
        return 3;
      case "delivery success":
        return 4;
      case "delivery fail":
        return 4;
      default:
        return 0;
    }
  };

  const formatTimestamp = (date) => {
    return date
      ? `${new Date(date).toLocaleDateString("en-GB")} ${new Date(
          date
        ).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "";
  };

  const itemsDelivery = [
    {
      title: t("ORDER.SUCCESSFULL_ORDER"),
      status: currentStep() >= 0 ? "finish" : "wait",
      description: formatTimestamp(data?.createdAt),
    },
    {
      title: t("ORDER.PENDING"),
      status: currentStep() >= 1 ? "finish" : "wait",
      description: formatTimestamp(data?.pendingAt),
    },
    {
      title: t("ORDER.SENDED"),
      status: currentStep() >= 2 ? "finish" : "wait",
      description: formatTimestamp(data?.sendedAt),
    },
    {
      title: t("ORDER.SHIPPING"),
      status: currentStep() >= 3 ? "finish" : "wait",
      description: formatTimestamp(data?.shippingAt),
    },
    {
      title:
        data?.isDelivered === "delivery success"
          ? t("ORDER.DELIVERY_SUCCESS")
          : data?.isDelivered === "delivery fail"
          ? t("ORDER.DELIVERY_FAIL")
          : t("ORDER.PROCESSING"),
      status:
        data?.isDelivered === "delivery fail"
          ? "error" // Set trạng thái "error" nếu giao hàng thất bại
          : data?.isDelivered === "delivery success"
          ? "finish" // Set trạng thái "finish" nếu giao hàng thành công
          : "wait",
      description:
        data?.isDelivered === "delivery success"
          ? formatTimestamp(data?.deliverySuccessAt) // Sử dụng deliverySuccessAt
          : data?.isDelivered === "delivery fail"
          ? formatTimestamp(data?.deliveryFailAt) // Sử dụng deliveryFailAt
          : "",
    },
  ];

  return (
    <Loading isLoading={isLoading}>
      <div style={{ width: "100%", background: "#f5f5fa" }}>
        <div
          style={{
            width: "1270px",
            margin: "60px auto 0",
            height: "1270px",
            padding: "0.1px 0px",
          }}
        >
          <div
            style={{
              fontWeight: "normal",
              marginTop: "5px",
              fontSize: "15px",
              marginTop: "20px",
            }}
          >
            {" "}
            <span
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#707070",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              {t("MY_ODER.BACK_HOMEPAGE")}
            </span>{" "}
            <svg
              style={{
                margin: "0 10px 0 6px",
                width: "14px",
                color: "#707070",
                height: "14px",
                verticalAlign: "middle",
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
              ></path>
            </svg>
            <span
              style={{
                cursor: "pointer",
                fontSize: "14px", // Kích thước chữ
                fontWeight: "bold", // Kiểu chữ đậm
                color: "#707070", // Màu chữ (ví dụ: đỏ cam)
              }}
              onClick={() => {
                navigate("/my-order", {
                  state: {
                    id: user?.id,
                    token: user?.access_token,
                  },
                });
              }}
            >
              {t("MY_ODER.TITLE")}
            </span>{" "}
            <svg
              style={{
                margin: "0 10px 0 6px",
                width: "14px",
                color: "#707070",
                height: "14px",
                verticalAlign: "middle",
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
              ></path>
            </svg>
            <span
              style={{
                fontSize: "14px", // Kích thước chữ
                fontWeight: "bold", // Kiểu chữ đậm
                color: "#707070", // Màu chữ (ví dụ: đỏ cam)
              }}
            >
              {t("ORDER_DETAIL.TITLE")}
            </span>
          </div>

          <div style={{ marginTop: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex" }}>
                <WrapperLabelOrderDetail style={{ fontWeight: "400" }}>
                  {t("ORDER_DETAIL.ORDER_NUMBER")}
                </WrapperLabelOrderDetail>
                <WrapperLabelOrderNumber>
                  {data?.orderNumber}
                </WrapperLabelOrderNumber>
              </div>
              <div style={{ display: "flex" }}>
                <WrapperLabelDay
                  style={{
                    fontWeight: "600",
                    marginRight: "5px",
                  }}
                >
                  {t("ORDER_DETAIL.ORDER_CREATED_AT")}
                </WrapperLabelDay>
                <span>
                  {new Date(data?.createdAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>

            <WrapperLabel style={{ fontWeight: "600" }}>
              {t("ORDER_DETAIL.SHIPPING_STATUS")}
            </WrapperLabel>

            {data?.isDelivered === "cancelled" ? (
              <div className="cancelled-container">
                <div className="cancelled-text">{t("ORDER.CANCELLED")}</div>
                <div className="cancelled-time">{`${t(
                  "ORDER.IN"
                )} ${formatTimestamp(data?.cancelledAt)}`}</div>
              </div>
            ) : (
              <WrapperStyleHeaderDelivery>
                <Steps current={currentStep()} items={itemsDelivery} />
              </WrapperStyleHeaderDelivery>
            )}
          </div>
          <div></div>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>{t("ORDER_DETAIL.RECEPTION_ADDRESS")}</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>{t("ORDER_DETAIL.ADDRESS")} </span>{" "}
                  {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>{t("ORDER_DETAIL.PHONE_NUMBER")} </span>{" "}
                  {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>{t("ORDER_DETAIL.SHIPPING_METHOD")}</WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span className="name-delivery">{data?.typeofdelivery}</span>{" "}
                  {t("ORDER_DETAIL.FAST")}
                </div>

                <div className="delivery-fee">
                  <span>{t("ORDER_DETAIL.SHIPPING_COST")} </span>{" "}
                  {convertPrice(data?.shippingPrice)}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>{t("ORDER_DETAIL.PAYMENT_METHOD")}</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderConstant.payment[data?.paymentMethod]}
                </div>
                <div className="status-payment">
                  {data?.isPaid
                    ? t("ORDER_DETAIL.PAID")
                    : t("ORDER_DETAIL.UNPAID")}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>

          <WrapperStyleContent>
            <WrapperStyleHeader
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ width: "670px", fontWeight: "bold" }}>
                {t("ORDER_DETAIL.PRODUCT")}
              </div>
              <WrapperItemLabel>{t("ORDER_DETAIL.PRICE")}</WrapperItemLabel>
              <WrapperItemLabel>{t("ORDER_DETAIL.QUANTITY")}</WrapperItemLabel>
              <WrapperItemLabel>{t("ORDER_DETAIL.DISCOUNT")}</WrapperItemLabel>
            </WrapperStyleHeader>
            {data?.orderItems?.map((order) => {
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
                    <img
                      src={order?.image}
                      alt={""}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        border: "1px solid rgb(238, 238, 238)",
                        padding: "2px",
                      }}
                    />
                    <div
                      style={{
                        width: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                        height: "70px",
                      }}
                    >
                      {order?.name}
                    </div>
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>
                    {order?.discount
                      ? convertPrice((priceMemo * order?.discount) / 100)
                      : "0 VND"}
                  </WrapperItem>
                </WrapperProduct>
              );
            })}

            <WrapperAllPrice>
              <WrapperItemLabel>{t("ORDER_DETAIL.SUBTOTAL")}</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            {extraDiscountTotal > 0 && (
              <WrapperAllPrice>
                <WrapperItemLabel>{t("ORDER.EXTRA_DISCOUNT")}</WrapperItemLabel>
                <WrapperItem>{convertPrice(extraDiscountTotal)}</WrapperItem>
              </WrapperAllPrice>
            )}
            <WrapperAllPrice>
              <WrapperItemLabel>
                {t("ORDER_DETAIL.SHIPPING_COST")}
              </WrapperItemLabel>
              <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>{t("ORDER_DETAIL.TOTAL")}</WrapperItemLabel>
              <WrapperItem>
                <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
              </WrapperItem>
            </WrapperAllPrice>
          </WrapperStyleContent>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
