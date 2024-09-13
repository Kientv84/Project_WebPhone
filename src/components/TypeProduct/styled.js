import styled from "styled-components";

export const WrapperType = styled.div`
    display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eaeaea; /* Đường viền giữa các items */
  cursor: pointer;

  &:hover {
    color: #fff;
    background-color: rgb(66, 200, 183); /* Hiệu ứng hover */
  }

  &:last-child {
    border-bottom: none; /* Không có đường viền cho item cuối */
  }
`