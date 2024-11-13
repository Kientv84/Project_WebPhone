// ** React Imports
import React, { useEffect } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DepositWithdraw from './DepositWithdraw/DepositWithdraw';
import DashboardTable from './Table/Table';
import StatisticsCard from './WeeklyOverview/WeeklyOverview';

// ** Services & State Management
import { useQuery } from 'react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

const AdminDashboard = () => {
  const user = useSelector((state) => state?.user);

  // Fetch orders data
  const fetchOrderData = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res.data;
  };

  const { isLoading: isLoadingOrders, data: orders } = useQuery(
    ["orders", user?.access_token],
    fetchOrderData,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  // Log dữ liệu orders khi có sự thay đổi
  useEffect(() => {
    console.log('data orders:', orders);
  }, [orders]); // Thêm orders vào dependency array để log mỗi khi orders thay đổi

  // Hiển thị spinner khi dữ liệu đang tải
  if (isLoadingOrders) {
    return <Spin size="large" />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Component StatisticsCard */}
        <Grid item xs={12} md={8}>
          <StatisticsCard orders={orders} />
        </Grid>

        {/* Component DashboardTable */}
        <Grid item xs={12} md={4}>
          <DashboardTable orders={orders} />
        </Grid>
      </Grid>

      {/* Thêm khoảng trống ở dưới để làm cho giao diện đẹp hơn */}
      <Box mt={4}>
        <Grid container spacing={4}>
          {/* Component DepositWithdraw */}
          <Grid item xs={12}>
            <DepositWithdraw 
              orders={orders} 
              shippingCosts={[{ amount: 50000 }, { amount: 30000 }]} // ví dụ chi phí giao hàng
              advertisingCosts={[{ amount: 200000 }, { amount: 100000 }]} // ví dụ chi phí quảng cáo
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
