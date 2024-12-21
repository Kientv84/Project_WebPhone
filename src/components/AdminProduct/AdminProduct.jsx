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
import {
  getBase64,
  renderOptionsType,
  renderOptionsBranch,
  convertPrice,
  renderOptionsPromotionProduct,
} from "../../utils";
import { useTranslation } from "react-i18next";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const product = useSelector((state) => state?.product);
  const { t } = useTranslation();
  const [isModalOpenDeleteAll, setIsModalOpenDeleteAll] = useState(false);
  const [isDeleteManySuccessNotified, setIsDeleteManySuccessNotified] =
    useState(false);

  const [promotions, setPromotions] = useState([{ name: "promotion" }]);

  const [promotionsDetail, setPromotionsDetail] = useState([
    { name: "promotion" },
  ]);

  // const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const initial = () => ({
    name: "",
    price: "",
    description: "",
    promotion: [],
    promotionText: "", // Nội dung khuyến mãi
    relatedProductId: "",
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
      promotionText,
      relatedProductId,
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
      promotionText,
      relatedProductId,
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
        promotion: res?.data?.promotion || [],
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
    if (stateProductDetails.promotion.length > 0) {
      const fieldValues = stateProductDetails.promotion.reduce(
        (acc, item, index) => {
          acc[`promotionText_${index}`] = item.promotionText;
          acc[`relatedProductId_${index}`] = item.relatedProductId;
          return acc;
        },
        {}
      );
      form.setFieldsValue({ ...stateProductDetails, ...fieldValues });
    }
  }, [stateProductDetails, form]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //
  const handleDetailsProduct = useCallback(() => {
    setIsOpenDrawer(true);
  }, [setIsOpenDrawer]);

  const handleDeleteManyProducts = (ids) => {
    setRowSelected(ids); // Lưu lại danh sách các ID muốn xóa
    setIsModalOpenDeleteAll(true); // Mở hộp thoại xác nhận
    setIsDeleteManySuccessNotified(false);
  };

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };

  const handleChangeNewSelect = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  const handleChangeSelectBranch = (valueBranch) => {
    setStateProduct({
      ...stateProduct,
      branch: valueBranch,
    });
  };

  const handleChangeNewSelectBranch = (valueBranch) => {
    setStateProductDetails({
      ...stateProductDetails,
      branch: valueBranch,
    });
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
    isLoading: isLoadingDeletedMany,
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

  const renderAction = useCallback(() => {
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
  }, [setIsModalOpenDelete, handleDetailsProduct]);

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
      title: t("ADMIN.PRODUCT_NAME"),
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"), // search name
    },
    {
      title: t("ADMIN.PRODUCT_PRICE"),
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
      render: (price) => price && <span>{convertPrice(price)}</span>,
    },
    {
      title: t("ADMIN.PRODUCT_RATING"),
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
      title: t("ADMIN.PRODUCT_TYPE"),
      dataIndex: "type",
      ...getColumnSearchProps("type"), // search type
    },
    {
      title: t("ADMIN.PRODUCT_BRANCH"),
      dataIndex: "branch",
      ...getColumnSearchProps("branch"), // search branch
    },
    // {
    //   title: t("ADMIN.PRODUCT_PROMOTION"),
    //   dataIndex: "promotion",
    //   render: (promotion, record) => (
    //     <Link to={`/product-details/${record._id}`}>{promotion}</Link>
    //   ),
    // },
    {
      title: t("ADMIN.ACTION"),
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setPromotions([{ promotionText: "", relatedProductId: null }]);
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
  }, [form]);

  const statuss = data?.status;
  //Thêm mới sp
  useEffect(() => {
    if (isSuccess && statuss === "OK") {
      message.success(t("ADMIN.ADD_SUCCESS"));
      handleCancel();
    } else if (isError) {
      message.error(t("ADMIN.ADD_FAIL"));
    }
  }, [isSuccess, statuss, handleCancel, isError]);

  // Hàm xác nhận xóa tất cả
  const handleConfirmDeleteAll = () => {
    mutationDeletedMany.mutate(
      { ids: rowSelected, token: product?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
          setIsModalOpenDeleteAll(false); // Đóng modal sau khi xóa
        },
      }
    );
  };

  const statusDeletedMany = dataDeletedMany?.status;
  useEffect(() => {
    if (
      isSuccessDeletedMany &&
      statusDeletedMany === "OK" &&
      !isDeleteManySuccessNotified
    ) {
      message.success(t("ADMIN.DELETE_MANY_SUCCESS_PRODUCT"));
      setIsDeleteManySuccessNotified(true); // Đánh dấu đã hiển thị thông báo thành công
      queryProduct.refetch();
    } else if (isErrorDeletedMany) {
      message.error(t("ADMIN.DELETE_MANY_FAIL_PRODUCT"));
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
      message.success(t("ADMIN.DELETE_SUCCESS"));
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error(t("ADMIN.DELETE_FAIL"));
    }
  }, [isSuccessDeleted, statusDeleted, handleCancelDelete, isErrorDeleted]);

  const handleCancelDrawer = useCallback(() => {
    setIsOpenDrawer(false);
    setPromotionsDetail([{ promotionText: "", relatedProductId: null }]);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      promotion: [],
      rating: "",
      image: "",
      image1: "",
      image2: "",
      type: "",
      branch: "",
      countInStock: "",
    });
    form.resetFields();
  }, [form]);

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

  const onFinish = async () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      promotion: promotions,
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

  const handleOnchangePromotion = (e, index) => {
    const newPromotions = [...promotions];
    newPromotions[index].promotionText = e.target.value; // Cập nhật giá trị
    setPromotions(newPromotions);
  };

  const handleOnchangePromotionRelatedProduct = (value, index) => {
    const newPromotions = [...promotions];
    newPromotions[index].relatedProductId = value;
    setPromotions(newPromotions);
  };

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    setStateProductDetails({
      ...stateProductDetails,
      [name]: value,
    });
  };

  const handleOnchangePromotionTextDetails = (e, index) => {
    const updatedPromotions = [...stateProductDetails.promotion];
    updatedPromotions[index] = {
      ...updatedPromotions[index],
      promotionText: e.target.value,
    };
    setStateProductDetails({
      ...stateProductDetails,
      promotion: updatedPromotions,
    });
  };

  const handleChangeNewSelectRelatedProductId = (value, index) => {
    const updatedPromotions = [...stateProductDetails.promotion];
    updatedPromotions[index] = {
      ...updatedPromotions[index],
      relatedProductId: value,
    };
    setStateProductDetails({
      ...stateProductDetails,
      promotion: updatedPromotions,
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
    const updateData = {
      id: rowSelected,
      token: product?.access_token,
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      rating: stateProductDetails.rating,
      image: stateProductDetails.image,
      image1: stateProductDetails.image1,
      image2: stateProductDetails.image2,
      type: stateProductDetails.type,
      branch: stateProductDetails.branch,
      countInStock: stateProductDetails.countInStock,
      discount: stateProductDetails.discount,
      promotion: stateProductDetails.promotion.map((pr) => ({
        promotionText: pr.promotionText || "",
        relatedProductId: pr.relatedProductId || null,
      })),
    };

    mutationUpdate.mutate(updateData, {
      onSuccess: (data) => {
        // Làm mới stateProductDetails với dữ liệu trả về từ API
        setStateProductDetails(data.data);
        message.success(t("ADMIN.UPDATE_SUCCESS"));
        handleCancelDrawer();
      },
      onError: (error) => {
        message.error(t("ADMIN.UPDATE_FAIL"));
      },
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const productOptions = queryProduct.data?.data
    ? renderOptionsPromotionProduct(queryProduct.data.data, "name", "_id")
    : [];

  const handleAddPromotion = () => {
    setPromotions([
      ...promotions,
      { promotionText: "", relatedProductId: null },
    ]);
  };

  const handleAddPromotionDetail = () => {
    const newPromotion = { promotionText: "", relatedProductId: null };
    setPromotionsDetail([...promotionsDetail, newPromotion]);
    setStateProductDetails({
      ...stateProductDetails,
      promotion: [...stateProductDetails.promotion, newPromotion],
    });
  };

  const handleRemovePromotion = (indexToRemove) => {
    // Lọc danh sách `promotions` để loại bỏ item tại index được chọn
    const updatedPromotions = promotions.filter(
      (_, index) => index !== indexToRemove
    );
    setPromotions(updatedPromotions);

    // Cập nhật stateProduct.promotion để giữ đồng bộ với promotions
    const updatedStatePromotions = stateProduct.promotion.filter(
      (_, index) => index !== indexToRemove
    );
    setStateProduct({
      ...stateProduct,
      promotion: updatedStatePromotions,
    });
  };

  const handleRemovePromotionDetail = (indexToRemove) => {
    // Lọc danh sách `promotion` để loại bỏ item tại index được chọn
    const updatedPromotions = stateProductDetails.promotion.filter(
      (_, index) => index !== indexToRemove
    );

    // Cập nhật lại stateProductDetails
    setStateProductDetails({
      ...stateProductDetails,
      promotion: updatedPromotions,
    });
  };

  return (
    <div>
      <WrapperHeader>{t("ADMIN.MANAGE_PRODUCT")}</WrapperHeader>
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
        title={t("ADMIN.ADD_NEW_PRODUCT")}
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
              label={t("ADMIN.NEW_PRODCUT_NAME")}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_PRODCUT_NAME"),
                },
              ]}
            >
              <InputComponent
                value={stateProduct["name"]}
                onChange={handleOnchange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.ADD_TYPE")}
              name="type"
              rules={[{ required: true, message: t("ADMIN.PLACEHOODER_TYPE") }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptionsType(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === "add_type" && (
              <Form.Item
                label={t("ADMIN.ADD_NEW_TYPE")}
                name="newType"
                rules={[
                  { required: true, message: t("ADMIN.PLACEHOODER_TYPE") },
                ]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item
              label={t("ADMIN.ADD_BRANCH")}
              name="branch"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_BRANCH") },
              ]}
            >
              <Select
                name="branch"
                valueBranch={stateProduct.branch}
                onChange={handleChangeSelectBranch}
                options={renderOptionsBranch(branchProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.branch === "add_branch" && (
              <Form.Item
                label={t("ADMIN.ADD_NEW_BRANCH")}
                name="newBranch"
                rules={[
                  { required: true, message: t("ADMIN.PLACEHOODER_BRANCH") },
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
              label={t("ADMIN.COUNT_IN_STOCK")}
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_COUNT_IN_STOCK"),
                },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnchange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.PRICE")}
              name="price"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_PRICE") },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.NEW_DESCRIPTION")}
              name="description"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_DESCRIPTION"),
                },
              ]}
            >
              <Input.TextArea
                value={stateProduct.description}
                onChange={handleOnchange}
                name="description"
                style={{ minHeight: "150px", width: "100%" }}
              />
            </Form.Item>
            <div>
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  size="middle"
                  onClick={() => handleAddPromotion()}
                >
                  <PlusOutlined style={{ fontSize: "20px" }} />
                  {t("ADMIN.ADD_PRODUCT")}
                </Button>
              </div>

              {promotions.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    paddingLeft: "10px",
                  }}
                >
                  <div
                    style={{
                      flexGrow: 1, // Form.Item chiếm phần còn lại
                      maxWidth: "calc(100% - 100px)", // Giới hạn chiều rộng để chừa chỗ cho nút
                    }}
                  >
                    <Form.Item
                      key={item.key}
                      label={t("ADMIN.NEW_PROMOTION")}
                      name={`promotionText_${index}`}
                      rules={[
                        {
                          required: true,
                          message: t("ADMIN.PLACEHOODER_PROMOTION"),
                        },
                      ]}
                    >
                      <Input.TextArea
                        value={stateProduct.promotion}
                        onChange={(e) => handleOnchangePromotion(e, index)}
                        style={{ minHeight: "100px", width: "100%" }}
                      />
                    </Form.Item>

                    <Form.Item
                      key={item.key}
                      label={t("ADMIN.RELATED_PRODUCT_ID")}
                      name={`relatedProductId_${index}`}
                    >
                      <Select
                        value={item.relatedProductId}
                        onChange={(value) =>
                          handleOnchangePromotionRelatedProduct(value, index)
                        }
                        placeholder={t("ADMIN.SELECT_RELATED_PRODUCT")}
                        options={productOptions}
                      ></Select>
                    </Form.Item>
                  </div>
                  <Button
                    style={{
                      color: "red",
                      borderColor: "red",
                    }}
                    variant="outlined"
                    size="middle"
                    onClick={() => handleRemovePromotion(index)}
                  >
                    {t("ADMIN.DELETE_PRODUCT")}
                  </Button>
                </div>
              ))}
            </div>
            <Form.Item
              label={t("ADMIN.NEW_RAING")}
              name="rating"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_RAING") },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnchange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.NEW_DISCOUNT")}
              name="discount"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_DISCOUNT"),
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
              label={t("ADMIN.NEW_IMG")}
              name="image"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_IMG"),
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
              label={t("ADMIN.NEW_IMG_1")}
              name="image1"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_IMG"),
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar1} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
              label={t("ADMIN.NEW_IMG_2")}
              name="image2"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_IMG"),
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar2} maxCount={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
        title={t("ADMIN.PRODUCT_DETAIL")}
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
            onFinish={onUpdateProduct}
            // autoComplete="on"
            form={form}
          >
            <Form.Item
              label={t("ADMIN.NEW_PRODCUT_NAME")}
              name="name"
              rules={[{ required: true, message: t("ADMIN.NEW_PRODCUT_NAME") }]}
            >
              <InputComponent
                value={stateProductDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.NEW_TYPE")}
              name="type"
              rules={[{ required: true, message: t("ADMIN.NEW_TYPE") }]}
            >
              <Select
                name="type"
                value={stateProductDetails.type}
                onChange={handleChangeNewSelect}
                options={renderOptionsType(typeProduct?.data?.data)}
              />
            </Form.Item>

            <Form.Item
              label={t("ADMIN.NEW_BRANCH")}
              name="branch"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_BRANCH") },
              ]}
            >
              <Select
                value={stateProductDetails["branch"]}
                onChange={handleChangeNewSelectBranch}
                name="branch"
                options={renderOptionsBranch(branchProduct?.data?.data)}
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.COUNT_IN_STOCK")}
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_COUNT_IN_STOCK"),
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.PRICE")}
              name="price"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_PRICE") },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.NEW_DESCRIPTION")}
              name="description"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_DESCRIPTION"),
                },
              ]}
            >
              <Input.TextArea
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
                style={{ minHeight: "150px", width: "100%" }}
              />
            </Form.Item>
            <div>
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  size="middle"
                  onClick={() => handleAddPromotionDetail()}
                >
                  <PlusOutlined style={{ fontSize: "20px" }} />
                  {t("ADMIN.ADD_PRODUCT")}
                </Button>
              </div>
              {stateProductDetails.promotion.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                    paddingLeft: "10px",
                  }}
                >
                  <div
                    style={{
                      flexGrow: 1, // Form.Item chiếm phần còn lại
                      maxWidth: "calc(100% - 100px)", // Giới hạn chiều rộng để chừa chỗ cho nút
                    }}
                  >
                    <Form.Item
                      label={t("ADMIN.NEW_PROMOTION")}
                      name={`promotionText_${index}`}
                      rules={[
                        {
                          required: true,
                          message: t("ADMIN.PLACEHOODER_PROMOTION"),
                        },
                      ]}
                    >
                      <Input.TextArea
                        value={item.promotionText}
                        onChange={(e) =>
                          handleOnchangePromotionTextDetails(e, index)
                        }
                        name={stateProductDetails.promotionText}
                        style={{ minHeight: "100px", width: "100%" }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={t("ADMIN.RELATED_PRODUCT_ID")}
                      name={`relatedProductId_${index}`}
                    >
                      <Select
                        value={item.relatedProductId}
                        onChange={(value) =>
                          handleChangeNewSelectRelatedProductId(value, index)
                        }
                        placeholder={t("ADMIN.SELECT_RELATED_PRODUCT")}
                        options={productOptions}
                      ></Select>
                    </Form.Item>
                  </div>
                  <Button
                    style={{
                      color: "red",
                      borderColor: "red",
                    }}
                    variant="outlined"
                    size="middle"
                    onClick={() => handleRemovePromotionDetail(index)}
                  >
                    {t("ADMIN.DELETE_PRODUCT")}
                  </Button>
                </div>
              ))}
            </div>
            <Form.Item
              label={t("ADMIN.NEW_RAING")}
              name="rating"
              rules={[
                { required: true, message: t("ADMIN.PLACEHOODER_RAING") },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label={t("ADMIN.NEW_DISCOUNT")}
              name="discount"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_DISCOUNT"),
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
              label={t("ADMIN.NEW_IMG")}
              name="image"
              rules={[{ required: true, message: t("ADMIN.PLACEHOODER_IMG") }]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
              label={t("ADMIN.NEW_IMG_1")}
              name="image1"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_IMG"),
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetailsProduct}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
              label={t("ADMIN.NEW_IMG_2")}
              name="image2"
              rules={[
                {
                  required: true,
                  message: t("ADMIN.PLACEHOODER_IMG"),
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetailsProduct2}
                maxCount={1}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button>{t("ADMIN.SELECT_IMG_PRODUCT")}</Button>
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
                {t("ADMIN.DETAIL_USER_APPLY")}
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent
        title={t("ADMIN.DELETE_ALL_PRODUCT")}
        open={isModalOpenDeleteAll}
        onCancel={() => setIsModalOpenDeleteAll(false)}
        onOk={handleConfirmDeleteAll}
      >
        <Loading isLoading={isLoadingDeletedMany}>
          <div>{t("ADMIN.MESS_DELETE_ALL_PRODUCT")}</div>
        </Loading>
      </ModalComponent>
      <ModalComponent
        title={t("ADMIN.DELETE_PRODUCT")}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>{t("ADMIN.MESS_DELETE_PRODUCT")}</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
