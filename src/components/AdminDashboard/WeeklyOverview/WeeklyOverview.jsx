import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";
import { Card, Typography, Row, Col, Spin, Alert } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

const StatisticsCardContainer = styled(Card)`
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

const StatisticsCard = ({ orders }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (orders) {
      const revenueByWeek = {};
      orders.forEach((order) => {
        const weekStart = getStartOfWeek(new Date(order.createdAt));
        if (!revenueByWeek[weekStart]) {
          revenueByWeek[weekStart] = 0;
        }
        revenueByWeek[weekStart] += order.totalPrice;
      });

      const weeklyArray = Object.entries(revenueByWeek).map(
        ([date, revenue]) => ({
          week: date,
          value: revenue,
        })
      );

      setWeeklyData(weeklyArray);
      setAverageRevenue(
        // weeklyArray.reduce((acc, item) => acc + item.value, 0) / weeklyArray.length || 0 // Đảm bảo không chia cho 0
        Math.ceil(
          weeklyArray.reduce((acc, item) => acc + item.value, 0) /
            weeklyArray.length || 0
        )
      );
    }
  }, [orders]);

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return startOfWeek.toLocaleDateString();
  };

  const props = {
    data: weeklyData,
    xField: "week",
    yField: "value",
    xAxis: {
      title: {
        text: "Tuần",
      },
      label: {
        formatter: (text) => `Tuần ${new Date(text).toLocaleDateString()}`,
      },
    },
    yAxis: {
      title: {
        text: "Doanh thu (VNĐ)",
      },
      label: {
        formatter: (value) => `${value.toLocaleString()} VNĐ`,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: "Doanh thu",
          value: `${datum.value.toLocaleString()} VNĐ`,
        };
      },
    },
  };

  if (!orders) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  return (
    <StatisticsCardContainer>
      <Title level={4}>{t("DASHBOARD.WEEKLY_TITLE")}</Title>
      <Paragraph>
        {t("DASHBOARD.WEEKLY_AVG")}{" "}
        <strong>{averageRevenue.toLocaleString()} VNĐ</strong>
      </Paragraph>
      <Line {...props} />
      <Row gutter={16} style={{ marginTop: "20px" }}>
        {weeklyData.map((item, index) => (
          <Col span={6} key={index}>
            <WeekRevenue>
              {t("DASHBOARD.WEEKLY_START")} {item.week}
              <br />
              {t("DASHBOARD.WEEKLY_TOTAL")} {item.value.toLocaleString()} VNĐ
            </WeekRevenue>
          </Col>
        ))}
      </Row>
    </StatisticsCardContainer>
  );
};

export default StatisticsCard;
