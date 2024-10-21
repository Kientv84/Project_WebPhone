import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px
    }
    position: relative;
    background-color: ${props => props.disable ? '#ccc' : '#fff'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
     
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng chuyển đổi cho transform và box-shadow */

    /* Hiệu ứng khi di chuột vào */
    &:hover {
        transform: scale(1.05); /* Tăng kích thước nhẹ khi di chuột vào */
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3); /* Bóng đổ đậm hơn khi di chuột */
        background-color: rgba(255, 255, 255, 0.9); /* Thay đổi màu nền nhẹ hơn */
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: rgb(39, 39, 42);
`

export const WrapperReportText = styled.div`
    font-size: 12px;
    color: (128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 4px;
`

export const WrapperPriceText = styled.div`
    font-size: 16px;
    line-height: 150%;
    font-weight: 500;
    color: rgb(255, 66, 78);
    align-items: center;
    margin: 8px 0 4px
`

export const WrapperDiscountText = styled.span`
    font-size: 12px;
    line-height: 150%;
    font-weight: 500;
    color: rgb(255, 66, 78);
`

export const WrapperStyleTextSell = styled.span`
    font-size: 14px;
    line-height: 24px;
    color: rgb(120, 120, 120);
` 