import React, { Fragment } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavbar, WrapperProducts } from './style'

const TypeProductPage = () => {
    const onChange = () => {}
    return (
        <div style={{ padding: '0 120px', backgroundColor: '#efefef',}}>
            <Row style={{ flexWrap: 'nowrap', paddingTop: '10px'}}>
            <WrapperNavbar span={6}>
                <NavbarComponent />
            </WrapperNavbar>
            <Col span={20}>
                <WrapperProducts >
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                    <CardComponent />
                </WrapperProducts>
                <Pagination defaultCurrent={2} total={100} onChange={onChange} style={{ textAlign: 'center', marginTop: '10px'}}/>
            </Col>
            </Row>
        </div>
  )
}

export default TypeProductPage