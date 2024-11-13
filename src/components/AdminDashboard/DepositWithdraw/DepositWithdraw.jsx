import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { PieChart } from 'react-minimal-pie-chart';
import { useTranslation } from "react-i18next";

const DepositWithdraw = ({ orders }) => {

    const { t } = useTranslation();


  // Tổng số đơn hàng
  const totalOrders = orders.length;

  // Số đơn hàng theo trạng thái
  const orderStatusCount = orders.reduce((acc, order) => {
    acc[order.isDelivered] = (acc[order.isDelivered] || 0) + 1;
    return acc;
  }, {});

  // Biểu đồ loại thanh toán
  const paymentMethodsCount = orders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
    return acc;
  }, {});

  const paymentMethodsData = Object.entries(paymentMethodsCount).map(([key, value]) => ({
    title: key,
    value,
  }));

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('DASHBOARD.DEPOSIT_TITLE')}</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title={t('DASHBOARD.DEPOSIT_TOTAL')} value={totalOrders} />
          </Card>
        </Col>
        {Object.keys(orderStatusCount).map((status) => (
          <Col span={8} key={status}>
            <Card>
              <Statistic title={`Đơn Hàng ${status}`} value={orderStatusCount[status]} />
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>{t('DASHBOARD.DEPOSIT_CHART')}</h3>
        <PieChart
          data={paymentMethodsData.map(({ title, value }) => ({
            title,
            value,
            color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
          }))}
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />
      </div>
    </div>
  );
};

export default DepositWithdraw;
