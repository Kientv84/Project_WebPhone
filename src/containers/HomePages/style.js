import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Row } from "antd";
import { Link } from "react-router-dom";

export const WrapperBranchProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  height: 44px;
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
