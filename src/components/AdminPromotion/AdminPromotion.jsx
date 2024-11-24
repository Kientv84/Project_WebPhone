import { Button, Form, Space, Select, Input } from "antd";
import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as PromotionService from "../../services/PromotionService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import {
  convertPrice,
  renderOptionsPromotionBranch,
  renderOptionsPromotionProduct,
} from "../../utils";
import { useTranslation } from "react-i18next";
import * as ProductService from "../../services/ProductService";

const AdminPromotion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const promotion = useSelector((state) => state?.promotion);
  const { t } = useTranslation();
  const [isModalOpenDeleteAll, setIsModalOpenDeleteAll] = useState(false);
  const [isDeleteManySuccessNotified, setIsDeleteManySuccessNotified] =
    useState(false);

  const searchInput = useRef(null);

  const initial = () => ({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    discountAmount: null,
    branch: null,
    minimumQuantity: 2,
    triggerProduct: "",
    bundleProduct: "", // Sản phẩm kèm theo
    discountPrice: "",
  });

  const [statePromotion, setStatePromotion] = useState(initial());
  const [statePromotionDetails, setStatePromotionDetails] = useState(initial());

  const [form] = Form.useForm();

  const mutation = useMutationHook((data) => {
    const {
      month,
      year,
      discountAmount,
      branch,
      minimumQuantity,
      triggerProduct,
      bundleProduct,
      discountPrice,
    } = data;
    const res = PromotionService.createPromotion({
      month,
      year,
      discountAmount,
      branch,
      minimumQuantity,
      triggerProduct,
      bundleProduct,
      discountPrice,
    });
    return res;
  });

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = PromotionService.updatePromotion(
      id,
      token,
      { ...rests } // này là data nên phải là object
    );
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = PromotionService.deletePromotion(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = PromotionService.deleteManyPromotion(ids, token);
    return res;
  });

  //
  const getAllPromotion = async () => {
    const product = JSON.parse(localStorage.getItem("promotion"));
    const res = await PromotionService.getAllPromotion(product?.access_token);
    return { data: res?.data, key: "promotions" };
  };

  // show ra các thông tin khi edit sản phẩm
  const fetchGetDetailsPromotion = async (rowSelected) => {
    const res = await PromotionService.getDetailsPromotion(rowSelected);
    if (res?.data) {
      setStatePromotionDetails({
        month: res?.data?.month,
        year: res?.data?.year,
        discountAmount: res?.data?.discountAmount,
        branch: res?.data?.branch,
        minimumQuantity: res?.data?.minimumQuantity,
        triggerProduct: res?.data?.triggerProduct,
        bundleProduct: res?.data?.bundleProduct?.productId || "", // Lấy productId từ đối tượng bundleProduct
        discountPrice: res?.data?.bundleProduct?.discountPrice || "",
      });
    }
    setIsLoadingUpdate(false);
  };
  // khi bấm edit sản phẩm nó giúp cho việc hiện ra lại các thông tin cần edit
  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(statePromotionDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, statePromotionDetails, isModalOpen]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsPromotion(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //
  const handleDetailsPromotion = useCallback(() => {
    setIsOpenDrawer(true);
  }, [setIsOpenDrawer]);

  const handleDeleteManyPromotions = (ids) => {
    setRowSelected(ids); // Lưu lại danh sách các ID muốn xóa
    setIsModalOpenDeleteAll(true); // Mở hộp thoại xác nhận
    setIsDeleteManySuccessNotified(false);
  };

  const handleChangeSelectBranch = (valueBranch) => {
    setStatePromotion({
      ...statePromotion,
      branch: valueBranch,
    });
  };

  const handleChangeNewSelectBranch = (valueBranch) => {
    setStatePromotionDetails({
      ...statePromotionDetails,
      branch: valueBranch,
    });
  };

  const handleChangeSelectBundleProduct = (value) => {
    setStatePromotion({
      ...statePromotion,
      bundleProduct: value,
    });
  };

  const handleChangeSelectTriggerProduct = (value) => {
    setStatePromotion({
      ...statePromotion,
      triggerProduct: value,
    });
  };

  const handleChangeNewSelectBundleProduct = (value) => {
    setStatePromotionDetails({
      ...statePromotionDetails,
      bundleProduct: value,
    });
  };

  const handleChangeNewSelectTriggerProduct = (value) => {
    setStatePromotionDetails({
      ...statePromotionDetails,
      triggerProduct: value,
    });
  };

  const fetchAllBranchProduct = async () => {
    const res = await ProductService.getAllBranchProduct();
    return res;
  };

  const getAllProduct = async () => {
    const product = JSON.parse(localStorage.getItem("product"));
    const res = await ProductService.getAllProduct(product?.access_token);
    return { data: res?.data, key: "productss" };
  };

  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryPromotion = useQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotion,
  });

  const branchProduct = useQuery({
    queryKey: ["brand-product"],
    queryFn: fetchAllBranchProduct,
  });

  const allProduct = useQuery({
    queryKey: ["productss"],
    queryFn: getAllProduct,
  });

  const { isLoading: isLoadingProducts, data: promotions } = queryPromotion;

  const renderAction = useCallback(() => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "28px", cursor: "pointer" }}
          onClick={handleDetailsPromotion}
        />
      </div>
    );
  }, [setIsModalOpenDelete, handleDetailsPromotion]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = useCallback(
    (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <InputComponent
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1677ff" : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    }),
    []
  );

  // Memoize some values to avoid unnecessary recalculations
  const columns = [
    {
      title: t("ADMIN.MONTH"),
      dataIndex: "month",
      sorter: (a, b) => parseInt(a.month) - parseInt(b.month),
      ...getColumnSearchProps("month"), // search name
    },
    {
      title: t("ADMIN.YEAR"),
      dataIndex: "year",
      ...getColumnSearchProps("year"), // search type
    },
    {
      title: t("ADMIN.DISCOUNT_PERCENTAGE"),
      dataIndex: "discountAmount",
      render: (text) => (text ? <span>{convertPrice(text)}</span> : "N/A"),
    },
    {
      title: t("ADMIN.PRODUCT_BRANCH"),
      dataIndex: "branch",
      render: (text) => text || "N/A",
    },
    {
      title: t("ADMIN.MINIMUM_QUANTITY"),
      dataIndex: "minimumQuantity",
      render: (text) => text || "N/A",
      ...getColumnSearchProps("minimumQuantity"), // search branch
    },
    {
      title: t("ADMIN.TRIGGER_PRODUCT"),
      dataIndex: "triggerProduct",
      render: (triggerProduct) => triggerProduct?.name || "N/A", // Display product name or fallback
    },
    {
      title: t("ADMIN.BUNDLE_PRODUCT"),
      dataIndex: ["bundleProduct", "productId", "name"],
      render: (bundleProduct) => bundleProduct || "N/A", // Display product name or fallback
    },
    {
      title: t("ADMIN.DISCOUNT_PRICE"),
      dataIndex: ["bundleProduct", "discountPrice"], // Adjust if nested
      render: (discountPrice) =>
        discountPrice ? <span>{convertPrice(discountPrice)}</span> : "N/A",
    },
    {
      title: t("ADMIN.ACTION"),
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    promotions?.data?.length &&
    promotions?.data?.map((promotion) => {
      return { ...promotion, key: promotion._id };
    });

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setStatePromotion({
      month: "",
      year: "",
      discountAmount: "",
      branch: "",
      minimumQuantity: "",
      triggerProduct: "",
      bundleProduct: "", // Sản phẩm kèm theo
      discountPrice: "",
    });
    form.resetFields();
  }, [form]);

  const statuss = data?.status;
  //Thêm mới sp
  useEffect(() => {
    if (isSuccess && statuss === "OK") {
      message.success(t("ADMIN.ADD_PROMOTION_SUCCESS"));
      handleCancel();
    } else if (isError) {
      message.error(t("ADMIN.ADD_PROMOTION_FAIL"));
    }
  }, [isSuccess, statuss, handleCancel, isError]);

  // Hàm xác nhận xóa tất cả
  const handleConfirmDeleteAll = () => {
    mutationDeletedMany.mutate(
      { ids: rowSelected, token: promotion?.access_token },
      {
        onSettled: () => {
          queryPromotion.refetch();
          setIsModalOpenDeleteAll(false); // Đóng modal sau khi xóa
        },
      }
    );
  };

  const statusDeletedMany = dataDeletedMany?.status;
  //Xoá nhiều sp
  useEffect(() => {
    if (
      isSuccessDeletedMany &&
      statusDeletedMany === "OK" &&
      !isDeleteManySuccessNotified
    ) {
      message.success(t("ADMIN.DELETE_MANY_SUCCESS_PROMOTION"));
      setIsDeleteManySuccessNotified(true); // Đánh dấu đã hiển thị thông báo thành công
      queryPromotion.refetch();
    } else if (isErrorDeletedMany) {
      message.error(t("ADMIN.DELETE_MANY_FAIL_PROMOTION"));
      setIsDeleteManySuccessNotified(false); // Đặt lại cờ nếu xảy ra lỗi
    }
  }, [
    isSuccessDeletedMany,
    statusDeletedMany,
    isErrorDeletedMany,
    isDeleteManySuccessNotified,
  ]);

  const handleCancelDelete = useCallback(() => {
    setIsModalOpenDelete(false);
  }, []);

  const statusDeleted = dataDeleted?.status;

  //Xoá 1 sp
  useEffect(() => {
    if (isSuccessDeleted && statusDeleted === "OK") {
      message.success(t("ADMIN.DELETE_SUCCESS_PROMOTION"));
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error(t("ADMIN.DELETE_FAIL_PROMOTION"));
    }
  }, [isSuccessDeleted, statusDeleted, handleCancelDelete, isErrorDeleted]);

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setStatePromotionDetails({
      month: "",
      year: "",
      discountAmount: "",
      branch: "",
      minimumQuantity: "",
      triggerProduct: "",
      bundleProduct: "", // Sản phẩm kèm theo
      discountPrice: "",
    });
    form.resetFields();
  }, [form]);

  const statusUpdated = dataUpdated?.status;

  //Cập nhật sp
  useEffect(() => {
    if (isSuccessUpdated && statusUpdated === "OK") {
      message.success(t("ADMIN.UPDATE_SUCCESS"));
      handleCancelDrawer();
    } else if (isErrorUpdated) {
      message.error(t("ADMIN.UPDATE_FAIL"));
    }
  }, [isSuccessUpdated, statusUpdated, handleCancelDrawer, isErrorUpdated]);

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: promotion?.access_token },
      {
        onSettled: () => {
          queryPromotion.refetch();
        },
      }
    );
  };

  const onFinish = async () => {
    const {
      month,
      year,
      discountAmount,
      minimumQuantity,
      branch,
      triggerProduct,
      bundleProduct,
      discountPrice,
    } = statePromotion;

    // Kiểm tra nếu cả discountAmount, triggerProduct, và bundleProduct đều không có giá trị
    if (!discountAmount && !branch && !triggerProduct && !bundleProduct) {
      message.error(
        "At least one of Discount, Brand, Trigger Product, or Bundle Product must be filled."
      );
      return;
    }

    // Tạo params sau khi validation thành công
    const params = {
      month: month || new Date().getMonth() + 1,
      year: year || new Date().getFullYear(),
      discountAmount: discountAmount || null,
      minimumQuantity,
      branch: branch || null,
      triggerProduct: triggerProduct || null,
      bundleProduct: bundleProduct || null,
      discountPrice: discountPrice || null,
    };

    // Gửi mutation
    mutation.mutate(params, {
      onSettled: () => {
        queryPromotion.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStatePromotion({
      ...statePromotion,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    setStatePromotionDetails({
      ...statePromotionDetails,
      [name]: value,
    });
  };

  const onUpdatePromotion = () => {
    const isDuplicate = promotions?.data?.some(
      (promo) =>
        promo.branch === statePromotionDetails.branch && // Kiểm tra trùng branch
        promo.month === statePromotionDetails.month &&
        promo.year === statePromotionDetails.year &&
        promo._id !== rowSelected // Loại trừ promotion hiện tại (đang được cập nhật)
    );

    if (isDuplicate) {
      message.error(t("ADMIN.UPDATE_FAIL_BRAND"));
      return; // Dừng lại nếu trùng lặp
    }

    const updateData = {
      id: rowSelected,
      token: promotion?.access_token,
      month: statePromotionDetails.month,
      year: statePromotionDetails.year,
      discountAmount: statePromotionDetails.discountAmount,
      branch: statePromotionDetails.branch,
      minimumQuantity: statePromotionDetails.minimumQuantity,
    };

    // Chỉ thêm bundleProduct nếu có dữ liệu
    if (statePromotionDetails.bundleProduct) {
      updateData.bundleProduct = {
        productId: statePromotionDetails.bundleProduct,
        discountPrice: statePromotionDetails.discountPrice || 0,
      };
    }

    // Chỉ thêm triggerProduct nếu có dữ liệu
    if (statePromotionDetails.triggerProduct) {
      updateData.triggerProduct = statePromotionDetails.triggerProduct;
    }

    mutationUpdate.mutate(updateData, {
      onSettled: () => {
        queryPromotion.refetch();
      },
    });
  };

  const productOptions = allProduct.data?.data
    ? renderOptionsPromotionProduct(allProduct.data.data, "name", "_id")
    : [];

  return (
    <div>
      <WrapperHeader>{t("ADMIN.MANAGE_PROMOTION")}</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyPromotions}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title={t("ADMIN.ADD_NEW_PROMOTION")}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        style={{ padding: "24px" }}
        centered
        width={800}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.MONTH")}
              name="month"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_MONTH"),
                },
              ]}
            >
              <Input
                type="number"
                value={statePromotion["month"]}
                onChange={handleOnchange}
                name="month"
                min={1}
                max={12}
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.YEAR")}
              name="year"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_YEAR"),
                },
              ]}
            >
              <InputComponent
                type="number"
                value={statePromotion["year"]}
                onChange={handleOnchange}
                name="year"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.DISCOUNT_PERCENTAGE")}
              name="discountAmount"
            >
              <InputComponent
                value={statePromotion.discountAmount}
                onChange={handleOnchange}
                name="discountAmount"
              />
            </Form.Item>
            <Form.Item label={t("ADMIN.ADD_BRANCH")} name="branch">
              <Select
                name="branch"
                valueBranch={statePromotion.branch}
                onChange={handleChangeSelectBranch}
                options={renderOptionsPromotionBranch(
                  branchProduct?.data?.data
                )}
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.MINIMUM_QUANTITY")}
              name="minimumQuantity"
            >
              <InputComponent
                type="number"
                value={statePromotion.minimumQuantity}
                onChange={handleOnchange}
                name="minimumQuantity"
              />
            </Form.Item>
            <Form.Item label={t("ADMIN.TRIGGER_PRODUCT")} name="triggerProduct">
              <Select
                name="triggerProduct"
                value={statePromotion.triggerProduct}
                onChange={handleChangeSelectTriggerProduct}
                options={productOptions} // Assuming productOptions has product choices
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.BUNDLE_PRODUCT")}
              name="bundleProduct"
              rules={[
                {
                  required: false, // Không bắt buộc nếu không cần
                  message: t("ADMIN.PLACEHOLDER_BUNDLE_PRODUCT"),
                },
              ]}
            >
              <Select
                name="bundleProduct"
                valueBranch={statePromotion.bundleProduct}
                onChange={handleChangeSelectBundleProduct}
                options={productOptions}
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.DISCOUNT_PRICE")}
              name="discountPrice"
              rules={[
                {
                  required: false,
                  message: t("ADMIN.PLACEHOLDER_DISCOUNT_PRICE"),
                },
              ]}
            >
              <Input
                type="number"
                value={statePromotion["discountPrice"]}
                onChange={handleOnchange}
                name="discountPrice"
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {t("ADMIN.BUTTON_SUBMID_ADD_PRODUCT")}
              </Button>
            </Form.Item>
            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}
          </Form>
        </Loading>
      </ModalComponent>

      <DrawerComponent
        title={t("ADMIN.PROMOTION_DETAIL")}
        isOpen={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
        width={800}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdatePromotion}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.MONTH")}
              name="month"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_MONTH"),
                },
              ]}
            >
              <InputComponent
                type="number"
                value={statePromotionDetails["month"]}
                onChange={handleOnchangeDetails}
                name="month"
                min={1}
                max={12}
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.YEAR")}
              name="year"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_YEAR"),
                },
              ]}
            >
              <InputComponent
                type="number"
                value={statePromotionDetails["year"]}
                onChange={handleOnchangeDetails}
                name="year"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.DISCOUNT_PERCENTAGE")}
              name="discountAmount"
            >
              <InputComponent
                value={statePromotionDetails.discountAmount}
                onChange={handleOnchangeDetails}
                name="discountAmount"
              />
            </Form.Item>
            <Form.Item label={t("ADMIN.ADD_BRANCH")} name="branch">
              <Select
                value={statePromotionDetails.branch}
                onChange={handleChangeNewSelectBranch}
                name="branch"
                options={renderOptionsPromotionBranch(
                  branchProduct?.data?.data
                )}
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.MINIMUM_QUANTITY")}
              name="minimumQuantity"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_MINIMUM_QUANTITY"),
                },
              ]}
            >
              <InputComponent
                type="number"
                value={statePromotionDetails.minimumQuantity}
                onChange={handleOnchangeDetails}
                name="minimumQuantity"
              />
            </Form.Item>

            <Form.Item label={t("ADMIN.TRIGGER_PRODUCT")} name="triggerProduct">
              <Select
                name="triggerProduct"
                valueBranch={statePromotionDetails.triggerProduct}
                onChange={handleChangeNewSelectTriggerProduct}
                options={productOptions}
              />
            </Form.Item>

            <Form.Item label={t("ADMIN.BUNDLE_PRODUCT")} name="bundleProduct">
              <Select
                name="bundleProduct"
                valueBranch={statePromotionDetails.bundleProduct}
                onChange={handleChangeNewSelectBundleProduct}
                options={productOptions}
              />
            </Form.Item>

            <Form.Item label={t("ADMIN.DISCOUNT_PRICE")} name="discountPrice">
              <InputComponent
                type="number"
                value={statePromotionDetails["discountPrice"]}
                onChange={handleOnchangeDetails}
                name="discountPrice"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {t("ADMIN.DETAIL_USER_APPLY")}
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title={t("ADMIN.DELETE_ALL_PROMOTIONS")}
        open={isModalOpenDeleteAll}
        onCancel={() => setIsModalOpenDeleteAll(false)}
        onOk={handleConfirmDeleteAll}
      >
        <Loading isLoading={isLoadingDeletedMany}>
          <div>{t("ADMIN.MESS_DELETE_ALL_PROMOTIONS")}</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title={t("ADMIN.DELETE_PROMOTION")}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>{t("ADMIN.MESS_DELETE_PROMOTION")}</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminPromotion;
