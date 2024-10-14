import React, { useEffect } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import BranchProduct from "../../components/BranchProduct/BranchProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
  WrapperBranchProduct,
} from "./style";
import slider1 from "../../assets/images/slider1.webp";
import slider2 from "../../assets/images/slider2.webp";
import slider3 from "../../assets/images/slider3.webp";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { useQuery } from "react-query";
import * as ProductService from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  // const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);
  const [branchProducts, setBranchProducts] = useState([]);
  const { t } = useTranslation();

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") setTypeProducts(res?.data);
  };

  const fetchAllBranchProduct = async () => {
    const res = await ProductService.getAllBranchProduct();
    if (res?.status === "OK") setBranchProducts(res?.data);
  };

  const {
    isLoading,
    data: products,
    isPreviousData,
  } = useQuery(["products", limit, searchDebounce], fetchProductAll, {
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });
  useEffect(() => {
    fetchAllTypeProduct();
    fetchAllBranchProduct();
  }, []);

  const getImageIconByType = (type) => {
    const imageIcons = {
      "HOMEPAGE.PHONE_TABLET":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-3.svg",
      "HOMEPAGE.LAPTOP":
        "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon-cps-380.svg",
      "HOMEPAGE.WATCH":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-610.svg",
      "HOMEPAGE.TELEVISION":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-1124.svg",
      "HOMEPAGE.SOUND":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-220.svg",
      "HOMEPAGE.SCREEN":
        "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon_cpu.svg",
      "HOMEPAGE.ACCESSORY":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-30.svg",
    };

    // Trả về icon hoặc chuỗi rỗng nếu không có icon
    return imageIcons[type] || "";
  };

  const desiredOrder = [
    "HOMEPAGE.PHONE_TABLET",
    "HOMEPAGE.LAPTOP",
    "HOMEPAGE.SOUND",
    "HOMEPAGE.WATCH",
    "HOMEPAGE.ACCESSORY",
    "HOMEPAGE.SCREEN",
    "HOMEPAGE.TELEVISION",
  ]; // Thứ tự mong muốn

  // Sắp xếp typeProducts theo desiredOrder
  const sortedTypeProducts = typeProducts.sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });

  return (
    <div>
      <Loading isLoading={isLoading}>
        <div
          className="body"
          style={{
            width: "100%",
            backgroundColor: "#efefef",
            margin: "0",
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "1270px",
              margin: "65px auto 0",
              gap: "20px",
            }}
          >
            <div className="type-product">
              <div style={{ flex: "2", marginTop: "20px" }}>
                <WrapperTypeProduct>
                  {desiredOrder.map((itemKey) => {
                    const imageIcon = getImageIconByType(itemKey); // Truyền vào khóa dịch để lấy icon
                    return (
                      <TypeProduct
                        name={t(itemKey)} // Sử dụng bản dịch của mục
                        key={itemKey}
                        imageIcon={imageIcon}
                      />
                    );
                  })}
                </WrapperTypeProduct>
              </div>
            </div>

            <div
              className="slider"
              style={{
                flex: "1",
                maxWidth: "80%",
                marginTop: "20px",
                paddingLeft: "20px",
              }}
            >
              <SliderComponent arrImages={[slider1, slider2, slider3]} />
            </div>
          </div>

          <div
            className="branch-product"
            style={{ width: "1270px", margin: "10px auto" }}
          >
            <WrapperBranchProduct>
              {branchProducts.map((item) => {
                return <BranchProduct name={item} key={item} />;
              })}
            </WrapperBranchProduct>
          </div>
          <div
            id="container"
            style={{ height: "auto", width: "1270px", margin: "0 auto" }}
          >
            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    sold={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                );
              })}
            </WrapperProducts>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <WrapperButtonMore
                textbutton={isPreviousData ? "Loading.." : "Load more"}
                type="outline"
                styleButton={{
                  border: "1px solid rgb(10, 104, 255)",
                  color: `${
                    products?.totalProduct === products?.data?.length
                      ? "#ccc"
                      : "rgb(10, 104, 255)"
                  }`,
                  width: "240px",
                  height: "38px",
                  borderRadius: "4px",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
                disabled={
                  products?.totalProduct === products?.data?.length ||
                  products?.totalPage === 1
                }
                styletextbutton={{
                  fontWeight: 500,
                  color:
                    products?.totalProduct === products?.data?.length && "#fff",
                }}
                onClick={() => setLimit((prev) => prev + 6)}
              />
            </div>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default HomePage;
