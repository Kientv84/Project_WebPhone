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
        "PRODUCT_SUGGET": "Product suggests",
        "MY_INFOR": " My Information",
        "MANAGE": "Management",
        "MY_ORDER": "My Order",
        "LOG_OUT": "Log Out"
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
        "ADDRESS_MESSAGE": "Please input your  address!",
        "TOAST_CHOOSE": "Order product fail",
        },
        SIGN_IN: {
        "TITLE": "Sign-In for member",
        "PASSWORD_PLACEHOODER": "password",
        "SIGN_IN_BUTTON": "Sign-In",
        "OR": "Or",
        "FORGOT_PASS": "Forgot Password",
        "TEXT": "Don't have an account yet?",
        "REGISTER": "Register",
        "TITLE_FORGOT_PASS": "Enter Your Email",
        "FORGOT_PLACEHOODER": "Enter your email address",
        "BUTTON_FORGOT": "Send",
        "CONFIRM_PASS": "Confirm password",
        "RES_BUTTON": "Register",
        "ENTER_NEW_PASS": "Enter New Password",
        "RES_TEXT": "You already have an account yet?",
        "SIGN_IN_MESS_SUCCESS": "Logged in successfully",
        "RESET_MESS_SUCCESS": "Send mail verify successfully",
        "SIGN_UP_MESS_SUCCESS": "Registered successfully",
        "NEW_PASS": "New password",
        "UPDATE_PASS": "Update new password",
        "UPDATE_BTN": "Update"
        },
        PRODUCT_DETAILS: {
        "BACK_HOMEPAGE": "Back to home page",
        "PRODUCT_INFOR": "Product Information",
        "STAR": "Star",
        "SOLD_OUT": "Sold Out",
        "MESSAGE_SUCCESS": "Success to add product to cart",
        "PROMOTION": "Promotion",
        "QUANTITY": "Quantity",
        "DESCRIPTION": "Description",
        "PURCHASE": "Purchase now",
        "ADD_CART": "Add to cart",
        },
        LOGIN_TOAST: {
          "TOAST_SUCCESS": "Logged in successfully",
          "TOAST_FAIL": "Login failed. Please try again."
        },
        PROFILE: {
          "TITLE": "User Information",
          "NAME": "Name",
          "PHONE": "Phone",
          "AVATAR": "Avarta",
          "ADDRESS": "Address",
          "BTN_UPDATE": "Update",
          "NAME_PLACEHOODER": "Enter your name!",
          "PHONE_PLACEHOODER": "Enter your phone number!",
          "ADDRESS_PLACEHOODER": "Enter your address",
          "WARNING": "Warn",
          "REQUIRE_UPLOAD_IMG": "Please choose your image",
          "UPDATE_SUCCESS": "Update sucess ",
          "SELECT_FILE": "Select File"
        },
        ADMIN: {
          "USER": "Users",
          "PRODUCT": "Products",
          "ORDER": "Orders",
          "MANAGE_USER": "Manage Users",
          "MANAGE_PRODUCT": "Manage Products",
          "MANAGE_ODERS": "Manage Orders",
          "EXPORT_EXCEL": "Export Excel",
          "USER_NAME": "name",
          "USER_EMAIL": "Email",
          "USER_ADDRESS": "Address",
          "ADMIN": "Admin",
          "USER_PHONE": "Phone",
          "ACTION": "Action",
          "TRUE": "True",
          "FALSE": "False",
          "DELETE_ALL": "Delete All",

          "PRODUCT_NAME": "Name Product",
          "PRODUCT_PRICE": "Price",
          "PRODUCT_RATING": "Rating",
          "PRODUCT_TYPE": "Type",
          "PRODUCT_BRANCH": "Branch",

          "ORDER_USER": "User name",
          "ORDER_PHONE": "Phone",
          "ORDER_ADDRESS": "Address",
          "ORDER_PAYMENT_METHOD": "Payment method",
          "ORDER_TOTAL_PRICE": "Total price",
          "ORDER_PAID": "Paid",
          "ORDER_UPDATE_PAY": "Update Payment",
          "ORDER_SHIPPED": "Shipped",
          "ORDER_UPDATE_DELIVERED": "Update Delivered",
          "UPDATE_DELIVERY_SUCC": "Update Delivery Success",
          "UPDATE_DELIVERY_FAIL": "Update Fail",
          "UPDATE_PAY_SUCC": "Update Delivery Success",
          "UPDATE_PAY_FAIL": "Update Fail",
          "DELETE_TOAST": "Delete order Success",
          "DELIVERED": "Delivered",
          "NOT_SHIPPED": "Not Shipped",
          "UPDATE_DELIVERY": "Update Delivery",
          "DELIVERY_STATE": "Delivery State:",
          "SELECT_DELIVERY": "Please select the delivery state!",
          "SELECT_PAY": "Please select the payment state!",

          "DELETE_PRODUCT": "Delete Product",
          "MESS_DELETE_PRODUCT": "Are you sure you want to delete this product?",

          "DELETE_USER": "Delete User",
          "MESS_DELETE_USER": "Are you sure you want to delete this user?",

          "DELETE_ORDER": "Delete Order",
          "MESS_DELETE_ORDER": "Are you sure you want to delete this order?",
          "CANCEL_BUTTON": "Cancel",
          "OKE_BUTTON": "Delte",

          "ADD_NEW_PRODUCT": "New Product",
          "NEW_PRODCUT_NAME": "Name",
          "NEW_TYPE": "Type",
          "ADD_TYPE": "Add Type",
          "ADD_NEW_TYPE": "New Type",
          "NEW_BRANCH": "Branch",
          "ADD_BRANCH": "Add Branch",
          "ADD_NEW_BRANCH": "New Branch",
          "COUNT_IN_STOCK": "Count in Stock",
          "PRICE": "Price",
          "NEW_DESCRIPTION": "Description",
          "NEW_PROMOTION": "Promotion",
          "NEW_RAING": "Rating",
          "NEW_DISCOUNT": "Discount",
          "NEW_IMG": "Image",
          "NEW_IMG_1": "Image Product",
          "NEW_IMG_2": "Image Product",
          "SELECT_IMG_PRODUCT": "Select File",
          "BUTTON_SUBMID_ADD_PRODUCT": "Submit",
          "PRODUCT_DETAIL": "Product Details",

          
          "PLACEHOODER_PRODCUT_NAME": "Please input product name!",
          "PLACEHOODER_TYPE": "Please input product type!",
          "PLACEHOODER_BRANCH": "Please input product branch!",
          "PLACEHOODER_ADD_BRANCH": "Please input product branch!",
          "PLACEHOODER_COUNT_IN_STOCK": "Please input product count inStock!",
          "PLACEHOODER_PRICE": "Please input product price!",
          "PLACEHOODER_DESCRIPTION": "Please input product description",
          "PLACEHOODER_PROMOTION": "Please input product promotion!",
          "PLACEHOODER_RAING": "Please input your count rating!",
          "PLACEHOODER_DISCOUNT": "Please input your discount of product!",
          "PLACEHOODER_IMG": "Please input your count image product!",

          "USER_DETAIL": "User Details",
          "AVATAR": "Avarta",
          "DETAIL_NAME_PLACEHOODER": "Please input name!",
          "DETAIL_EMAIL_PLACEHOODER": "Please input email!",
          "DETAIL_PHONE_PLACEHOODER": "Please input phone!",
          "DETAIL_ADDRESS_PLACEHOODER": "Please input address!",
          "DETAIL_AVARTA_PLACEHOODER": "Please choose avarta!",
          "DETAIL_SELECT_PLACEHOODER": "Select File!",
          "DETAIL_USER_APPLY": "Apply",

          "SEARCH": "Search",
          "RESET": "Reset",
          "CLOSE": "Close",
        },
        PAYMENT: {
          "TITLE": "Payment",
          "CHOOSE_PAYMENT_METHOD": "Choose payment method",
          "FAST_GO_JECT": "Economical delivery",
          "CHOOSE_DELIVERED_METHOD": "Choose delivery method",
          "COD": "Cash on Delivery (COD)",
          "PAYPAL": "Pay with PayPal",
          "QR_CODE": "Pay with QR code",
          "ORDER_NOW": "Order Now",
          "ADDRESS": "Adress",
          "CHANGE": "Change",
          "UPDATE_SHIPPING_ADDRESS": "Update shipping address",
          "NAME": "Name",
          "CITY": "City",
          "PHONE": "Phone",
          "SUBTOTAL": "Subtotal",
          "DISCOUNT": "Discount",
          "DELIVERY_COST": "Delivery Cost",
          "TOTAL": "Total",
          "VAT": "(Including VAT if applicable)",
          "PAY_WITH_QR": "Pay with QR code",
          "TILE_QR_CODE": "Please pay with QR code!",
          "MESS_PLS": "Please pay later",
          "PAY_SUCCESS": "Payment successful!",
          "PAY_QR_CODE_FAIL": "Payment time has expired. Please try again!",
          "ORDER_SUCCESS": "Order success",
          "MESS_ERR_ORDER": "An error occurred while ordering",

          "PLACEHOODER_ADDRESS": "Please input your  address!",
          "PLACEHOODER_NAME": "Please input your name!",
          "PLACEHOODER_CITY": "Please input your city!",
          "PLACEHOODER_PHONE": "Please input your  phone!",
        },
        ORDER_SUCCESS: {
          "TITLE": "Order Success",
          "TITLE_SHIPPING": "Shipping method",
          "TITLE_PAYMENT": "Payment method",
          "FAST_GO_JECT": "Economical delivery",
          "PRICE": "Price",
          "TOTAL": "Total",
          "QUANTITY": "Quantity",
        },
          ORDER_DETAIL: {
          "TITLE": "Order Details",
          "RECEPTION_ADDRESS": "Recipient's address",
          "ADDRESS": "Address:",
          "PHONE_NUMBER": "Phone Number:",
          "SHIPPING_METHOD": "Shipping method",
          "PAYMENT_METHOD": "Payment method",
          "FAST": "Economical delivery",
          "SHIPPING_COST": "Shipping Cost",
          "COD": "Cash on Delivery (COD)",
          "PAID": "paid",
          "UNPAID": "Unpaid",
          "PRODUCT": "Product",
          "PRICE": "Price",
          "QUANTITY": "Quantity",
          "DISCOUNT": "Discount",
          "SUBTOTAL": "Subtotal",
          "TOTAL": "Total"
        },
          CONSTANT: {
          'LATER_MONEY': 'Cash on Delivery (COD)',
          'PAYPAL': 'Payment with Paypal',
          'QR_CODE': 'Payment with QR code',
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
        "PRODUCT_SUGGET": "Gợi ý sản phẩm",
        "MY_INFOR": " Thông tin của tôi",
        "MANAGE": "Quản lý sản phẩm",
        "MY_ORDER": "Đơn hàng của tôi",
        "LOG_OUT": "Đăng xuất"
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
        "ADDRESS_MESSAGE": "Vui lòng nhập địa chỉ",
        "TOAST_FAILED": "Đặt hàng thất bại"
        },
        SIGN_IN: {
        "TITLE": "Người dùng đăng nhập",
        "PASSWORD_PLACEHOODER": "nhập mật khẩu",
        "SIGN_IN_BUTTON": "Đăng nhập",
        "OR": "Hoặc",
        "FORGOT_PASS": "Quên mật khẩu",
        "TEXT": "Bạn chưa có tài khoản?",
        "REGISTER": "Đăng ký",
        "TITLE_FORGOT_PASS": "Nhập Email của bạn",
        "FORGOT_PLACEHOODER": "Vui lòng nhập địa chỉ email của bạn",
        "BUTTON_FORGOT": "Gửi",
        "CONFIRM_PASS": "Xác nhận lại mật khẩu",
        "RES_BUTTON": "Đăng ký",
        "RES_TEXT": "Bạn đã có tài khoản?",
        "SIGN_IN_MESS_SUCCESS": "Đăng nhập thành công",
        "ENTER_NEW_PASS": "Nhập mật khẩu mới",
        "RESET_MESS_SUCCESS": "Gửi mail xác nhận thành công",
        "SIGN_UP_MESS_SUCCESS": "Đăng ký thành công",
        "NEW_PASS": "Mật khẩu mới",
        "UPDATE_PASS": "Cập nhật mật khẩu",
        "UPDATE_BTN": "Cập Nhật"
        },
        PRODUCT_DETAILS: {
        "BACK_HOMEPAGE": "Trở về trang chủ",
        "PRODUCT_INFOR": "Thông tin về sản phẩm",
        "STAR": "Sao",
        "SOLD_OUT": "Hết hàng",
        "MESSAGE_SUCCESS": "Thêm giỏ hàng thành công",
        "PROMOTION": "Khuyến mãi",
        "QUANTITY": "Số lượng",
        "DESCRIPTION": "Mô tả",
        "PURCHASE": "Mua ngay",
        "ADD_CART": "Thêm giỏ hàng",
        },
        LOGIN_TOAST: {
        "TOAST_SUCCESS": "Đăng nhập thành công",
        "TOAST_FAIL": "Đăng nhập không thành công. Vui lòng thử lại."
        },
        PROFILE: {
          "TITLE": "Thông tin người dùng",
          "NAME": "Tên",
          "PHONE": "Số điện thoại",
          "AVATAR": "Ảnh đại diện",
          "ADDRESS": "Địa chỉ",
          "BTN_UPDATE": "Cập nhật",
          "NAME_PLACEHOODER": "Nhập tên của bạn",
          "PHONE_PLACEHOODER": "Nhập số điện của bạn",
          "ADDRESS_PLACEHOODER": "Nhập địa chỉ của bạn",
          "WARNING": "cảnh báo",
          "REQUIRE_UPLOAD_IMG": "Vui lòng chọn tấm ảnh để upload",
          "UPDATE_SUCCESS": "Cập nhật thành công",
          "SELECT_FILE": "Chọn file ảnh"
        },
        ADMIN: {
          "USER": "Thành Viên",
          "PRODUCT": "Sản Phẩm",
          "ORDER": "Đơn Hàng",
          "MANAGE_USER": "Quản lý người dùng",
          "MANAGE_PRODUCT": "Quảng lý sản phẩm",
          "MANAGE_ODERS": "Quản lý đơn hàng",
          "EXPORT_EXCEL": "In ra bảng",
          "USER_NAME": "Tên",
          "USER_EMAIL": "Địa chỉ email",
          "USER_ADDRESS": "Địa chỉ",
          "ADMIN": "Vai trò quản trị",
          "USER_PHONE": "Số điện thoại",
          "ACTION": "Quản lý",
          "TRUE": "Đúng",
          "FALSE": "Sai",
          "DELETE_ALL": "Xóa tất cả",

          "PRODUCT_NAME": "Tên sản phẩm",
          "PRODUCT_PRICE": "Giá",
          "PRODUCT_RATING": "Đánh giá",
          "PRODUCT_TYPE": "Loại",
          "PRODUCT_BRANCH": "Thương hiệu",

          "ORDER_USER": "Người mua hàng",
          "ORDER_PHONE": "Số điện thoại",
          "ORDER_ADDRESS": "Địa chỉ",
          "ORDER_PAYMENT_METHOD": "Phương thức thanh toán",
          "ORDER_TOTAL_PRICE": "Tổng tiền",
          "ORDER_PAID": "Đã trả",
          "ORDER_UPDATE_PAY": "Cập nhật thanh toán",
          "ORDER_SHIPPED": "Đã vận chuyển",
          "ORDER_UPDATE_DELIVERED": "Đã giao hàng",
          "UPDATE_DELIVERY_SUCC": "Cập nhật giao hàng thành công",
          "UPDATE_DELIVERY_FAIL": "Cập nhật giao hàng thất bại",
          "UPDATE_PAY_SUCC": "Cập nhật phương thức thanh toán thành công",
          "UPDATE_PAY_FAIL": "cập nhật phương thức thanh toán thất bại",
          "DELETE_TOAST": "xóa đơn hàng thành công",
          "DELIVERED": "Đã giao hàng",
          "NOT_SHIPPED": "Chưa vận chuyển",
          "UPDATE_DELIVERY": "Cập nhật giao hàng",
          "DELIVERY_STATE": "Trạng thái giao hàng:",
          "SELECT_DELIVERY": "Vui lòng chọn trạng thái",
          "SELECT_PAY": "Vui lòng chọn trạng thái thanh toán",

          
          "DELETE_USER": "Xóa người dùng",
          "MESS_DELETE_USER": "Bạn có chắc sẽ xóa người dùng này?",

          "DELETE_PRODUCT": "Xóa sản phẩm",
          "MESS_DELETE_PRODUCT": "Bạn có chắc sẽ xóa sản phẩm này?",

          "DELETE_ORDER": "Xóa đơn hàng",
          "MESS_DELETE_ORDER": "Bạn có chắc sẽ xóa đơn hàng này?",
          "CANCEL_BUTTON": "Hủy",
          "OKE_BUTTON": "Xóa",

          "ADD_NEW_PRODUCT": "Thêm sản phẩm mới",
          "NEW_PRODCUT_NAME": "Tên sảm phẩm",
          "NEW_TYPE": "Loại",
          "ADD_TYPE": "Thêm loại",
          "ADD_NEW_TYPE": "Thêm loại mới",
          "NEW_BRANCH": "Thương hiệu",
          "ADD_BRANCH": "Thêm thương hiệu",
          "ADD_NEW_BRANCH": "Thương hiệu mới",
          "COUNT_IN_STOCK": "Trong kho",
          "PRICE": "Giá",
          "NEW_DESCRIPTION": "Mô tả",
          "NEW_PROMOTION": "Khuyến mãi",
          "NEW_RAING": "Đánh giá",
          "NEW_DISCOUNT": "Giảm giá",
          "NEW_IMG": "Ảnh sản phẩm",
          "NEW_IMG_1": "Ảnh 1",
          "NEW_IMG_2": "Ảnh 2",
          "SELECT_IMG_PRODUCT": "Chọn hình ảnh",
          "BUTTON_SUBMID_ADD_PRODUCT": "Lưu sản phẩm",
          "PRODUCT_DETAIL": "Chi tiết sản phẩm",
          
          "PLACEHOODER_PRODCUT_NAME": "Vui lòng nhập tên sản phẩm!",
          "PLACEHOODER_TYPE": "Vui lòng nhập loại sản phẩm!",
          "PLACEHOODER_BRANCH": "Vui lòng nhập thương hiệu!",
          "PLACEHOODER_ADD_BRANCH": "Vui lòng nhập thương hiệu mới!",
          "PLACEHOODER_COUNT_IN_STOCK": "Vui lòng nhập số lượng trong kho!",
          "PLACEHOODER_PRICE": "Vui lòng nhập giá!",
          "PLACEHOODER_DESCRIPTION": "Vui lòng nhập mô tả",
          "PLACEHOODER_PROMOTION": "Vui lòng nhập khuyến mãi!",
          "PLACEHOODER_RAING": "Vui lòng nhập đánh giá!",
          "PLACEHOODER_DISCOUNT": "Vui lòng nhập phần trăm giảm giá!",
          "PLACEHOODER_IMG": "Vui lòng chọn hình ảnh sản phẩm!",

          "USER_DETAIL": "Chi tiết người dùng",
          "AVATAR": "Ảnh đại diện",
          "DETAIL_NAME_PLACEHOODER": "Vui lòng nhập tên!",
          "DETAIL_EMAIL_PLACEHOODER": "Vui lòng nhập email !",
          "DETAIL_PHONE_PLACEHOODER": "Vui lòng nhập số điện thoại!",
          "DETAIL_ADDRESS_PLACEHOODER": "Vui lòng nhập địa chỉ!",
          "DETAIL_AVARTA_PLACEHOODER": "Vui lòng chọn avatar!",
          "DETAIL_SELECT_PLACEHOODER": "Chọn ảnh!",
          "DETAIL_USER_APPLY": "Cập nhật",
          "SEARCH": "Tìm kím",
          "RESET": "Làm mới",
          "CLOSE": "Đóng",
        },
         PAYMENT: {
          "TITLE": "Thanh toán",
          "CHOOSE_PAYMENT_METHOD": "Chọn phương thức thanh toán",
          "FAST_GO_JECT": "Giao hàng tiết kiệm",
          "CHOOSE_DELIVERED_METHOD": "Chọn phương thức vận chuyển",
          "COD": "Thanh toán khi nhận hàng",
          "PAYPAL": "thanh toán với PayPal",
          "QR_CODE": "Thanh toán bằng mã QR",
          "ORDER_NOW": "Đặt hàng",
          "ADDRESS": "Địa chỉ",
          "CHANGE": "Thay đổi",
          "UPDATE_SHIPPING_ADDRESS": "Cập nhật địa chỉ giao hàng",
          "NAME": "Tên",
          "CITY": "Thành phố",
          "PHONE": "Số điện thoại",
          "SUBTOTAL": "Tống số tiền",
          "DISCOUNT": "Giảm giá",
          "DELIVERY_COST": "Phí vận chuyển",
          "TOTAL": "Tổng tiền",
          "VAT": "(Bao gồm phí VAT nếu có)",
          "PAY_WITH_QR": "Thanh toán bằng mã QR",
          "TILE_QR_CODE": "Mời bạn thanh toán bằng QR code",
          "MESS_PLS": "Vui lòng thanh toán sau",
          "PAY_SUCCESS": "thanh toán thành công",
          "PAY_QR_CODE_FAIL": "Thời gian thanh toán đã hết. Vui lòng thử lại!",
          "ORDER_SUCCESS": "Đặt hàng thành công",
          "MESS_ERR_ORDER": "Có lỗi trong quá trình đặt hàng",

          "PLACEHOODER_ADDRESS": "Vui lòng nhập địa chỉ",
          "PLACEHOODER_NAME": "Vui lòng nhập địa chỉ",
          "PLACEHOODER_CITY": "Thành phố",
          "PLACEHOODER_PHONE": "Số điện thoại",
        },
         ORDER_SUCCESS: {
          "TITLE": "Đặt hàng thành công",
          "TITLE_SHIPPING": "Phương thức vận chuyển",
          "TITLE_PAYMENT": "Phương thức thanh toán",
          "FAST_GO_JECT": "Giao hàng tiết kiệm",
          "PRICE": "Giá",
          "TOTAL": "Tổng tiền",
          "QUANTITY": "Số lượng",
        },
        ORDER_DETAIL: {
          "TITLE": "Chi tiết đơn hàng",
          "RECEPTION_ADDRESS": "Địa chỉ của người nhận",
          "ADDRESS": "Địa chỉ:",
          "PHONE_NUMBER": "Số điện thoại:",
          "SHIPPING_METHOD": "Phương thức giao hàng",
          "PAYMENT_METHOD": "Phương thức thanh toán",
          "FAST": "Giao hàng tiết kiệm",
          "SHIPPING_COST": "Phí giao hàng",
          "COD": "Thanh toán khi nhận hàng",
          "PAID": "Đã trả",
          "UNPAID": "Chưa trả",
          "PRODUCT": "Sản phẩm",
          "PRICE": "Giá",
          "QUANTITY": "Số lượng",
          "DISCOUNT": "Giảm giá",
          "SUBTOTAL": "Tổng tiền",
          "TOTAL": "Tổng số"
        },
        CONSTANT: {
          'LATER_MONEY': 'Thanh toán khi nhận hàng',
          'PAYPAL': 'thanh toán bằng Paypal',
          'QR_CODE': 'thanh toán bằng mã QR',
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