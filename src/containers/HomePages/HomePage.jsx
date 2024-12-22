import React, { useEffect } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import BranchProduct from "../../components/BranchProduct/BranchProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
  WrapperBranchProduct,
  WrapperFilter,
  Wrapper,
  PriceTag,
  PriceLabel,
  PriceRangeWrapper,
  PriceInputWrapper,
  PriceInput,
  TextBrand,
  WrapperBrandBox,
  BrandBox,
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
import { FilterOutlined } from "@ant-design/icons";
import { Popover, Slider, Row, Col } from "antd";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  // const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);
  const [branchProducts, setBranchProducts] = useState([]);
  const { t } = useTranslation();
  const [priceRange, setPriceRange] = useState([1000, 10000000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSlider, setShowSlider] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // Cuộn cả chiều ngang và dọc về đầu trang
  }, [location]);

  const fetchProductAll = async (context) => {
    const limit = (context?.queryKey && context?.queryKey[1]) || 12;
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
  } = useQuery(["products", limit || 12, searchDebounce], fetchProductAll, {
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
      "Phone, Tablet":
        "https://cellphones.com.vn/media/icons/menu/icon-cps-3.svg",
      Laptop:
        "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon-cps-380.svg",
      Watch: "https://cellphones.com.vn/media/icons/menu/icon-cps-610.svg",

      Television:
        "https://cellphones.com.vn/media/icons/menu/icon-cps-1124.svg",
      Sound: "https://cellphones.com.vn/media/icons/menu/icon-cps-220.svg",
      Screen: "https://cdn2.cellphones.com.vn/x/media/icons/menu/icon_cpu.svg",
      Accessory: "https://cellphones.com.vn/media/icons/menu/icon-cps-30.svg",
    };

    // Trả về icon hoặc chuỗi rỗng nếu không có icon
    return imageIcons[type] || "";
  };

  const desiredOrder = [
    "Phone, Tablet",
    "Laptop",
    "Sound",
    "Watch",
    "Accessory",
    "Screen",
    "Television",
  ]; // Thứ tự mong muốn

  // Sắp xếp typeProducts theo desiredOrder
  const sortedTypeProducts = typeProducts.sort((a, b) => {
    return desiredOrder.indexOf(a) - desiredOrder.indexOf(b);
  });

  const FilterPopupContent = () => {
    const handlePriceFilter = (minPrice, maxPrice) => {
      setPriceRange([minPrice, maxPrice]);
      filterProductsByPrice(minPrice, maxPrice); // gọi hàm lọc sản phẩm
    };

    const onSliderChange = (value) => {
      setPriceRange(value); // Cập nhật giá trị priceRange
      filterProductsByPrice(value[0], value[1]); // Lọc sản phẩm theo khoảng giá mới
    };

    return (
      <Wrapper>
        <Row>
          <Col span={24}>
            <PriceLabel> {t("FILTER.PRICE")}</PriceLabel>
          </Col>
          <Col>
            <PriceTag onClick={() => handlePriceFilter(0, 5000000)}>
              {" "}
              {t("FILTER.PRICE_UNDER_5")}
            </PriceTag>
            <PriceTag onClick={() => handlePriceFilter(5000000, 10000000)}>
              {" "}
              {t("FILTER.PRICE_5_TO_10")}
            </PriceTag>
            <PriceTag onClick={() => handlePriceFilter(10000000, 20000000)}>
              {" "}
              {t("FILTER.PRICE_10_TO_20")}
            </PriceTag>
            <PriceTag onClick={() => handlePriceFilter(20000000, 30000000)}>
              {" "}
              {t("FILTER.PRICE_20_TO_30")}
            </PriceTag>
            <PriceTag onClick={() => handlePriceFilter(30000000, 50000000)}>
              {" "}
              {t("FILTER.PRICE_30_TO_50")}
            </PriceTag>
            <PriceTag onClick={() => handlePriceFilter(50000000, 100000000)}>
              {" "}
              {t("FILTER.PRICE_OVER_50")}
            </PriceTag>
          </Col>
        </Row>

        {showSlider && (
          <PriceRangeWrapper>
            <Row>
              <Col span={24}>
                <PriceLabel>{t("FILTER.CHOOSE_PRICE")}</PriceLabel>
              </Col>
            </Row>
            <Slider
              range
              step={500000}
              min={1000}
              max={60000000}
              value={priceRange}
              onChange={onSliderChange}
            />
            <PriceInputWrapper>
              <PriceInput
                value={`${priceRange[0].toLocaleString()}đ`}
                readOnly
              />
              <PriceInput
                value={`${priceRange[1].toLocaleString()}đ`}
                readOnly
              />
            </PriceInputWrapper>
          </PriceRangeWrapper>
        )}

        <Row>
          <Col span={24} style={{ paddingBottom: "20px" }}>
            <PriceLabel>{t("FILTER.CHOOSE_BRAND")}</PriceLabel>
          </Col>
          <Col>
            <WrapperBrandBox>
              {branchProducts.map((item) => {
                return (
                  <BrandBox
                    key={item}
                    onClick={() => filterProductsByBrand(item)}
                  >
                    {item}
                  </BrandBox>
                );
              })}
            </WrapperBrandBox>
          </Col>
        </Row>
      </Wrapper>
    );
  };

  const handlePopoverClick = (visible) => {
    setIsPopoverOpen(visible); // Cập nhật trạng thái mở/đóng của popover
    if (visible) {
      setShowSlider(true); // Hiển thị lại slider khi popover mở
    }
  };

  const filterProductsByPrice = (minPrice, maxPrice) => {
    const filteredProducts = products?.data?.filter((product) => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    // Cập nhật danh sách sản phẩm hiển thị với các sản phẩm đã lọc
    setFilteredProducts(filteredProducts);
  };

  const filterProductsByBrand = (brand) => {
    const filteredProducts = products?.data?.filter((product) => {
      return product.branch === brand;
    });

    // Cập nhật danh sách sản phẩm hiển thị với các sản phẩm đã lọc
    setFilteredProducts(filteredProducts);
  };

  return (
    <div>
      <Loading isLoading={isLoading}>
        <div
          className="body"
          style={{
            width: "100vw",
            backgroundColor: "#efefef",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "1270px",
              margin: "65px auto 0",
              gap: "20px",
              paddingBottom: "20px",
            }}
          >
            <div className="type-product">
              <div style={{ flex: "2", marginTop: "20px" }}>
                <WrapperTypeProduct>
                  {sortedTypeProducts.map((item) => {
                    const imageIcon = getImageIconByType(item);
                    return (
                      <TypeProduct
                        name={item}
                        key={item}
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
            style={{
              width: "1270px",
              margin: "10px auto",
              display: "flex",
              paddingBottom: "20px",
              alignItems: "center",
            }}
          >
            <Popover
              content={FilterPopupContent}
              trigger="click"
              placement="bottomLeft"
              onVisibleChange={handlePopoverClick}
            >
              <WrapperFilter>
                <FilterOutlined /> {t("FILTER.TITLE")}
              </WrapperFilter>
            </Popover>

            <WrapperBranchProduct>
              <TextBrand>{t("HOMEPAGE.BRAND_TEXT")}</TextBrand>
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
              {filteredProducts?.length > 0
                ? filteredProducts.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      branch={product.branch}
                      type={product.type}
                      sold={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))
                : products?.data?.map((product) => {
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
