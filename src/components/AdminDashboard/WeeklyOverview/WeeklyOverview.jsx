import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import { useQuery } from 'react-query';
import * as OrderService from '../../../services/OrderService';
import { useSelector } from 'react-redux';
import { Card, Typography, Row, Col, Spin } from 'antd';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const StatisticsCardContainer = styled(Card)`
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const WeekRevenue = styled.div`
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  font-size: 16px;
  color: #1890ff; // Màu xanh của Ant Design
`;

const StatisticsCard = () => {
  const user = useSelector((state) => state?.user);
  const [weeklyData, setWeeklyData] = useState([]);
  const [averageRevenue, setAverageRevenue] = useState(0);

  const fetchOrderData = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res.data.map(order => ({
      date: new Date(order.createdAt),
      totalPrice: order.totalPrice,
    }));
  };

  const { isLoading: isLoadingOrders, data: orders } = useQuery(
    ["orders", user?.access_token], // thêm access_token vào queryKey
    fetchOrderData,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (orders) {
      const revenueByWeek = {};
      orders.forEach(order => {
        const weekStart = getStartOfWeek(order.date);
        if (!revenueByWeek[weekStart]) {
          revenueByWeek[weekStart] = 0;
        }
        revenueByWeek[weekStart] += order.totalPrice;
      });

      const weeklyArray = Object.entries(revenueByWeek).map(([date, revenue]) => ({
        week: date,
        value: revenue,
      }));

      setWeeklyData(weeklyArray);
      setAverageRevenue(
        weeklyArray.reduce((acc, item) => acc + item.value, 0) / weeklyArray.length
      );
    }
  }, [orders]);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Chuyển đổi thành thứ 2
    startOfWeek.setDate(diff);
    return startOfWeek.toLocaleDateString(); // Trả về ngày bắt đầu tuần
  };

  const props = {
    data: weeklyData,
    xField: 'week',
    yField: 'value',
    xAxis: {
      title: {
        text: 'Tuần',
      },
      label: {
        formatter: (text) => `Tuần ${new Date(text).toLocaleDateString()}`,
      },
    },
    yAxis: {
      title: {
        text: 'Doanh thu (VNĐ)',
      },
      label: {
        formatter: (value) => `${value.toLocaleString()} VNĐ`,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: `${datum.value.toLocaleString()} VNĐ`,
        };
      },
    },
  };

  if (isLoadingOrders) {
    return <Spin size="large" />;
  }

  return (
    <StatisticsCardContainer>
      <Title level={4}>Thống kê Doanh thu theo Tuần</Title>
      <Paragraph>
        Doanh thu trung bình mỗi tuần: <strong>{averageRevenue.toLocaleString()} VNĐ</strong>
      </Paragraph>
      <Line {...props} />
      <Row gutter={16} style={{ marginTop: '20px' }}>
        {weeklyData.map((item, index) => (
          <Col span={6} key={index}>
            <WeekRevenue>
              Tuần bắt đầu: {item.week}<br />
              Doanh thu: {item.value.toLocaleString()} VNĐ
            </WeekRevenue>
          </Col>
        ))}
      </Row>
    </StatisticsCardContainer>
  );
};

export default StatisticsCard;
