import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "../../components/LoadingComponent/Loading";
import { WrapperProducts } from "./style";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import "./SearchProductPage.css";

const SearchProductPage = () => {
  const [searchParams] = useSearchParams(); // Lấy giá trị từ query string
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 12,
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
                  Tìm thấy <strong>0</strong> sản phẩm cho từ khoá
                  <strong> '{query}' </strong>
                </h1>
                <p>Không có kết quả bạn cần tìm</p>
              </div>
            ) : (
              <>
                <h1 className="search-result">
                  Tìm thấy <strong>{totalProducts}</strong> sản phẩm cho từ khoá
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
