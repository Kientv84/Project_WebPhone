import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useTranslation } from "react-i18next";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div
      style={{
        padding: "0.1px 100px",
        background: "#efefef",
        height: "auto",
        marginTop: "60px",
      }}
    >
      <h5 style={{ fontWeight: "normal", marginTop: "5px", fontSize: "15px", marginTop:"20px" }}>
        {" "}
        <span
          style={{ cursor: "pointer", fontWeight: "bold", fontSize: "15px" }}
          onClick={() => {
            navigate("/");
          }}
        >
          {t('PRODUCT_DETAILS.BACK_HOMEPAGE')}
        </span>{" "}
        - {t('PRODUCT_DETAILS.PRODUCT_INFOR')}
      </h5>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
