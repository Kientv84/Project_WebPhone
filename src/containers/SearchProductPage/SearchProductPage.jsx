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
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const fetchProductType = useCallback(
    async (query, page, limit) => {
      setLoading(true);
      const res = await ProductService.getProductSearch(query, page, limit);
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
    if (query) {
      fetchProductType(query, panigate.page, panigate.limit);
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
          //   height: "calc(100vh - 64px)",
          height: "100vh",
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
          }}
        >
          <div>
            <h1 className="search-result">
              Tìm thấy <strong>{products?.length}</strong> sản phẩm cho từ khoá
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
          </div>
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <Pagination
              defaultCurrent={panigate.page + 1}
              total={panigate?.total}
              onChange={onChange}
              style={{
                textAlign: "center",
              }}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default SearchProductPage;
