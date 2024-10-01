import React from "react";
import { WrapperType } from "./styled";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name, imageIcon }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  return (
    <>
      <WrapperType onClick={() => handleNavigateType(name)}>
        {imageIcon && (
          <img
            src={imageIcon}
            alt={`${name} icon`}
            style={{
              marginRight: "10px",
              width: "25px",
              height: "25px",
              objectFit: "cover",
            }}
          />
        )}
        {name}
      </WrapperType>
    </>
  );
};

export default TypeProduct;
