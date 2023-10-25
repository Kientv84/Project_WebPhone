import { Row } from "antd"
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: #42C8B7;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 0;
`

export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    &:hover {
        font-size: 18px;
        color: #fff;
    }
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    max-width: 200px;
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    white-space: nowrap
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: #42C8B7;
    }
`

