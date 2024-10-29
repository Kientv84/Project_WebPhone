import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FieldNumberOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/AdminOrder/AdminOrder";
import AdminCountInStock from "../../components/AdminCountInStock/AdminCountInStock";

import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const [keySelected, setKeySelected] = useState(
    localStorage.getItem("adminPageKey") || "user"
  );
  const { t } = useTranslation();

  const items = [
    getItem(t("ADMIN.USER"), "user", <UserOutlined />),
    getItem(t("ADMIN.PRODUCT"), "product", <AppstoreOutlined />),
    getItem(t("ADMIN.ORDER"), "order", <ShoppingCartOutlined />),
    getItem(t("ADMIN.QUANLITY_ADMIN"), "quanlity",  <FieldNumberOutlined />),
  ];

  useEffect(() => {
    localStorage.setItem("adminPageKey", keySelected);
  }, [keySelected]);

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <OrderAdmin />;
        case "quanlity":
        return <AdminCountInStock />;
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
