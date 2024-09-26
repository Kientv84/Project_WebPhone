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
import { useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../../services/PaymentService";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [paymentInterval, setPaymentInterval] = useState(null); // Thêm trạng thái để lưu ID của interval

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [paymentbyQRCode, setPaymentbyQRCode] = useState("qr_code")
  
  const navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [isOpenModalQRcode, setIsOpenModalQRcode] = useState(false);
  // const [isSuccessPaied, setIsSuccessPaied] =  useState(false);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

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

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
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
      Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);



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
      // console.log('first', user)
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: deliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };
 

// const handleQrCodePayment = () => {
//     setTimeout(() => {
//       setInterval(() => {
//          checkPaid(totalPriceMemo, content)
//       }, 2000);
//   }, 10000); // 10 giây sau sẽ kiểm tra thanh toán
//     setIsOpenModalQRcode(true);
//   };

const handleQrCodePayment = () => {
  setIsOpenModalQRcode(true); // Mở modal QR code

  let timeLeft = 900; // 15 phút = 900 giây
  const interval = setInterval(async () => {
    if (timeLeft > 0) {
      try {
        // Gọi hàm checkPaid để kiểm tra thanh toán
        const paymentSuccess = await checkPaid(totalPriceMemo, content);

        if (paymentSuccess) {
          clearInterval(interval); // Dừng interval nếu thanh toán thành công
          message.success("Thanh toán thành công!");
          // setIsSuccessPaied(true);
          setIsOpenModalQRcode(false); // Đóng modal sau khi thanh toán thành công
               //Gọi hàm lưu đơn hàng
          mutationAddOrder.mutate({
          token: user?.access_token,
          orderItems: order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: "qr_code",
          itemsPrice: priceMemo,
          shippingPrice: deliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          email: user?.email,
          isPaid: true,  // Đánh dấu là đã thanh toán
         });
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thanh toán:", error);
      }

      timeLeft -= 2; // Cập nhật thời gian còn lại (2 giây mỗi lần)
    } else {
      clearInterval(interval); // Hết thời gian, dừng việc kiểm tra
      message.error("Thời gian thanh toán đã hết. Vui lòng thử lại.");
      setIsOpenModalQRcode(false); // Đóng modal nếu hết thời gian
    }
  }, 4000); // Kiểm tra mỗi 2 giây

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
      message.success("Đặt hàng thành công");
      navigate("/order-success", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error("Đã xảy ra lỗi khi đặt hàng");
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
  // const itemsDelivery = [
  //   {
  //     title: '20.000 VND',
  //     description: 'Dưới 200.000 VND',
  //   },
  //   {
  //     title: '10.000 VND',
  //     description: 'Từ 200.000 VND đến dưới 500.000 VND',
  //   },
  //   {
  //     title: 'Free ship',
  //     description: 'Trên 500.000 VND',
  //   },
  // ]

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
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
    // console.log('details, data', details, data)
  };


  // const handleCancel = () => {
  //   setIsOpenModalQRcode(false)
  // };

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
    // Get product names
      const productNames = order?.orderItemsSelected?.map(item => item.name)
      .join('')
      .replace(/\s+/g, ''); // Xóa tất cả khoảng trắng

      setContent(productNames)
  }
}, [order?.orderItemsSelected]);

 console.log('content',content);
  // useEffect(() => {
  //   if (user?.name) {
  //     setContent(user.name.toUpperCase()); // Lấy tên và chuyển đổi thành viết hoa

  //     console.log('content', content)

  //   }
  // }, [user?.name]);


 async function checkPaid(price, content) {
  try {
    // Fetch dữ liệu từ API
    const response = await fetch(
      "https://script.googleusercontent.com/macros/echo?user_content_key=GzaSr6BLMsZ8dEyL-6rmEQ4u_IVz3lCEO1I1UHpHj56poMfIWMsuxsUyWX6OOKhoqq_n80Gn70HvaQ_S8Q-JK4aOmPwq9O_um5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCBtOQEpoDUhiJ3YAVc1LAB9j-dsruBME-G9SQJ5Df78oi_yuazhZkHxLK3_5bylXW16rxtpxFnBTK7nUoFoUgx63LCerNWtydz9Jw9Md8uu&lib=MdqQX6qMt95UUQMlrxHQ1WGURENw8Mm9a"
    );

    const data = await response.json();
    const lastPaid = data.data[data.data.length -1];
    const lastPrice = lastPaid["Giá trị"];  // Giá trị thanh toán
    const lastContent = lastPaid["Mô tả"];  // Mô tả giao dịch
  console.log('checkMota',content.includes(lastContent))
    // Kiểm tra nếu giá trị và mô tả khớp với yêu cầu
    if (lastPrice >= price && lastContent.includes(content)) {
      return true; // Thanh toán thành công
    } else {
      return false; // Thanh toán chưa thành công
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra thanh toán:", error);
    return false; // Xử lý lỗi, trả về thất bại
  }
}



//   async function checkPaid(price, content) { 

//   if(isSuccessPaied) {

//   }

//   try {
//      // Fetch dữ liệu từ API
//     const response = await fetch(
//       "https://script.googleusercontent.com/macros/echo?user_content_key=GzaSr6BLMsZ8dEyL-6rmEQ4u_IVz3lCEO1I1UHpHj56poMfIWMsuxsUyWX6OOKhoqq_n80Gn70HvaQ_S8Q-JK4aOmPwq9O_um5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCBtOQEpoDUhiJ3YAVc1LAB9j-dsruBME-G9SQJ5Df78oi_yuazhZkHxLK3_5bylXW16rxtpxFnBTK7nUoFoUgx63LCerNWtydz9Jw9Md8uu&lib=MdqQX6qMt95UUQMlrxHQ1WGURENw8Mm9a"
//     );

//     const data = await response.json();
//     const lastPaid = data.data[data.data.length -1]

//     const lastPrice = lastPaid["Giá trị"];  // Thay đổi giá trị này cho phù hợp với yêu cầu của bạn
//     const lastContent =  lastPaid["Mô tả"];  // Nội dung mô tả bạn cần kiểm tra

//     if ( lastPrice >= price && lastContent.includes(content)) {
//       //thong bao
//       message.success("Thanh toán thành công!");
//       setIsOpenModalQRcode(false); // Đóng modal QR Code nếu thanh toán thành công


//         // Gọi hàm lưu đơn hàng
//       mutationAddOrder.mutate({
//       token: user?.access_token,
//       orderItems: order?.orderItemsSelected,
//       fullName: user?.name,
//       address: user?.address,
//       phone: user?.phone,
//       city: user?.city,
//       paymentMethod: "qr_code",
//       itemsPrice: priceMemo,
//       shippingPrice: deliveryPriceMemo,
//       totalPrice: totalPriceMemo,
//       user: user?.id,
//       email: user?.email,
//       isPaid: true,  // Đánh dấu là đã thanh toán
//   });
//     } else {
//       console.log("Thanh toán không thành công. Vui lòng thử lại.")
//       //  message.error("Thanh toán không thành công. Vui lòng thử lại.");
//     }

//   // console.log("lastPrice", lastPrice)
//   // console.log("content", content)
//   } catch (error) {
//   console.log("Error fetching data:", error);
//     message.error("Có lỗi xảy ra trong quá trình kiểm tra thanh toán.");
//   }
// }
// // console.log("totalPriceMemo",totalPriceMemo)


const items = order?.orderItemsSelected
  ?.map(item => item.name)
  .join('')
  .replace(/\s+/g, ''); // Xóa tất cả khoảng trắng


  console.log('items', items)

  return (
    <div
      style={{
        padding: "0.1px 0",
        background: "#f5f5fa",
        with: "100%",
        height: "100vh",
        marginTop: "60px",
      }}
    >
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3 style={{ fontWeight: "bold" }}>Payment</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperInfo2>
                <div>
                  <Label>Choose payment method</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        FAST
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GO_JEK
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo2>
              <WrapperInfo3>
                <div>
                  <Label>Choose delivery method</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money"> Cash on Delivery (COD)</Radio>
                    <Radio value="paypal"> Pay with PayPal</Radio>
                    <Radio value="qr_code"> Pay with QR code</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo3>
            </WrapperLeft>

            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo1>
                  <div>
                    <span>Address: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {`${user?.address} ${user?.city}`}{" "}
                    </span>
                    <span
                      onClick={handleChangeAddress}
                      style={{ color: "#9255FD", cursor: "pointer" }}
                    >
                      Change
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
                    <span>Subtotal</span>
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
                    <span>Discount</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceDiscountMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Delivery Cost</span>
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
                  <span>Total</span>
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
                      (Including VAT if applicable)
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
                  onClick={() => handleQrCodePayment() } // Hàm xử lý cho thanh toán qua QR Code
                  size={40}
                  styleButton={{
                    background: "rgb(0, 123, 255)", // Màu nền cho QR Code Payment (tuỳ chỉnh)
                    height: "48px",
                    width: "320px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textbutton={"Pay with QR Code"}
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
                  textbutton={"Order Now"}
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
          title="Mời bạn thanh toán bằng QR code"
          open={isOpenModalQRcode}
          amount={totalPriceMemo} // Số tiền là 100,000 VND
          productName={items}
          onCancel={handleCancel}
          onOk={handleCancel}
        >
          <Loading isLoading={isLoading}>

          </Loading>
        </ModalQRcode>
        
        <ModalComponent
          title="Update shipping address"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInfoUser}
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
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponent
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <InputComponent
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your  phone!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your  address!" },
                ]}
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
      </Loading>
    </div>
  );
};

export default PaymentPage;
