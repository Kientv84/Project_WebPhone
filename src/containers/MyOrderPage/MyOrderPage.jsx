import React, { useEffect } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery, useQueryClient } from "react-query";
import * as OrderService from "../../services/OrderService";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHook } from "../../hooks/useMutationHook";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const fetchMyOrder = async () => {
    if (!state?.id || !state?.token) {
      throw new Error("Invalid state");
    }

    try {
      const res = await OrderService.getOrderByUserId(state.id, state.token);
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: !!state?.id && !!state?.token,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHook((data) => {
    const { id, token, orderItems } = data;
    OrderService.cancelOrder(id, token, orderItems);
    return;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          message.success(t("MY_ODER.TOAST_SUCCESS"));

          // Cập nhật lại danh sách đơn hàng mà không cần refetch
          queryClient.setQueryData(["orders"], (oldData) => {
            return oldData?.filter((item) => item._id !== order._id);
          });
        },
        onError: () => {
          message.error(t("MY_ODER.TOAST_FAILED"));
        },
      }
    );
  };

  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel, dataCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <img
            src={order?.image}
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
            }}
          >
            {order?.name}
          </div>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div
          style={{
            height: "100%",
            width: "1270px",
            margin: "80px auto 0",
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
                fontSize: "14px", // Kích thước chữ
                fontWeight: "bold", // Kiểu chữ đậm
                color: "#707070", // Màu chữ (ví dụ: đỏ cam)
              }}
            >
              {t("MY_ODER.TITLE")}
            </span>
          </div>

          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {" "}
                      {t("MY_ODER.STATUS")}{" "}
                    </span>
                    <div
                      style={{
                        display: "flex", // Đảm bảo hai phần tử hiển thị trên cùng một hàng
                        justifyContent: "space-between", // Đẩy phần tử về hai phía của dòng
                        alignItems: "center",
                        marginTop: "3px",
                      }}
                    >
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          {t("MY_ODER.ORDER_ID")}{" "}
                        </span>
                        {`${order.orderNumber}`}
                      </div>
                      <div style={{ marginLeft: "10px" }}>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          {t("MY_ODER.ORDER_CREATED_AT")}{" "}
                        </span>
                        {`${new Date(order.createdAt).toLocaleDateString(
                          "en-GB"
                        )} ${new Date(order.createdAt).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}`}
                      </div>
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        {t("MY_ODER.IS_DELIVERRED")}{" "}
                      </span>
                      {(() => {
                        switch (order.isDelivered) {
                          case "successful order":
                            return t("MY_ODER.SUCCESSFULL_ORDER");
                          case "pending":
                            return t("MY_ODER.PENDING");
                          case "sended":
                            return t("MY_ODER.SENDED");
                          case "shipping":
                            return t("MY_ODER.SHIPPING");
                          case "delivery success":
                            return t("MY_ODER.DELIVERY_SUCCESS");
                          case "delivery fail":
                            return t("MY_ODER.DELIVERY_FAIL");
                          default:
                            return t("MY_ODER.UNKNOWN");
                        }
                      })()}
                    </div>
                    <div style={{ marginTop: "3px" }}>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        {t("MY_ODER.IS_PAID")}{" "}
                      </span>
                      {`${
                        order.isPaid ? t("MY_ODER.PAID") : t("MY_ODER.UN_PAID")
                      }`}
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        {t("MY_ODER.TOTAL")}:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(56, 56, 61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {order.isDelivered === "delivered" && (
                        <ButtonComponent
                          onClick={() => handleCancelOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 116, 229)",
                            borderRadius: "4px",
                          }}
                          textbutton={t("MY_ODER.DELETE_ORDER")}
                          styletextbutton={{
                            color: "rgb(11, 116, 229)",
                            fontSize: "14px",
                          }}
                        >
                          {/* Nội dung nút */}
                        </ButtonComponent>
                      )}
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid rgb(11, 116, 229)",
                          borderRadius: "4px",
                        }}
                        textbutton={t("MY_ODER.MORE_DETAILS")}
                        styletextbutton={{
                          color: "rgb(11, 116, 229)",
                          fontSize: "14px",
                        }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              );
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
