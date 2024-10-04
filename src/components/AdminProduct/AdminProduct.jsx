import { Button, Form, Space, Select, Input } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import * as ProductService from "../../services/ProductService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useQuery } from "react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../ultis/firebase";
import { getBase64, renderOptionsType, renderOptionsBranch } from "../../utils";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const product = useSelector((state) => state?.product);
  const searchInput = useRef(null);

  const initial = () => ({
    name: "",
    price: "",
    description: "",
    promotion: "",
    rating: "",
    image: "",
    image1: "",
    image2: "",
    type: "",
    branch: "",
    countInStock: "",
    newType: "",
    newBranch: "",
    discount: "",
  });
  const [stateProduct, setStateProduct] = useState(initial());
  const [stateProductDetails, setStateProductDetails] = useState(initial());

  const [form] = Form.useForm();

  const mutation = useMutationHook((data) => {
    const {
      name,
      price,
      description,
      promotion,
      rating,
      image,
      image1,
      image2,
      type,
      branch,
      countInStock,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      promotion,
      rating,
      image,
      image1,
      image2,
      type,
      branch,
      countInStock,
      discount,
    });
    return res;
  });

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(
      id,
      token,
      { ...rests } // này là data nên phải là object
    );
    return res;
  });

  const mutationDeleted = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  //
  const getAllProduct = async () => {
    const product = JSON.parse(localStorage.getItem("product"));
    const res = await ProductService.getAllProduct(product?.access_token);
    return { data: res?.data, key: "products" };
  };

  // show ra các thông tin khi edit sản phẩm
  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        promotion: res?.data?.promotion,
        rating: res?.data?.rating,
        image: res?.data?.image,
        image1: res?.data?.image1,
        image2: res?.data?.image2,
        type: res?.data?.type,
        branch: res?.data?.branch,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };
  // khi bấm edit sản phẩm nó giúp cho việc hiện ra lại các thông tin cần edit
  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  useEffect(() => {
    // console.log('rowSelected', rowSelected)
    // console.log('isOpenDrawer', isOpenDrawer)
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: product?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
    console.log("value", value);
  };

  const handleChangeSelectBranch = (valueBranch) => {
    setStateProduct({
      ...stateProduct,
      branch: valueBranch,
    });
    console.log("value", valueBranch);
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const fetchAllBranchProduct = async () => {
    const res = await ProductService.getAllBranchProduct();
    return res;
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
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const branchProduct = useQuery({
    queryKey: ["branch-product"],
    queryFn: fetchAllBranchProduct,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "28px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "blue", fontSize: "28px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  // Memoize some values to avoid unnecessary recalculations
  const memoizedColumns = useMemo(() => {
    return [
      {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.length - b.name.length,
        ...getColumnSearchProps("name"), // search name
      },
      {
        title: "Price",
        dataIndex: "price",
        sorter: (a, b) => a.price - b.price,
        filters: [
          { text: ">= 10000000", value: ">=" },
          { text: "<= 10000000", value: "<=" },
        ],
        onFilter: (value, record) => {
          if (value === ">=") {
            return record.price >= 10000000;
          }
          return record.price <= 10000000;
        },
      },
      {
        title: "Rating",
        dataIndex: "rating",
        sorter: (a, b) => a.rating - b.rating,
        filters: [
          { text: ">= 3.5", value: ">=" },
          { text: "<= 3.5", value: "<=" },
        ],
        onFilter: (value, record) => {
          if (value === ">=") {
            return record.rating >= 3.5;
          }
          return record.rating <= 3.5;
        },
      },
      {
        title: "Type",
        dataIndex: "type",
        ...getColumnSearchProps("type"), // search type
      },
      {
        title: "Branch",
        dataIndex: "branch",
        ...getColumnSearchProps("branch"), // search branch
      },
      {
        title: "Action",
        dataIndex: "action",
        render: renderAction,
      },
    ];
  }, []);

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  //Thêm mới sp
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  //Xoá nhiều sp
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany]);

  //Xoá 1 sp
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  //Cập nhật sp
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCancelDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      promotion: "",
      rating: "",
      image: "",
      image1: "",
      image2: "",
      type: "",
      branch: "",
      countInStock: "",
    });
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: product?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      promotion: "",
      rating: "",
      image: "",
      image1: "",
      image2: "",
      type: "",
      branch: "",
      countInStock: "",
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      promotion: stateProduct.promotion,
      rating: stateProduct.rating,
      image: stateProduct.image,
      image1: stateProduct.image1,
      image2: stateProduct.image2,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      branch:
        stateProduct.branch === "add_branch"
          ? stateProduct.newBranch
          : stateProduct.branch,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProduct((stateProduct) => ({
            ...stateProduct,
            image: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const handleOnchangeAvatar1 = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProduct((stateProduct) => ({
            ...stateProduct,
            image1: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const handleOnchangeAvatar2 = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProduct((stateProduct) => ({
            ...stateProduct,
            image2: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProductDetails((stateProductDetails) => ({
            ...stateProductDetails,
            image: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const handleOnchangeAvatarDetailsProduct = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProductDetails((stateProductDetails) => ({
            ...stateProductDetails,
            image1: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const handleOnchangeAvatarDetailsProduct2 = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setIsLoadingUpdate(true); // Đặt trạng thái loading

    if (!file.url && !file.preview) {
      message.error("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoadingUpdate(false); // Nếu không có file thì kết thúc loading
      return;
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        console.log(err);
        setIsLoadingUpdate(false); // Nếu lỗi, kết thúc loading
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setStateProductDetails((stateProductDetails) => ({
            ...stateProductDetails,
            image2: url, // Lưu URL vào state
          })); // Cập nhật URL ảnh đã tải lên

          setIsLoadingUpdate(false); // Hoàn thành upload và kết thúc loading
        });
      }
    );
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: product?.access_token, ...stateProductDetails },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Manage Products</WrapperHeader>
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
          handleDeleteMany={handleDeleteManyProducts}
          columns={memoizedColumns}
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
        title="New Product"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                // ="lucy"
                // style={{ defaultValuewidth: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptionsType(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: "Please input your branch!" }]}
            >
              <Select
                name="branch"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                valueBranch={stateProduct.branch}
                onChange={handleChangeSelectBranch}
                options={renderOptionsBranch(branchProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.branch === "add_branch" && (
              <Form.Item
                label="New branch"
                name="newBranch"
                rules={[
                  { required: true, message: "Please input your branch!" },
                ]}
              >
                <InputComponent
                  value={stateProduct.newBranch}
                  onChange={handleOnchange}
                  name="newBranch"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnchange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProduct.description}
                onChange={handleOnchange}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Promotion"
              name="promotion"
              rules={[
                {
                  required: true,
                  message: "Please input your count promotion!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProduct.promotion}
                onChange={handleOnchange}
                name="promotion"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnchange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnchange}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your count image product!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProduct?.image && (
                    <img
                      src={stateProduct?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              label="Image Product"
              name="image1"
              rules={[
                {
                  required: true,
                  message: "Please input your count image product!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar1} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProduct?.image1 && (
                    <img
                      src={stateProduct?.image1}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              label="Image Product"
              name="image2"
              rules={[
                {
                  required: true,
                  message: "Please input your count image product!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar2} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProduct?.image2 && (
                    <img
                      src={stateProduct?.image2}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Product Details"
        isOpen={isOpenDrawer}
        onCancel={() => setIsOpenDrawer(false)}
        footer={null}
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <InputComponent
                value={stateProductDetails["type"]}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: "Please input your branch!" }]}
            >
              <InputComponent
                value={stateProductDetails["branch"]}
                onChange={handleOnchangeDetails}
                name="branch"
              />
            </Form.Item>
            <Form.Item
              label="Count inStock"
              name="countInStock"
              rules={[
                { required: true, message: "Please input your count inStock!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                { required: true, message: "Please input your count price!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your count description!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Promotion"
              name="promotion"
              rules={[
                {
                  required: true,
                  message: "Please input your count promotion!",
                },
              ]}
            >
              <Input.TextArea
                value={stateProductDetails.promotion}
                onChange={handleOnchangeDetails}
                name="promotion"
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                { required: true, message: "Please input your count rating!" },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount of product!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                { required: true, message: "Please input your count image!" },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProductDetails?.image && (
                    <img
                      src={stateProductDetails?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item
              label="Image Product"
              name="image1"
              rules={[
                {
                  required: true,
                  message: "Please input your count image product!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetailsProduct}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProductDetails?.image1 && (
                    <img
                      src={stateProductDetails?.image1}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item
              label="Image Product"
              name="image2"
              rules={[
                {
                  required: true,
                  message: "Please input your count image product!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetailsProduct2}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>Select File</Button>
                  {stateProductDetails?.image2 && (
                    <img
                      src={stateProductDetails?.image2}
                      style={{
                        height: "60px",
                        width: "60px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title="Delete product"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Are you sure you want to delete this product?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
