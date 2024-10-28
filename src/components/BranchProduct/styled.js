import styled, { keyframes } from "styled-components";

const blinkAnimation = keyframes`
  0% { opacity: 1; color: rgb(255, 66, 78); transform: scale(0.5); }
  50% { opacity: 0.2; color: rgb(255, 165, 0); transform: scale(0.7); } /* Màu cam và tăng kích thước */
  100% { opacity: 1; color: rgb(255, 66, 78); transform: scale(0.7); }
`;

export const WrapperBranch = styled.div`
  width: 65px; /* Đặt chiều rộng cho khung logo */
  height: 65px; /* Đặt chiều cao cho khung logo */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px; /* Bo tròn cho các thẻ */
  background-color: #f2f2f2; /* Màu nền thẻ */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng */
  font-size: 14px;
  color: #333; /* Màu chữ */
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.9);
  }
`;
