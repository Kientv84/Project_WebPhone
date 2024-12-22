import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { WrapperProducts } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import "./SearchProductPage.css";
import { useTranslation } from "react-i18next";

const SearchProductPage = () => {
  const [searchParams] = useSearchParams(); // Lấy giá trị từ query string
  const query = searchParams.get("q");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 18,
    total: 1,
  });

  const fetchProductType = useCallback(
    async (query, page, limit) => {
      setLoading(true);
      try {
        const res = await ProductService.getProductSearch(query, page, limit);
        if (res?.status === "OK") {
          setLoading(true);
          setProducts(res.data);
          setTotalProducts(res.total);
          setPanigate({
            ...panigate,
            total: res.totalPage,
          });
        } else {
          setProducts([]);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalProducts(0);
      }
      setLoading(false);
    },
    [panigate]
  );

  useEffect(() => {
    if (query.trim()) {
      fetchProductType(query, panigate.page, panigate.limit);
    } else {
      setProducts([]);
      setTotalProducts(0);
    }
  }, [query, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };

  return (
    <Loading isLoading={loading}>
      <div
        style={{
          width: "100vw",
          background: "#efefef",
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
            {t("SEARCHPRODUCT.BACK_HOMEPAGE")}
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
            {t("SEARCHPRODUCT.SEARCH_RESULT")} "{query}"
          </span>
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
            {loading ? (
              <div></div>
            ) : query.trim() === "" || products?.length === 0 ? (
              <div className="container_searchnotfound">
                <h1 className="search-result">
                  {t("SEARCHPRODUCT.FIND")} <strong>0</strong>{" "}
                  {t("SEARCHPRODUCT.KEY_WORD")}
                  <strong> '{query}' </strong>
                </h1>
                <p> {t("SEARCHPRODUCT.NO_RESULT")}</p>
              </div>
            ) : (
              <>
                <h1 className="search-result">
                  {t("SEARCHPRODUCT.FIND")} <strong>{totalProducts}</strong>{" "}
                  {t("SEARCHPRODUCT.KEY_WORD")}
                  <strong> '{query}' </strong>
                </h1>

                <Row
                  style={{
                    flexWrap: "nowrap",
                  }}
                >
                  <Col>
                    <WrapperProducts
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {products?.map((product) => {
                        return (
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
                        );
                      })}
                    </WrapperProducts>
                  </Col>
                </Row>
              </>
            )}
          </div>
          {products.length > 0 && (
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
          )}
        </div>
      </div>
    </Loading>
  );
};

export default SearchProductPage;
