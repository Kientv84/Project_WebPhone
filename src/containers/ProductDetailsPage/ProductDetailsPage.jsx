import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ padding: '0.1px 100px', background: '#efefef', height: '1000px' }}>
      <div style={{ width: '1270px', height: '100%', margin: '0 auto' }} >
        <h5 style={{ fontWeight: 'normal', marginTop: '5px', fontSize: '13px' }} > <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} onClick={() => { navigate('/') }}>Trang chủ</span> - Chi tiết sản phẩm</h5>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage