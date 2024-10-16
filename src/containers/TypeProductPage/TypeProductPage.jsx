import React, { useCallback } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import "./TypeProductPage.css";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);

  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 12,
    total: 1,
  });

  const fetchProductType = useCallback(
    async (type, page, limit) => {
      setLoading(true);
      const res = await ProductService.getProductType(type, page, limit);
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
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };
  return (
    <Loading isLoading={loading}>
      <div className="wrapper-page">
        <div
          style={{
            width: "100vw",
            background: "#efefef",
            //   height: "calc(100vh - 64px)",
            minHeight: "100vh",
            marginTop: "60px",
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
              <Row
                style={{
                  flexWrap: "nowrap",
                  paddingTop: "10px",
                }}
              >
                <Col>
                  <WrapperProducts
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {products
                      ?.filter((pro) => {
                        if (searchDebounce === "") {
                          return true; // Trả về true để giữ lại tất cả các sản phẩm
                        } else if (
                          pro?.name
                            ?.toLowerCase()
                            ?.includes(searchDebounce?.toLowerCase())
                        ) {
                          return true; // Trả về true nếu sản phẩm khớp với tìm kiếm
                        }
                        return false;
                      })
                      ?.map((product) => {
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
            <Pagination
              defaultCurrent={panigate.page + 1}
              total={panigate?.total * panigate.limit}
              pageSize={panigate.limit}
              onChange={onChange}
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
