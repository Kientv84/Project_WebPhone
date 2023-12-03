import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ padding: '0.1px 100px', background: '#efefef', height: '1000px' }}>
      <h5 style={{ fontWeight: 'normal', marginTop: '5px', fontSize: '13px' }} > <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} onClick={() => { navigate('/') }}>Home Page</span> - Product Information</h5>
      <ProductDetailsComponent idProduct={id} />
    </div>
  )
}

export default ProductDetailsPage