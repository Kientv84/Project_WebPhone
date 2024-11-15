import { useTranslation } from "react-i18next";

export const orderConstant = {
  // const { t } = useTranslation(),
  delivery: {
    fast: "GHTK",
    gojek: "VIETTELPOST",
  },
  payment: {
    later_money: "Cash on Delivery (COD)",
    paypal: "Payment with Paypal",
    qr_code: "Payment with QR code",
  },
};
