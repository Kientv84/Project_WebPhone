import React from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
  WrapperStyleHeader,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "react-query";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useTranslation } from "react-i18next";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  const { t } = useTranslation();

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders-details"], queryFn: fetchDetailsOrder },
    {
      enabled: id,
    }
  );
  const { isLoading, data } = queryOrder;

  useEffect(() => {
    if (!isLoading) {
      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

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
          <h3>{t('ORDER_DETAIL.TITLE')}</h3>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>{t('ORDER_DETAIL.RECEPTION_ADDRESS')}</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>{t('ORDER_DETAIL.ADDRESS')} </span>{" "}
                  {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>{t('ORDER_DETAIL.PHONE_NUMBER')} </span> {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>{t('ORDER_DETAIL.SHIPPING_METHOD')}</WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span className="name-delivery">FAST </span>{t('ORDER_DETAIL.FAST')}
                </div>
                <div className="delivery-fee">
                  <span>{t('ORDER_DETAIL.SHIPPING_COST')} </span> {data?.shippingPrice}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>{t('ORDER_DETAIL.PAYMENT_METHOD')}</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderConstant.payment[data?.paymentMethod]}
                </div>
                <div className="status-payment">
                  {data?.isPaid ? t('ORDER_DETAIL.PAID') : t('ORDER_DETAIL.UNPAID')}
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
              <div style={{ width: "670px", fontWeight: "bold" }}>{t('ORDER_DETAIL.PRODUCT')}</div>
              <WrapperItemLabel>{t('ORDER_DETAIL.PRICE')}</WrapperItemLabel>
              <WrapperItemLabel>{t('ORDER_DETAIL.QUANTITY')}</WrapperItemLabel>
              <WrapperItemLabel>{t('ORDER_DETAIL.DISCOUNT')}</WrapperItemLabel>
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
              <WrapperItemLabel>{t('ORDER_DETAIL.SUBTOTAL')}</WrapperItemLabel>
              <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>{t('ORDER_DETAIL.SHIPPING_COST')}</WrapperItemLabel>
              <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>{t('ORDER_DETAIL.TOTAL')}</WrapperItemLabel>
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
