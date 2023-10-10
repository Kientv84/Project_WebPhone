import React from 'react'
import ProductDetailsComponent from '../../componets/ProductDetailsComponent/ProductDetailsComponent'

const ProductDetail = () => {
    return (
        <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
            <h5 style={{fontSize: '15px'}}>Trang Chủ</h5>
            <div >
                <ProductDetailsComponent />
            </div>

        </div>
    )
}

export default ProductDetail
