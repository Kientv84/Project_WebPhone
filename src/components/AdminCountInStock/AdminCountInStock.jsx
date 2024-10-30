import { Button, Form, Space, Input, Modal } from "antd"; 
import React, { useCallback, useRef, useState } from "react";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import * as ProductService from "../../services/ProductService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useQuery, useQueryClient } from "react-query"; 
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import InputComponent from "../InputComponent/InputComponent";
import { WrapperHeader, WrapperUploadFile } from "./style";

const AdminCountInStock = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [newStock, setNewStock] = useState(0);
  const product = useSelector((state) => state?.product);
  const { t } = useTranslation();
  const searchInput = useRef(null);

  const queryClient = useQueryClient(); // Khởi tạo queryClient
  const [form] = Form.useForm();

  // Fetch sản phẩm
  const getAllProduct = async () => {
    const product = JSON.parse(localStorage.getItem("product"));
    const res = await ProductService.getAllProduct(product?.access_token);
    return res.data;
  };

  const { isLoading: isLoadingProducts, data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  // Lọc sản phẩm có số lượng dưới 10
  const filteredProducts = products?.filter((product) => product.countInStock < 10);

  // Render action với nút cập nhật
  const renderAction = useCallback(
    (product) => (
      <div>
        <EditOutlined
          style={{ color: "blue", fontSize: "28px", cursor: "pointer" }}
          onClick={() => {
            setRowSelected(product._id);
            setNewStock(product.countInStock);
            setIsModalOpen(true);
          }}
        />
      </div>
    ),
    []
  );

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  // Mutation để cập nhật sản phẩm
  const mutationUpdate = useMutationHook(
    (data) => {
      const { id, token, countInStock } = data;
      return ProductService.updateProduct(id, token, { countInStock });
    },
    {
      onSuccess: () => {
        refetch(); // Gọi refetch để cập nhật lại dữ liệu
      },
    }
  );

  // Xử lý cập nhật sản phẩm
  const handleUpdateStock = () => {
    if (newStock >= 0) {
      mutationUpdate.mutate({
        id: rowSelected,
        token: product?.access_token,
        countInStock: newStock,
      });

      // Cập nhật số lượng sản phẩm ngay lập tức trong dữ liệu hiển thị
      const updatedProducts = dataTable.map((item) => {
        if (item.key === rowSelected) {
          return { ...item, countInStock: newStock }; // Cập nhật số lượng
        }
        return item;
      });

      // Cập nhật lại state sản phẩm với danh sách sản phẩm đã cập nhật
      queryClient.setQueryData(["products"], updatedProducts);

      setIsModalOpen(false); // Đóng modal sau khi cập nhật
    }
  };

  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: (props) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <InputComponent
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={props.selectedKeys[0]}
            onChange={(e) =>
              props.setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(props.selectedKeys, props.confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(props.selectedKeys, props.confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => props.clearFilters && handleReset(props.clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => props.close()}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : "",
    }),
    []
  );

  const columns = [
    {
      title: t("ADMIN.PRODUCT_NAME"),
      dataIndex: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: t("ORDER_SUCCESS.QUANTITY"),
      dataIndex: "countInStock",
      render: (_, product) => (
        <span style={{
          fontWeight: "bold",
          color: product.countInStock < 10 ? "red" : "green",
          textAlign: "center",
          display: "inline-block",
          width: "100px", // Thay đổi kích thước để tạo không gian
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: product.countInStock < 10 ? "#ffe6e6" : "#e6ffe6", // Màu nền tương ứng
          transition: "background-color 0.3s", // Hiệu ứng chuyển màu
        }}>
          {product.countInStock}
        </span>
      ),
    },
    {
      title: t("ADMIN.PRODUCT_TYPE"),
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: t("ADMIN.PRODUCT_BRANCH"),
      dataIndex: "branch",
      ...getColumnSearchProps("branch"),
    },
    {
      title: t("ADMIN.ACTION"),
      dataIndex: "action",
      render: (_, product) => renderAction(product),
    },
  ];

  const dataTable = filteredProducts?.map((product) => ({
    ...product,
    key: product._id,
  }));

  return (
    <>
      <WrapperHeader>{'CÁC SẢN PHẨM SẮP HẾT'}</WrapperHeader>
      <TableComponent columns={columns} dataSource={dataTable} loading={isLoadingProducts} />
      
      {/* Modal cập nhật số lượng */}
      <Modal
        title={t("ADMIN.UPDATE_STOCK")}
        visible={isModalOpen}
        onOk={handleUpdateStock}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form}>
          <Form.Item label={t("ADMIN.COUNT_IN_STOCK")}>
            <Input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(Number(e.target.value))}
              min={0}
              placeholder={t("ADMIN.ENTER_NEW_STOCK")}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminCountInStock;
