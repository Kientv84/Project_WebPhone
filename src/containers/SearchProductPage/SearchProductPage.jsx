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

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();
  };

  const fetchProductType = useCallback(
    async (query, page, limit) => {
      setLoading(true);
      try {
        // Thử tìm kiếm với từ khóa gốc trước
        const res = await ProductService.getProductSearch(query, page, limit);
        if (res?.status === "OK" && res?.data.length === 0) {
          // Nếu không có kết quả, tìm kiếm với từ khóa đã chuẩn hóa
          const normalizedQuery = removeVietnameseTones(query.toLowerCase());
          const resNormalized = await ProductService.getProductSearch(
            normalizedQuery,
            page,
            limit
          );
          if (resNormalized?.status === "OK") {
            setProducts(resNormalized?.data);
            setPanigate({ ...panigate, total: resNormalized?.totalPage });
          } else {
            setProducts([]);
          }
        } else {
          setProducts(res?.data || []);
          setPanigate({ ...panigate, total: res?.totalPage });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Đảm bảo đặt lại sản phẩm khi gặp lỗi
      }

      setLoading(false);
    },
    [panigate]
  );

  useEffect(() => {
    if (query.trim()) {
      // Thực hiện tìm kiếm với từ khóa gốc (có dấu) trước
      fetchProductType(query, panigate.page, panigate.limit).then((res) => {
        if (res?.status === "OK" && res?.data.length === 0) {
          // Nếu không có kết quả, tìm kiếm với từ khóa đã chuẩn hóa (không dấu)
          const normalizedQuery = removeVietnameseTones(query.toLowerCase());
          fetchProductType(normalizedQuery, panigate.page, panigate.limit);
        }
      });
    } else {
      // Nếu query rỗng, chỉ hiển thị thông báo
      setProducts([]);
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
            {query.trim() === "" ? (
              // Hiển thị khi không có từ khóa tìm kiếm
              <div className="container_searchnotfound">
                <h1 className="search-result">
                  Tìm thấy <strong>{products?.length}</strong> sản phẩm cho từ
                  khoá ''
                </h1>
                <p>Không có kết quả bạn cần tìm</p>
              </div>
            ) : (
              // Hiển thị kết quả tìm kiếm khi có từ khóa
              <>
                <h1 className="search-result">
                  Tìm thấy <strong>{products?.length}</strong> sản phẩm cho từ
                  khoá
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
                total={panigate?.total}
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
