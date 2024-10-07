import React from "react";
import {
  Label,
  WrapperInfo,
  WrapperValue,
  WrapperItemOrder,
  WrapperItemOrderInfo,
  WrapperInfo1,
} from "./style";
import { convertPrice } from "../../utils";
import Loading from "../../components/LoadingComponent/Loading";
import { useLocation } from "react-router-dom";
import { orderConstant } from "../../constant";
import { useTranslation } from "react-i18next";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
<<<<<<< multi_-languages
  // console.log('state', state)
  const { t } = useTranslation();
=======
>>>>>>> master

  return (
    <div
      style={{
        background: "#f5f5fa",
        with: "100%",
        height: "auto",
        paddingTop: "0.1px",
        marginTop: "60px",
      }}
    >
      <Loading isLoading={false}>
        <div
          style={{
            height: "100vh",
            width: "1270px",
            margin: "0px auto",
            padding: "0.1px 0px ",
          }}
        >
          <h3 style={{ fontWeight: "bold" }}>{t('ORDER_SUCCESS.TITLE')}</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <WrapperInfo1>
                <div>
                  <Label>{t('ORDER_SUCCESS.TITLE_SHIPPING')}</Label>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderConstant.delivery[state?.delivery]}
                    </span>{" "}
                    {t('ORDER_SUCCESS.FAST_GO_JECT')}
                  </WrapperValue>
                </div>
              </WrapperInfo1>
              <WrapperInfo>
                <div>
                  <Label>{t('ORDER_SUCCESS.TITLE_PAYMENT')}</Label>
                  <WrapperValue>
                    {orderConstant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.product}>
                      <div
                        style={{
                          width: "500px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
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
                          gap: "20px",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            {t('ORDER_SUCCESS.PRICE')}: {convertPrice(order?.price)}
                          </span>
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            {t('ORDER_SUCCESS.QUANTITY')}: {order?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: "16px", color: "red" }}>
                   {t('ORDER_SUCCESS.TOTAL')}: {convertPrice(state?.totalPriceMemo)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSuccess;
