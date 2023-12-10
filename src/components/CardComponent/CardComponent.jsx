import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons';
import logochinhhang from '../../assets/images/chinhhang.png';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
  const { image, name, price, rating, discount, sold, id } = props
  // console.log('props', props)
  const navigate = useNavigate()
  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCardStyle
      hoverable
      headStyle={{ width: '200px', height: '200px' }}
      style={{ width: 200 }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailProduct(id)}
    // disable={countInStock === 0}
    >
      <img
        src={logochinhhang}
        alt={''}
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
          <span>{rating} </span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
        </span>
        <WrapperStyleTextSell> | Sold {sold || 0}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
        <WrapperDiscountText>
          - {discount || 5} %
        </WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent