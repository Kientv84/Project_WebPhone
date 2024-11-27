import React, { useCallback } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Popover, Row, Slider } from "antd";
import {
  PriceInput,
  PriceInputWrapper,
  PriceLabel,
  PriceRangeWrapper,
  PriceTag,
  Wrapper,
  WrapperFilter,
  WrapperProducts,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { FilterOutlined } from "@ant-design/icons";

const BranchProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 18,
    total: 1,
  });

  const [priceRange, setPriceRange] = useState([1000, 10000000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSlider, setShowSlider] = useState(true);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchProductBranch = useCallback(
    async (branch, page, limit) => {
      setLoading(true);
      const res = await ProductService.getProductBranch(branch, page, limit);
      if (res?.status === "OK") {
        setLoading(false);
        setProducts(res?.data);
        setPanigate({ ...panigate, total: res?.totalPage });
      } else {
        setLoading(false);
      }
    },
    [panigate]
  );

  useEffect(() => {
    if (state) {
      fetchProductBranch(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };

  const FilterPopupContent = () => {
    const handlePriceFilter = (minPrice, maxPrice) => {
      setPriceRange([minPrice, maxPrice]);
      filterProductsByPrice(minPrice, maxPrice); // gọi hàm lọc sản phẩm
      // setShowSlider(false);
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
              max={70000000}
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
      </Wrapper>
    );
  };

  const filterProductsByPrice = (minPrice, maxPrice) => {
    if (!products || !products.length) {
      setFilteredProducts([]); // Đảm bảo rằng danh sách lọc là rỗng nếu không có sản phẩm
      return;
    }

    const filtered = products.filter((product) => {
      const price = parseFloat(product.price); // Chuyển giá trị price thành số (nếu cần)
      return price >= minPrice && price <= maxPrice;
    });

    setFilteredProducts(filtered); // Cập nhật danh sách đã lọc
  };

  const handlePopoverClick = (visible) => {
    setIsPopoverOpen(visible); // Cập nhật trạng thái mở/đóng của popover
    if (visible) {
      setShowSlider(true); // Hiển thị lại slider khi popover mở
    }
  };

  return (
    <Loading isLoading={loading}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          //   height: "calc(100vh - 64px)",
          minHeight: "100vh",
          marginTop: "60px",
          paddingBottom: "20px",
        }}
      >
        <div
          style={{
            fontWeight: "normal",
            fontSize: "15px",
            paddingTop: "15px",
            width: "1270px",
            margin: "70px auto 0",
          }}
        >
          {" "}
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              color: "#707070",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            {t("BRANDPRODUCT.BACK_HOMEPAGE")}
          </span>{" "}
          <svg
            style={{
              margin: "0 10px 0 6px",
              width: "14px",
              color: "#707070",
              height: "14px",
              verticalAlign: "middle",
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
            ></path>
          </svg>
          <span
            style={{
              fontSize: "14px", // Kích thước chữ
              fontWeight: "bold", // Kiểu chữ đậm
              color: "#707070", // Màu chữ (ví dụ: đỏ cam)
            }}
          >
            {state}
          </span>
        </div>
        <div
          className="branch-product"
          style={{
            width: "1270px",
            margin: "15px auto 0",
            display: "flex",
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
        </div>
        <div
          style={{
            width: "1270px",
            margin: "0 auto",
            height: "auto",
            minHeight: "calc(100vh - 20px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <div>
            <Row
              style={{
                flexWrap: "nowrap",
                paddingTop: "10px",
              }}
            >
              <Col>
                <WrapperProducts>
                  {(filteredProducts?.length > 0
                    ? filteredProducts
                    : products
                  )?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
                </WrapperProducts>
              </Col>
            </Row>
          </div>
          <div>
            <div
              style={{
                marginTop: "30px",
                display: "flex", // Centering pagination horizontally
                justifyContent: "center",
              }}
            >
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate?.total * panigate.limit}
                pageSize={panigate.limit}
                onChange={onChange}
                style={{
                  textAlign: "center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default BranchProductPage;
