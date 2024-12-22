import { Button, Col } from "antd";
import styled from "styled-components";

export const WrapperProducts = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`;
export const WrapperBranchProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: 44px;
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

export const TextBrand = styled.span`
  font-weight: bold; /* In đậm */
  color: #d32f2f; /* Màu đỏ đậm */
  font-size: 14px; /* Giảm kích thước chữ xuống */
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

export const Wrapper = styled.div`
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
`;

export const PriceLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

export const PriceRangeWrapper = styled.div`
  margin-top: 15px;
  width: 100%;
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
