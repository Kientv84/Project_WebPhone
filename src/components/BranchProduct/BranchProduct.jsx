import React from 'react';
import { WrapperBranch } from './styled';
import { useNavigate } from 'react-router-dom';
import SamsungBrand from "../../assets/images/SamsungBrand.png";
import XiaomiBrand from "../../assets/images/XiaomiBrand.png";
import AsusBrand from "../../assets/images/AsusBrand.png";
import DJLbrand from "../../assets/images/DJLbrand.jpg";
import OppoBrand from "../../assets/images/OppoBrand.png";
import SonyBrand from "../../assets/images/SonyBrand.png";
import LGbrand from "../../assets/images/LGbrand.png";
import AppleBrand from "../../assets/images/AppleBrand.png";
import LogitechBrand from "../../assets/images/LogitechBrand.png";
// import XIAOMI from "../../assets/images/XIAOMI.png";

const BranchProduct = ({ name }) => {
  const navigate = useNavigate();
  
  const handleNavigateBranch = (branch) => {
    navigate(`/product/branch/${branch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: branch });
  };

  const getBrandImage = (brandName) => {
    switch (brandName) {
      case 'Samsung':
        return SamsungBrand;
      case 'Apple':
        return AppleBrand;
      case 'Xiaomi ':
        return XiaomiBrand;
      case 'SONY':
        return SonyBrand; 
      case 'DJI':
        return DJLbrand; 
      case 'LG':
        return LGbrand; 
      case 'ASUS':
        return AsusBrand; 
      case 'Logitech':
        return LogitechBrand; 
      case 'Oppo':
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
          style={{ width: '60px', padding: '5px', alignItems: 'center' }} 
        />
      )}
    </WrapperBranch>
  );
};

export default BranchProduct;
