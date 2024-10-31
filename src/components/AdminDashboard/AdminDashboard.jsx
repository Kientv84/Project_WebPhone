// ** React Imports
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import DepositWithdraw from './DepositWithdraw/DepositWithdraw'
import DashboardTable from './Table/Table'
import StatisticsCard from './WeeklyOverview/WeeklyOverview'


const AdminDashboard = () => {

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Component StatisticsCard */}
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>

        {/* Component DashboardTable */}
        <Grid item xs={12} md={4}>
          <DashboardTable />
        </Grid>
      </Grid>

      {/* Thêm khoảng trống ở dưới để làm cho giao diện đẹp hơn */}
      <Box mt={4}>
        <Grid container spacing={4}>
          {/* Component DepositWithdraw */}
          <Grid item xs={12}>
            <DepositWithdraw />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AdminDashboard
