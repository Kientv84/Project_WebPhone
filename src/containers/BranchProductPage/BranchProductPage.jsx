import React, { useCallback } from "react";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row } from "antd";
import { WrapperProducts } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

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
                          branch={product.branch}
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
          <div>
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
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default BranchProductPage;
