import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons';
import logochinhhang from '../../assets/images/chinhhang.png';
import { useNavigate } from 'react-router-dom';

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, selled, discount, id } = props
  const navigate = useNavigate()
  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCardStyle
      hoverable
      headStyle={{ width: '200px', height: '200px' }}
      style={{
        width: 200,
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailProduct(id)}
    >
      <img
        src={logochinhhang}
        style={{
          width: '68px',
          height: '14px',
          position: 'absolute',
          top: -1,
          left: -1,
          borderTopLeftRadius: '3px'
        }}
      />

      <StyleNameProduct> {name} </StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: '4px' }}>
          <span> {rating} </span> <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell>| Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px' }}> {price.toLocaleString()} </span>
        <WrapperDiscountText> - {discount || 5} % </WrapperDiscountText>
      </WrapperPriceText>

    </WrapperCardStyle>
  )
}

export default CardComponent