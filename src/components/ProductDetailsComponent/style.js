import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36, 36, 36);
    font-size: 24px;
    font-weight: 500;
    line-height: 150%;
    word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`

export const WrapperPriceProduct = styled.div`
    display: flex;
    flex-direction: column;
    background: rgb(250, 250 250);
    gap: 2px;
`

export const WrapperPriceTextProduct = styled.h1`
    display: flex;
    align-items: center;
    color: rgb(39, 39, 42);
    gap: 8px;
    font-size: 32px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 500;
    padding: 10px;
    margin-top: 10px;
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        Font-weight: 500;
        white-space: nowrap;
        color: rgb(39, 39, 42);
        overflow: hidden;
        /* text-overflow: ellipsisl */
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    };
    span.change-address {
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }

`
export const WrapperQualityProduct = styled.h1`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    };
`
//css-dev-only-do-not-override-1ck3jst sc-csKJRI daMesu