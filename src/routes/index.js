import HomePage from "../containers/HomePages/HomePage";
import NotFoundPage from "../containers/NotFoundPage/NotFoundPage";
import OrderPage from "../containers/OrderPage/OrderPage";
import ProductsPage from "../containers/ProducsPages/ProductsPage";
import ProductDetailsPage from "../containers/ProductDetailsPage/ProductDetailsPage";
import SignInPage from "../containers/SignInPage/SignInPage";
import SignUpPage from "../containers/SignUpPage/SignUpPage";
import TypeProductPage from "../containers/TypeProductPage/TypeProductPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true

    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true

    },
    {
        path: '/:type',
        page: TypeProductPage,
        isShowHeader: true

    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false

    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false

    },
    {
        path: '/product-details',
        page: ProductDetailsPage,
        isShowHeader: true

    },
    {
        path: '*',
        page: NotFoundPage
    },
]