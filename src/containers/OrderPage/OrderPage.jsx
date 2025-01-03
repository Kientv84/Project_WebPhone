import { Form } from "antd";
import React, { useEffect, useState } from "react";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperInfo1,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDelivery,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slice/orderSlide";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slice/userslide";
import { useLocation, useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import { useTranslation } from "react-i18next";
import * as PromotionService from "../../services/PromotionService";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const { t } = useTranslation();

  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [promotions, setPromotions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn về đầu trang
  }, [location]);

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    // console.log('first', order.countInStock)
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked =
        order?.orderItems?.map((item) => item?.product).filter(Boolean) || [];
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

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

  const { discountTotal, extraDiscountTotal } = useMemo(() => {
    return calculatePromotionDiscount(
      order?.orderItemsSelected || [],
      promotions
    );
  }, [order, promotions]);

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

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

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const handleAddCard = () => {
    // console.log('orderr', order)
    if (!order?.orderItemsSelected?.length) {
      message.error(t("ORDER.TOAST_CHOOSE"));
    } else if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isLoading } = mutationUpdate;

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

  const itemsDelivery = [
    {
      title: "30.000 VND",
      description: t("ORDER.DELIVERRED_DES1"),
    },
    {
      title: "10.000 VND",
      description: t("ORDER.DELIVERRED_DES2"),
    },
    {
      title: t("ORDER.FREESHIP"),
      description: t("ORDER.DELIVERRED_DES3"),
    },
  ];

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
      <div
        style={{
          width: "1270px",
          margin: "0 auto",
          height: "100%",
          paddingBottom: "100px",
        }}
      >
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
              fontSize: "14px", // Kích thước chữ
              fontWeight: "bold", // Kiểu chữ đậm
              color: "#707070", // Màu chữ (ví dụ: đỏ cam)
            }}
          >
            {t("ORDER.CART")}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <h4>{t("ORDER.DELIVERY_FEE")}</h4>
            <WrapperStyleHeaderDelivery>
              <StepComponent
                items={itemsDelivery}
                current={
                  deliveryPriceMemo === 30000
                    ? 1
                    : deliveryPriceMemo === 10000
                    ? 2
                    : order.orderItemsSelected.length === 0
                    ? 0
                    : 3
                }
              />
            </WrapperStyleHeaderDelivery>

            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></CustomCheckbox>
                <span>
                  {" "}
                  {t("ORDER.TOTAL")} ({order?.orderItems?.length}{" "}
                  {t("ORDER.PRODUCT")})
                </span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{t("ORDER.PRICE")}</span>
                <span>{t("ORDER.QUANTITY")}</span>
                <span>{t("ORDER.SUBTOTAL")}</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CustomCheckbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></CustomCheckbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {convertPrice(order?.price)}
                        </span>
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "decrease",
                              order?.product,
                              order?.countInStock === 1
                            )
                          }
                          disabled={order?.amount === 1}
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInStock}
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
                              order?.product,
                              order?.amount === order?.countInStock
                            )
                          }
                          disabled={order?.amount === order?.countInStock}
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>

          <WrapperRight>
            <div style={{ width: "100%", marginTop: "55px" }}>
              <WrapperInfo1>
                <div>
                  <span>{t("ORDER.ADDRESS")}: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address} ${user?.city}`}{" "}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "#9255FD", cursor: "pointer" }}
                  >
                    {t("ORDER.CHANGE")}
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
                  <span>{t("ORDER.SUBTOTAL")}</span>
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
                  <span>{t("ORDER.DISCOUNT")}</span>
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
                    <span>{t("ORDER.EXTRA_DISCOUNT")}</span>
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
                  <span>{t("ORDER.DELIVERY_FEE")}</span>
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
                <span>{t("ORDER.TOTAL_TO_PAY")}</span>
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
                    {t("ORDER.VAT")}
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              textbutton={t("ORDER.BUY_BTN")}
              styletextbutton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title={t("ORDER.UPDATE_INFOR")}
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
        styles={{ body: { padding: "24px" } }}
        centered
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
              label={t("ORDER.NAME_CHANGE")}
              name="name"
              rules={[{ required: true, message: t("ORDER.NAME_MESSAGE") }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label={t("ORDER.CITY_CHANGE")}
              name="city"
              rules={[{ required: true, message: t("ORDER.CITY_MESSAGE") }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label={t("ORDER.PHONE_CHANGE")}
              name="phone"
              rules={[{ required: true, message: t("ORDER.PHONE_MESSAGE") }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label={t("ORDER.ADDRESS")}
              name="address"
              rules={[{ required: true, message: t("ORDER.MESSAGE") }]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
