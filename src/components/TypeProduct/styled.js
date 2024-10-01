import styled from "styled-components";

export const WrapperType = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500; /* In đậm */
  font-size: 14px; /* Kích thước chữ */
  line-height: 1.5;
  min-height: 31.3px;
  -webkit-text-decoration: none;
  text-decoration: none;
  padding: 0 10px;

  &:hover {
    color: #fff;
    background-color: rgb(66, 200, 183); /* Hiệu ứng hover */
  }

  &:last-child {
    border-bottom: none; /* Không có đường viền cho item cuối */
  }
`;
