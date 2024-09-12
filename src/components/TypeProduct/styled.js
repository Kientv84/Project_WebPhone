import styled from "styled-components";

export const WrapperType = styled.div`
  padding: 8px 16px;
  border-radius: 20px; /* Bo tròn cho các thẻ */
  background-color: #f2f2f2; /* Màu nền thẻ */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng */
  font-size: 14px;
  color: #333; /* Màu chữ */
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e2e2e2; /* Màu khi hover */
  }
`