// ** MUI Imports   
import React from 'react';
import { Table } from 'antd';
import { useTranslation } from "react-i18next";

const DashboardTable = ({ orders }) => {

    const { t } = useTranslation();

  // Hàm tính toán sản phẩm bán chạy
  const calculateBestSellingProducts = (orders) => {
    const productCount = {};

    // Đếm số lượng sản phẩm trong orders
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productName = item.name; // Lấy tên sản phẩm từ item.name

        // Cộng dồn số lượng bán của sản phẩm
        if (productCount[productName]) {
          productCount[productName].count += 1; // Cộng thêm số lần mua
        } else {
          productCount[productName] = {
            name: productName, // Lưu tên sản phẩm
            count: 1, // Khởi tạo số lượng
          };
        }
      });
    });

    // Chuyển đổi đối tượng thành mảng và sắp xếp theo số lượng giảm dần
    const bestSellingProducts = Object.values(productCount)
      .sort((a, b) => b.count - a.count);

    return bestSellingProducts.slice(0, 3); // Lấy 3 sản phẩm bán chạy nhất
  };

  // Hàm tính toán sản phẩm ít bán
  const calculateLeastSellingProducts = (orders) => {
    const productCount = {};

    // Đếm số lượng sản phẩm trong orders
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productName = item.name; // Lấy tên sản phẩm từ item.name

        // Cộng dồn số lượng bán của sản phẩm
        if (productCount[productName]) {
          productCount[productName].count += 1; // Cộng thêm số lần mua
        } else {
          productCount[productName] = {
            name: productName, // Lưu tên sản phẩm
            count: 1, // Khởi tạo số lượng
          };
        }
      });
    });

    // Chuyển đổi đối tượng thành mảng và sắp xếp theo số lượng tăng dần
    const leastSellingProducts = Object.values(productCount)
      .sort((a, b) => a.count - b.count);

    return leastSellingProducts.slice(0, 3); // Lấy 3 sản phẩm ít bán nhất
  };

  // Gọi hàm tính toán
  const bestSellingProducts = calculateBestSellingProducts(orders);
  const leastSellingProducts = calculateLeastSellingProducts(orders);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{t('DASHBOARD.TABLE_TITLE_1')}</h2>
      <Table
        dataSource={bestSellingProducts.map((product, index) => ({
          ...product,
          top: index + 1, // Thêm cột Top
        }))}
        columns={[
          {
            title: t('DASHBOARD.TABLE_TOP'),
            dataIndex: 'top',
            key: 'top',
            render: text => <span style={{ color: 'red', fontWeight: 'bold' }}>{text}</span>, // Styled nổi bật
          },
          {
            title:  t('DASHBOARD.TABLE_NAME'),
            dataIndex: 'name',
            key: 'name',
            render: text => <span style={{ fontWeight: 'bold' }}>{text}</span>,
          },
          {
            title: t('DASHBOARD.TABLE_QUAN'),
            dataIndex: 'count',
            key: 'count',
            align: 'center', // Canh giữa số lượng
            render: count => <span style={{ color: '#3f8600' }}>{count}</span>,
          },
        ]}
        pagination={false} // Tắt phân trang
        rowKey="name" // Sử dụng tên sản phẩm làm khóa
        bordered // Thêm viền cho bảng
        style={{ backgroundColor: '#fff' }} // Màu nền cho bảng
      />

      <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>{t('DASHBOARD.TABLE_TITLE_2')}</h2>
      <Table
        dataSource={leastSellingProducts.map((product, index) => ({
          ...product,
          rank: index + 1, // Thêm cột Rank
        }))}
        columns={[
          {
            title: t('DASHBOARD.TABLE_TOP'),
            dataIndex: 'rank',
            key: 'rank',
            render: text => <span style={{ color: 'blue', fontWeight: 'bold' }}>{text}</span>, // Styled nổi bật
          },
          {
            title: t('DASHBOARD.TABLE_NAME'),
            dataIndex: 'name',
            key: 'name',
            render: text => <span style={{ fontWeight: 'bold' }}>{text}</span>,
          },
          {
            title:  t('DASHBOARD.TABLE_QUAN'),
            dataIndex: 'count',
            key: 'count',
            align: 'center', // Canh giữa số lượng
            render: count => <span style={{ color: '#ff4d4f' }}>{count}</span>,
          },
        ]}
        pagination={false} // Tắt phân trang
        rowKey="name" // Sử dụng tên sản phẩm làm khóa
        bordered // Thêm viền cho bảng
        style={{ backgroundColor: '#fff' }} // Màu nền cho bảng
      />
    </div>
  );
};

export default DashboardTable;
 
