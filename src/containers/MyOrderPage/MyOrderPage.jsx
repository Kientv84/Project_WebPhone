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
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state?.id && state?.token,
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
          message.success(t('MY_ODER.TOAST_SUCCESS'));

          // Cập nhật lại danh sách đơn hàng mà không cần refetch
          queryClient.setQueryData(["orders"], (oldData) => {
            return oldData?.filter((item) => item._id !== order._id);
          });
        },
        onError: () => {
          message.error(t('MY_ODER.TOAST_FAILED'));
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
            margin: "70px auto 0",
          }}
        >
          <h3 style={{ marginTop: "5px" }}>{t('MY_ODER.TITLE')}</h3>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {" "}
                      {t('MY_ODER.STATUS')}{" "}
                    </span>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        {t('MY_ODER.IS_DELIVERRED')}{" "}
                      </span>
                      {`${order.isDelivered ? t('MY_ODER.DELIVERRED') : t('MY_ODER.UN_DELIVERRED')}`}
                    </div>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        {t('MY_ODER.IS_PAID')}{" "}
                      </span>
                      {`${order.isPaid ? t('MY_ODER.PAID') : t('MY_ODER.UN_PAID')}`}
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>{t('MY_ODER.TOTAL')}: </span>
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
                      {!order.isDelivered && (
                        <ButtonComponent
                          onClick={() => handleCancelOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 116, 229)",
                            borderRadius: "4px",
                          }}
                          textbutton={t('MY_ODER.DELETE_ORDER')}
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
                        textbutton={t('MY_ODER.MORE_DETAILS')}
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
