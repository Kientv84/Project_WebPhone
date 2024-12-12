import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  const { id } = useParams();

  return (
    <div
      style={{
        padding: "0.1px 100px",
        background: "#efefef",
        height: "auto",
        marginTop: "60px",
      }}
    >
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
