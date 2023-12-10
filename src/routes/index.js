import AdminPage from "../containers/AdminPage/AdminPage";
import DetailsOrderPage from "../containers/DetailsOrderPage/DetailsOrderPage";
import ForgotPassPage from "../containers/ForgotPassPage/ForgotPassPage.jsx";
import HomePage from "../containers/HomePages/HomePage";
import MyOrderPage from "../containers/MyOrderPage/MyOrderPage";
import NotFoundPage from "../containers/NotFoundPage/NotFoundPage";
import OrderPage from "../containers/OrderPage/OrderPage";
import OrderSuccess from "../containers/OrderSuccess/OrderSuccess";
import PasswordReset from "../containers/PasswordReset/PasswordReset.jsx";
import PaymentPage from "../containers/PaymentPage/PaymentPage";
import ProductsPage from "../containers/ProducsPages/ProductsPage";
import ProductDetailsPage from "../containers/ProductDetailsPage/ProductDetailsPage";
import ProfilePage from "../containers/ProfilePage/ProfilePage";
import SignInPage from "../containers/SignInPage/SignInPage";
import SignUpPage from "../containers/SignUpPage/SignUpPage";
import TypeProductPage from "../containers/TypeProductPage/TypeProductPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: false,
        isShowFooter: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true

    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true

    },
    {
        path: '/order-success',
        page: OrderSuccess,
        isShowHeader: true

    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true

    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true

    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: true

    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: true

    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFooter: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true

    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true

    },
    {
        path: '/forgot-password',
        page: ForgotPassPage,
        isShowHeader: true

    },
    {
        path: '/reset-password/:id/:token',
        page: PasswordReset,
        isShowHeader: true

    },
    {
        path: '*',
        page: NotFoundPage
    },
]