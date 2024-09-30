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

//header
export const WrapperHeader = styled(Row)`
  background-color: #42c8b7;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
  padding: 10px 0;
`;

export const WrapperTextHeader = styled(Link)`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  &:hover {
    font-size: 18px;
    color: #fff;
  }
`;

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  max-width: 200px;
`;

export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  white-space: nowrap;
`;
export const WrapperTextHeaderSmall1 = styled.span`
  font-size: 14px;
  white-space: nowrap;
  margin-left: 5px;
  color: #fff;
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  &:hover {
    color: #42c8b7;
  }
`;
