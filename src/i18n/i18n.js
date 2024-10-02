import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        HEADER: {
        "CATEGORY": "Category",
        "SEARCH_PLACEHODER": "What do you need to find?",
        "BUTTON_SEARCH": "Search",
        "CART": "Cart",
        "MY_INFO": "My information",
        "MY_ORDER": "My Order",
        "LOGOUT": "Log Out",
        "SIGN_IN_UP": " Sign-In/ Sign-Up",
        "ACCOUNT": "Account",
        "PRODUCT_SUGGET": "Product suggests"
        },
        MY_ODER: {
        "TITLE": "My Oder",
        "STATUS": "Status",
        "IS_DELIVERRED": "Is Delivered",
        "DELIVERRED": "Delivered",
        "UN_DELIVERRED": "Not Delivered",
        "IS_PAID": "Is Paid",
        "PAID": "Paid",
        "UN_PAID": "Un Paid",
        "DELETE_ORDER": "Delete Oder ",
        "MORE_DETAILS": "More Details",
        "TOAST_SUCCESS": "Delete order Success",
        "TOAST_FAILED": "Delete order Failed",
        "TOTAL": "Total",
        },
        ORDER: {
        "DELIVERRED_DES1": "Below 200.000 VND",
        "DELIVERRED_DES2": "From 200.000 VND to below 500.000 VND",
        "DELIVERRED_DES3": "More 500.000 VND",
        "FREESHIP": "Free ship",
        "DELIVERY_FEE": "Delivery cost",
        "ADDRESS": "Address",
        "TOTAL": "Total",
        "PRICE": "Unit Price",
        "QUANTITY": "Quantity",
        "SUBTOTAL": "Subtotal",
        "PRODUCT": "Products",
        "DISCOUNT": "Discount",
        "TOTAL_TO_PAY": "Total",
        "CHANGE": "Change",
        "VAT": "(Including VAT if applicable)",
        "BUY_BTN": "Buy",
        "UPDATE_INFOR": "Update Information",
        "NAME_CHANGE": "Name",
        "CITY_CHANGE": "City",
        "PHONE_CHANGE": "Phone",
        "ADDRESS_CHANGE": "Address",
        "NAME_MESSAGE": "Please input your name!",
        "CITY_MESSAGE": "Please input your city!",
        "PHONE_MESSAGE": "Please input your  phone!",
        "ADDRESS_MESSAGE": "Please input your  address!"
        }
    }
  },
  vi: {
    translation: {
        HEADER: {
        "CATEGORY": "Danh mục",
        "SEARCH_PLACEHODER": "Bạn đang tìm kiếm sản phẩm gì?",
        "BUTTON_SEARCH": "Tìm kiếm",
        "CART": "Giỏ hàng",
        "MY_INFO": "Thông tin của tôi",
        "MY_ORDER": "Đơn hàng của tôi",
        "LOGOUT": "Đăng xuất",
        "SIGN_IN_UP": " Đăng nhập/ Đăng ký",
        "ACCOUNT": "Tài khoản",
        "PRODUCT_SUGGET": "Gợi ý sản phẩm"
        },
        MY_ODER: {
        "TITLE": "Đơn hàng của tôi",
        "STATUS": "Trạng thái",
        "IS_DELIVERRED": "Vận chuyển",
        "DELIVERRED": "Đã vận chuyển",
        "UN_DELIVERRED": "Chưa vận chuyển",
        "IS_PAID": "Thanh toán",
        "PAID": "Đã thanh toán",
        "UN_PAID": "Chưa thanh toán",
        "DELETE_ORDER": "Xóa đơn hàng",
        "MORE_DETAILS": "Xem chi tiết",
        "TOAST_SUCCESS": "Xóa đơn hàng thành công",
        "TOAST_FAILED": "Xóa đơn hàng thất bại",
        "TOTAL": "Tổng đơn hàng",
        },
       ORDER: {
        "DELIVERRED_DES1": "Dưới 200.000 VND",
        "DELIVERRED_DES2": "Từ 200.000 VND đến dưới 500.000 VND",
        "DELIVERRED_DES3": "Trên 500.000VND",
        "DELIVERY_FEE": "Phí giao hàng",
        "FREESHIP": "Miễn phí giao hàng",
        "ADDRESS": "Địa chỉ",
        "TOTAL": "Số lượng",
        "PRICE": "Giá tiền",
        "QUANTITY": "Số lượng",
        "SUBTOTAL": "Tổng tiền",
        "PRODUCT": "Sản phẩm",
        "DISCOUNT": "Giảm giá",
        "TOTAL_TO_PAY": "Thành tiền",
        "CHANGE": "Thay đổi",
        "VAT": "(Bao gồm phí VAT nếu có)",
        "BUY_BTN": "Mua",
        "UPDATE_INFOR": "Cập nhật thông tin",
        "NAME_CHANGE": "Tên",
        "CITY_CHANGE": "Thành phố",
        "PHONE_CHANGE": "Liên hệ",
        "ADDRESS_CHANGE": "Địa chỉ",
        "NAME_MESSAGE": "Vui lòng nhập tên của bạn",
        "CITY_MESSAGE": "Vui lòng nhập tên thành phố",
        "PHONE_MESSAGE": "Vui lòng nhập số điện thoại của bạn",
        "ADDRESS_MESSAGE": "Vui lòng nhập địa chỉ"
        }
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", 
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;