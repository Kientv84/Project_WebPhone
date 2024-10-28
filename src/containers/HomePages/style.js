import styled, { keyframes } from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Button } from "antd";

export const WrapperBranchProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: flex-start;
  height: 55px;
`;
export const WrapperTypeProduct = styled.div`
  background-color: #fff;
  border-radius: 10px;
  left: 0;
  /* min-height: 375px; */
  overflow: hidden;
  padding: 0;
  top: 0;
  width: 190px;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
      color: #fff;
    }
  }
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointers")};
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const WrapperFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: flex-start;
  height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 25px;
  border: 2px solid #d9d9d9; /* Tạo viền với màu xám */
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #ccc;
  }
`;

export const Wrapper = styled.div`
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
`;

export const PriceTag = styled(Button)`
  margin: 5px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  &:hover {
    border-color: #1890ff;
    color: #1890ff;
  }
`;

export const PriceLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

export const PriceRangeWrapper = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const PriceInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-bottom: 20px;
`;

export const PriceInput = styled.input`
  width: 100px;
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  text-align: right;
`;

export const TextBrand = styled.span`
  font-weight: bold; /* In đậm */
  color: #d32f2f; /* Màu đỏ đậm */
  font-size: 1em; /* Giảm kích thước chữ xuống */
  text-transform: uppercase; /* Chữ in hoa */
  margin: 10px 0; /* Khoảng cách trên/dưới */
  letter-spacing: 1px; /* Khoảng cách giữa các ký tự */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Bóng chữ */
  display: inline-block; /* Hiển thị như một khối nội tuyến để căn giữa */
  padding: 5px 10px; /* Khoảng đệm */
  animation: flickerAnimation 1s infinite alternate; /* Hiệu ứng nhấp nháy */
  transition: font-size 0.3s ease; /* Hiệu ứng chuyển đổi kích thước chữ */

  /* Định nghĩa animation nhấp nháy */
  @keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: 0.9;
    }
    100% {
      opacity: 1;
    }
  }

  /* Hiệu ứng khi di chuột vào */
  &:hover {
    /* font-size: 1.2em; */
    cursor: pointer;
    transform: scale(1.2);
    color: #ff5722; /* Thay đổi màu khi di chuột vào */
    text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5); /* Tăng bóng chữ khi di chuột */
  }
`;

export const WrapperBrandBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const BrandBox = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #dfe6e9;
  }
`;
