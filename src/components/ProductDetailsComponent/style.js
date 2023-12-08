import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
    border-radius: 0.5rem
`
export const WrapperStyleImageSmall1 = styled(Image)`
    height: 60px;
    width: 60px;
`

export const WrapperStyleColImage = styled(Col)`
    border: 1px solid #d70018
    flex-basis: unset;
    display: flex;
    justify-content: center;  // Căn giữa ảnh trong Col
    align-items: center;
    border-radius: 0.5rem;
    
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
export const WrapperDecriptionTextProduct = styled.h1`
    display: flex;
    align-items: center;
    color: rgb(39, 39, 42);
    gap: 8px;
    font-size: 20px;
    line-height: 40px;
    margin-right: 8px;
    font-weight: 200;
    padding: 10px;
    margin-top: 3px;
    white-space: pre-line;
    min-height: fit-content;
    transition: min-height 1s ease;
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

export const Box = styled.div`
    border: 1px solid rgb(66, 200, 183);
    border-radius: 10px;
    overflow: hidden;
    width:60%;
    margin-top: 10px
`
export const PromotionHeader = styled.div`
    background-color: rgb(66, 200, 183);
    color: rgb(66, 200, 183);
    gap: 10px;
    height: 42px;
`

export const PromotionHeaderDecription = styled.div`
    color: rgb(66, 200, 183);
    gap: 10px;
    height: 42px;
`

export const IconGift = styled.div`
    align-items: center;
    display: inline-flex;
    height: 1.5rem;
    justify-content: center;
    width: 1.5rem;
    &.icon{
        fill: #fff
    } 
`

export const BoxDecriptionContent = styled.div`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.1), 0 2px 6px 2px rgba(60,64,67,.15);
    display: block;
    margin-bottom: 15px;
    margin-right: auto;
    max-height: 500px;
    min-height: 0;
    overflow: hidden;
    padding: 15px;
    position: relative;
    text-align: justify;
    width: 100%;
    margin-top: 10px
`