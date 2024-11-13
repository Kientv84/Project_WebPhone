import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FieldNumberOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/AdminOrder/AdminOrder";
import AdminCountInStock from "../../components/AdminCountInStock/AdminCountInStock";
import AdminPromotion from "../../components/AdminPromotion/AdminPromotion.jsx";
import Promotion from "../../assets/images/promotions.svg";

import { useTranslation } from "react-i18next";
import AdminDashboard from "../../components/AdminDashboard/AdminDashboard";

const AdminPage = () => {


  const [keySelected, setKeySelected] = useState("dashboard");

  const { t } = useTranslation();

  const items = [
    getItem(t("DASHBOARD.DASHBOARD"), "dashboard",  <DashboardOutlined />),
    getItem(t("ADMIN.USER"), "user", <UserOutlined />),
    getItem(t("ADMIN.PRODUCT"), "product", <AppstoreOutlined />),
    getItem(t("ADMIN.ORDER"), "order", <ShoppingCartOutlined />),
    getItem(t("ADMIN.QUANLITY_ADMIN"), "quanlity", <FieldNumberOutlined />),
    getItem(
      t("ADMIN.PROMOTION"),
      "promotion",
      <img src={Promotion} alt="Promotion" style={{ width: 20, height: 20 }} />
    ),
  ];


  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser  key="user"/>;
      case "product":
        return <AdminProduct  key="product"/>;
      case "order":
        return <OrderAdmin key="order"/>;
      case "quanlity":
        return <AdminCountInStock key="quanlity"/>;
      case "promotion":
        return <AdminPromotion key="promotion"/>;
      case "dashboard":
        return <AdminDashboard key="dashboard"/>;
      default:
        return <></>;
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart isHiddenCategory />
      <div style={{ display: "flex", marginTop: "80px" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          items={items}
          onClick={handleOnClick}
          selectedKeys={[keySelected]}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
