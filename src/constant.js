import { useTranslation } from "react-i18next";

export const orderConstant = {
  // const { t } = useTranslation(),
  delivery: {
    fast: "FAST",
    gojek: "GO_JEK",
  },
  payment: {
    later_money: "Cash on Delivery (COD)",
    paypal: "Payment with Paypal",
    qr_code: "Payment with QR code",
  },
};
