import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useTranslation } from "react-i18next";
import * as ProductService from "../../services/ProductService";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [productName, setProductName] = useState("");

  const fetchGetDetailsProduct = async (idProduct) => {
    if (idProduct) {
      const res = await ProductService.getDetailsProduct(idProduct);
      if (res?.data) {
        setProductName(res.data.name); // Lưu tên sản phẩm
      }
      return res?.data;
    }
  };

  useEffect(() => {
    if (id) {
      fetchGetDetailsProduct(id);
    }
  }, [id]);

  return (
    <div
      style={{
        padding: "0.1px 100px",
        background: "#efefef",
        height: "auto",
        marginTop: "60px",
      }}
    >
      <h5
        style={{
          fontWeight: "normal",
          marginTop: "5px",
          fontSize: "15px",
          marginTop: "20px",
        }}
      >
        {" "}
        <span
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            color: "#707070",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          {t("PRODUCT_DETAILS.BACK_HOMEPAGE")}
        </span>{" "}
        <svg
          style={{
            margin: "0 10px 0 6px",
            width: "12px",
            height: "12px",
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
            fontSize: "12px", // Kích thước chữ
            fontWeight: "bold", // Kiểu chữ đậm
            color: "#707070", // Màu chữ (ví dụ: đỏ cam)
          }}
        >
          {productName}
        </span>
      </h5>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
