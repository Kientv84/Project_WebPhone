import { Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import {
  Label,
  WrapperInfo,
  WrapperInfo1,
  WrapperInfo2,
  WrapperInfo3,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
} from "./style";

import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import ModalQRcode from "../../components/ModalQRcode/ModalQRcode";
import InputComponent from "../../components/InputComponent/InputComponent";
import { removeAllOrderProduct } from "../../redux/slice/orderSlide";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slice/userslide";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../../services/PaymentService";
import { useTranslation } from "react-i18next";
import * as PromotionService from "../../services/PromotionService";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [paymentInterval, setPaymentInterval] = useState(null); // Thêm trạng thái để lưu ID của interval

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [paymentbyQRCode, setPaymentbyQRCode] = useState("qr_code");

  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [promotions, setPromotions] = useState([]);

  const { t } = useTranslation();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [isOpenModalQRcode, setIsOpenModalQRcode] = useState(false);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

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

    // Gộp Điều kiện 1 và Điều kiện 3: Giảm giá cố định và bundle sản phẩm cho cùng một thương hiệu
    for (const [brand, { items, totalQuantity }] of Object.entries(
      itemsByBrand
    )) {
      const brandPromotion = promotions.find(
        (promo) =>
          promo.branch === brand &&
          promo.minimumQuantity <= totalQuantity &&
          promo.month === currentMonth &&
          promo.year === currentYear
      );

      // Kiểm tra và áp dụng giảm giá cố định khi mua tối thiểu 2 sản phẩm từ cùng một brand
      if (brandPromotion) {
        const discountAmount = brandPromotion.discountAmount;
        if (discountAmount) {
          extraDiscountTotal += discountAmount;
        }

        // Kiểm tra các sản phẩm bundle của thương hiệu đó
        if (Array.isArray(brandPromotion.bundleProduct)) {
          const totalBundleItems = brandPromotion.bundleProduct.length;
          if (totalBundleItems >= 2) {
            let appliedDiscount = false;
            brandPromotion.bundleProduct.forEach((bundle) => {
              const bundleProductItem = orderItems.find(
                (bundleItem) =>
                  bundleItem.product.toString() ===
                  bundle.productId._id.toString()
              );
              if (bundleProductItem && !appliedDiscount) {
                const discountAmount = bundle.discountPrice;
                extraDiscountTotal += discountAmount;
                appliedDiscount = true;
              }
            });
          } else {
            brandPromotion.bundleProduct.forEach((bundle) => {
              const bundleProductItem = orderItems.find(
                (bundleItem) =>
                  bundleItem.product.toString() ===
                  bundle.productId._id.toString()
              );
              if (bundleProductItem) {
                const discountAmount =
                  bundle.discountPrice * bundleProductItem.amount;
                extraDiscountTotal += discountAmount;
              }
            });
          }
        } else if (brandPromotion.bundleProduct) {
          const bundleProductItem = orderItems.find(
            (bundleItem) =>
              bundleItem.product.toString() ===
              brandPromotion.bundleProduct.productId._id.toString()
          );
          if (bundleProductItem) {
            const discountAmount =
              brandPromotion.bundleProduct.discountPrice *
              bundleProductItem.amount;
            extraDiscountTotal += discountAmount;
          }
        }
      }
    }

    // Kiểm tra các điều kiện khuyến mãi khác
    orderItems.forEach((item) => {
      let itemDiscount = 0;

      // Điều kiện 2 và 4: Nếu sản phẩm là sản phẩm kích hoạt, giảm giá cho bundle product
      const triggerPromotion = promotions.find(
        (promo) =>
          promo.triggerProduct?._id?.toString() === item.product.toString() &&
          promo.month === currentMonth &&
          promo.year === currentYear
      );
      if (triggerPromotion && item.amount >= 1) {
        // Điều kiện khi mua 1 sản phẩm triggerProduct thì sẽ được giảm thêm cho các sản phẩm bundleProduct
        if (Array.isArray(triggerPromotion.bundleProduct)) {
          // Kiểm tra nếu có bundleProduct (dạng mảng)
          const totalBundleItems = triggerPromotion.bundleProduct.length;
          if (totalBundleItems >= 2) {
            // Nếu bundle có từ 2 sản phẩm trở lên, giảm giá cho toàn bộ bundle 1 lần duy nhất
            let appliedDiscount = false;
            triggerPromotion.bundleProduct.forEach((bundle) => {
              const bundleProductItem = orderItems.find(
                (bundleItem) =>
                  bundleItem.product.toString() ===
                  bundle.productId._id.toString()
              );
              if (bundleProductItem && !appliedDiscount) {
                // Tính giảm giá cho toàn bộ bundle (chỉ tính 1 lần cho tất cả sản phẩm trong bundle)
                const discountAmount = bundle.discountPrice; // Chỉ lấy giá giảm của bundle một lần
                extraDiscountTotal += discountAmount;
                appliedDiscount = true; // Đảm bảo chỉ tính giảm giá 1 lần cho toàn bộ bundle
              }
            });
          } else {
            // Nếu bundle chỉ có một sản phẩm, áp dụng giảm giá cho sản phẩm đó
            triggerPromotion.bundleProduct.forEach((bundle) => {
              const bundleProductItem = orderItems.find(
                (bundleItem) =>
                  bundleItem.product.toString() ===
                  bundle.productId._id.toString()
              );
              if (bundleProductItem) {
                const discountAmount =
                  bundle.discountPrice * bundleProductItem.amount;
                extraDiscountTotal += discountAmount;
              }
            });
          }
        } else if (triggerPromotion.bundleProduct) {
          // Nếu chỉ có một bundleProduct (không phải mảng)
          const bundleProductItem = orderItems.find(
            (bundleItem) =>
              bundleItem.product.toString() ===
              triggerPromotion.bundleProduct.productId._id.toString()
          );
          if (bundleProductItem) {
            const discountAmount =
              triggerPromotion.bundleProduct.discountPrice *
              bundleProductItem.amount;
            extraDiscountTotal += discountAmount;
          }
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

    return { discountTotal, extraDiscountTotal };
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const { discountTotal, extraDiscountTotal } = useMemo(() => {
    return calculatePromotionDiscount(
      order?.orderItemsSelected || [],
      promotions
    );
  }, [order, promotions]);

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 1 && priceMemo < 200000) {
      return 30000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 10000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) -
      Number(discountTotal) -
      Number(extraDiscountTotal) +
      Number(deliveryPriceMemo)
    );
  }, [priceMemo, discountTotal, extraDiscountTotal, deliveryPriceMemo]);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        typeofdelivery: delivery === "fast" ? "GHTK" : "VIETTELPOST",
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const handleQrCodePayment = () => {
    setIsOpenModalQRcode(true); // Mở modal QR code

    let timeLeft = 300; // 15 phút = 900 giây
    const interval = setInterval(async () => {
      if (timeLeft > 0) {
        try {
          // Gọi hàm checkPaid để kiểm tra thanh toán
          const paymentSuccess = await checkPaid(totalPriceMemo, content);

          if (paymentSuccess) {
            clearInterval(interval); // Dừng interval nếu thanh toán thành công
            message.success(t("PAYMENT.PAY_SUCCESS"));

            setIsOpenModalQRcode(false); // Đóng modal sau khi thanh toán thành công

            mutationAddOrder.mutate({
              token: user?.access_token,
              orderItems: order?.orderItemsSelected,
              fullName: user?.name,
              address: user?.address,
              phone: user?.phone,
              city: user?.city,
              paymentMethod: "qr_code",
              typeofdelivery: delivery === "fast" ? "GHTK" : "VIETTELPOST",
              itemsPrice: priceMemo,
              shippingPrice: deliveryPriceMemo,
              totalPrice: totalPriceMemo,
              user: user?.id,
              email: user?.email,
              isPaid: true,
            });
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra thanh toán:", error);
        }

        timeLeft -= 3; // Cập nhật thời gian còn lại (2 giây mỗi lần)
      } else {
        clearInterval(interval); // Hết thời gian, dừng việc kiểm tra
        message.error(t("PAYMENT.PAY_QR_CODE_FAIL"));
        setIsOpenModalQRcode(false); // Đóng modal nếu hết thời gian
      }
    }, 5000); // Kiểm tra mỗi 2 giây
    setPaymentInterval(interval); // Lưu ID interval
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { isLoading, data } = mutationUpdate;
  const {
    data: dataAdd,
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order.orderItemsSelected.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success(t("PAYMENT.ORDER_SUCCESS"));
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error(t("PAYMENT.MESS_ERR_ORDER"));
    }
  }, [isSuccess, isError]);

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
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
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

  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
    setPaymentbyQRCode(e.target.value);
  };

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSelected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      typeofdelivery: delivery === "fast" ? "GHTK" : "VIETTELPOST",
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
  };

  const handleCancel = () => {
    if (paymentInterval) {
      clearInterval(paymentInterval); // Hủy interval nếu nó tồn tại
    }
    setIsOpenModalQRcode(false);
  };

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  useEffect(() => {
    if (order?.orderItemsSelected?.length > 0) {
      let productNames = order?.orderItemsSelected
        ?.map((item) => item.name)
        .join("")
        .replace(/\s+/g, ""); // Xóa tất cả khoảng trắng

      // Hàm loại bỏ dấu
      const removeDiacritics = (str) => {
        return str
          .normalize("NFD") // Phân tách các ký tự có dấu
          .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
          .replace(/-/g, "") // Xóa dấu gạch ngang
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D")
          .replace(/[$\\@\\\#%\^\&\*\(\)\[\]\+\_\{\}\`\~\=\|\[/]/g, ""); // Xóa các ký tự đặc biệt
      };
      productNames = removeDiacritics(productNames);

      if (productNames.length > 35) {
        productNames = productNames.substring(0, 35);
      }

      setContent(productNames);
    }
  }, [order?.orderItemsSelected]);

  async function checkPaid(price, content) {
    try {
      // Fetch dữ liệu từ API
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz9KsEavJS7aClWoTM_3Yte-kNxfsXa8N6O96je2TQ7bDoeJmcSGqLm-_sFdQvYzkusdA/exec"
      );

      const data = await response.json();
      const lastPaid = data.data[data.data.length - 1];
      const lastPrice = lastPaid["Giá trị"];
      const lastContent = lastPaid["Mô tả"];

      console.log("LastContent", lastContent);
      console.log("Content", content);

      console.log("checkContent", lastContent.includes(content));
      console.log("checkPirce", lastPrice >= price);

      if (lastPrice >= price && lastContent.includes(content)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thanh toán:", error);
      return false;
    }
  }

  return (
    <div
      style={{
        padding: "0.1px 0",
        background: "#f5f5fa",
        with: "100%",
        minHeight: "100vh",
        marginTop: "65px",
      }}
    >
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <div
            style={{
              fontWeight: "normal",
              fontSize: "15px",
              paddingTop: "15px",
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
              {t("ORDER.BACK_HOMEPAGE")}
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
                navigate("/order");
              }}
            >
              {t("ORDER.CART")}
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
              {t("PAYMENT.TITLE")}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <WrapperLeft>
              <WrapperInfo2>
                <div>
                  <Label>{t("PAYMENT.CHOOSE_DELIVERED_METHOD")}</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GHTK
                      </span>{" "}
                      {t("PAYMENT.FAST_GO_JECT")}
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        VIETTELPOST
                      </span>{" "}
                      {t("PAYMENT.FAST_GO_JECT")}
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo2>
              <WrapperInfo3>
                <div>
                  <Label>{t("PAYMENT.CHOOSE_PAYMENT_METHOD")}</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">{t("PAYMENT.COD")}</Radio>
                    <Radio value="paypal">{t("PAYMENT.PAYPAL")}</Radio>
                    <Radio value="qr_code">{t("PAYMENT.QR_CODE")}</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo3>
            </WrapperLeft>

            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo1>
                  <div>
                    <span>{t("PAYMENT.ADDRESS")}: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {`${user?.address} ${user?.city}`}{" "}
                    </span>
                    <span
                      onClick={handleChangeAddress}
                      style={{ color: "#9255FD", cursor: "pointer" }}
                    >
                      {t("PAYMENT.CHANGE")}
                    </span>
                  </div>
                </WrapperInfo1>
                <WrapperInfo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{t("PAYMENT.SUBTOTAL")}</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{t("PAYMENT.DISCOUNT")}</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(discountTotal)}
                    </span>
                  </div>
                  {extraDiscountTotal > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{t("PAYMENT.EXTRA_DISCOUNT")}</span>
                      <span
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(extraDiscountTotal)}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{t("PAYMENT.DELIVERY_COST")}</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(deliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>{t("PAYMENT.TOTAL")}</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      {t("PAYMENT.VAT")}
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === "paypal" && sdkReady ? (
                <div style={{ width: "320px" }}>
                  <PayPalButton
                    amount={Math.round(totalPriceMemo / 24000)}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert("Error");
                    }}
                  />
                </div>
              ) : payment === "qr_code" ? (
                <ButtonComponent
                  onClick={() => handleQrCodePayment()} // Hàm xử lý cho thanh toán qua QR Code
                  size={40}
                  styleButton={{
                    background: "rgb(0, 123, 255)", // Màu nền cho QR Code Payment (tuỳ chỉnh)
                    height: "48px",
                    width: "320px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textbutton={t("PAYMENT.PAY_WITH_QR")}
                  styletextbutton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                ></ButtonComponent>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    background: "rgb(255, 57, 69)",
                    height: "48px",
                    width: "320px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textbutton={t("PAYMENT.ORDER_NOW")}
                  styletextbutton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalQRcode
          title={t("PAYMENT.TILE_QR_CODE")}
          open={isOpenModalQRcode}
          amount={totalPriceMemo} // Số tiền là 100,000 VND
          productName={content}
          onCancel={handleCancel}
          onOk={handleCancel}
        >
          <Loading isLoading={isLoading}></Loading>
        </ModalQRcode>

        <ModalComponent
          title={t("PAYMENT.UPDATE_SHIPPING_ADDRESS")}
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInfoUser}
          styles={{ body: { padding: "24px" } }}
          width={800}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label={t("PAYMENT.NAME")}
                name="name"
                rules={[
                  { required: true, message: t("PAYMENT.PLACEHOODER_NAME") },
                ]}
              >
                <InputComponent
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label={t("PAYMENT.CITY")}
                name="city"
                rules={[
                  { required: true, message: t("PAYMENT.PLACEHOODER_CITY") },
                ]}
              >
                <InputComponent
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                label={t("PAYMENT.PHONE")}
                name="phone"
                rules={[
                  { required: true, message: t("PAYMENT.PLACEHOODER_PHONE") },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label={t("PAYMENT.ADDRESS")}
                name="address"
                rules={[
                  { required: true, message: t("PAYMENT.PLACEHOODER_ADDRESS") },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  MESS_PLS
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default PaymentPage;
