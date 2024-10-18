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
import { useLocation, useNavigate } from "react-router-dom";
import { orderConstant } from "../../constant";
import { useTranslation } from "react-i18next";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "#f5f5fa",
        with: "100%",
        height: "auto",
        paddingTop: "0.1px",
        marginTop: "65px",
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
                fontSize: "14px",
                fontWeight: "bold",
                color: "#707070",
              }}
            >
              {t("PAYMENT.TITLE")}
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
              {t("ORDER_SUCCESS.TITLE")}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <div>
              <WrapperInfo1>
                <div>
                  <Label>{t("ORDER_SUCCESS.TITLE_SHIPPING")}</Label>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderConstant.delivery[state?.delivery]}
                    </span>{" "}
                    {t("ORDER_SUCCESS.FAST_GO_JECT")}
                  </WrapperValue>
                </div>
              </WrapperInfo1>
              <WrapperInfo>
                <div>
                  <Label>{t("ORDER_SUCCESS.TITLE_PAYMENT")}</Label>
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
                            {t("ORDER_SUCCESS.PRICE")}:{" "}
                            {convertPrice(order?.price)}
                          </span>
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            {t("ORDER_SUCCESS.QUANTITY")}: {order?.amount}
                          </span>
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperItemOrderInfo>
              <div>
                <span style={{ fontSize: "16px", color: "red" }}>
                  {t("ORDER_SUCCESS.TOTAL")}:{" "}
                  {convertPrice(state?.totalPriceMemo)}
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
