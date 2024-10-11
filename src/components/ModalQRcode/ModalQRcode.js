import { Modal, Statistic } from "antd";
import React from "react";
import { QRCodeImage } from "./style";
import { useTranslation } from "react-i18next";

const ModalQRcode = ({
  title,
  isOpen = false,
  children,
  productName,
  amount,
  bank,
  ...rests
}) => {
  const { Countdown } = Statistic;

  const { t } = useTranslation();

  const MY_BANK = {
    BANK_ID: 970422,
    ACCOUNT_NO: "0968727900",
  };

  const QR = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${productName}`;

  console.log("QR", QR);

  // Thời gian bắt đầu đếm ngược (15 phút)
  const deadline = Date.now() + 15 * 60 * 1000; // 15 minutes in milliseconds

  // Hàm xử lý khi đếm ngược về 0
  const onCountdownFinish = () => {
    console.log("Countdown finished");
    // Đóng modal hoặc xử lý khác khi hết thời gian
  };

  return (
    <div>
      <Modal title={title} open={isOpen} {...rests}>
        <wrapperQRcode>
          <QRCodeImage src={QR} alt="QR Code" className="qr-image" />
        </wrapperQRcode>

        {/* Hiển thị đồng hồ đếm ngược */}
        <Countdown
          title={t("PAYMENT.MESS_PLS")}
          value={deadline}
          onFinish={onCountdownFinish} // Gọi khi hết thời gian
          format="mm:ss" // Hiển thị phút:giây
        />
      </Modal>
    </div>
  );
};

export default ModalQRcode;
