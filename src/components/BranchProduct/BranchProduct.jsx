import React from "react";
import { WrapperBranch } from "./styled";
import { useNavigate } from "react-router-dom";
import SamsungBrand from "../../assets/images/Samsung_brand.png";
import XiaomiBrand from "../../assets/images/Xiaomi_brand.png";
import AsusBrand from "../../assets/images/Asus_Brand.png";
import DJLbrand from "../../assets/images/DJI_brand.png";
import OppoBrand from "../../assets/images/Oppo_brand.png";
import SonyBrand from "../../assets/images/Sony_brand.png";
import LGbrand from "../../assets/images/LG_brand.png";
import AppleBrand from "../../assets/images/Apple_brand.png";
import LogitechBrand from "../../assets/images/Logitech_brand.png";
import HuaweiBrand from "../../assets/images/Huawei_brand.png";
import JBLBrand from "../../assets/images/JBL-Brand.png";

const BranchProduct = ({ name }) => {
  const navigate = useNavigate();

  const handleNavigateBranch = (branch) => {
    navigate(
      `/product/branch/${branch
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: branch }
    );
  };

  const getBrandImage = (brandName) => {
    switch (brandName) {
      case "Samsung":
        return SamsungBrand;
      case "Apple":
        return AppleBrand;
      case "Xiaomi ":
        return XiaomiBrand;
      case "SONY":
        return SonyBrand;
      case "DJI":
        return DJLbrand;
      case "Huawei":
        return HuaweiBrand;
      case "JBL":
        return JBLBrand;
      case "LG":
        return LGbrand;
      case "ASUS":
        return AsusBrand;
      case "Logitech":
        return LogitechBrand;
      case "Oppo":
        return OppoBrand;
      default:
        return null;
    }
  };

  return (
    <WrapperBranch onClick={() => handleNavigateBranch(name)}>
      {getBrandImage(name) && (
        <img
          src={getBrandImage(name)}
          alt={`${name} Brand`}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "contain" /* Đảm bảo ảnh vừa khung và không bị méo */,
          }}
        />
      )}
    </WrapperBranch>
  );
};

export default BranchProduct;
