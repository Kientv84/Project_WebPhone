import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/product/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/product/get-all?limit=${limit}`
    );
  }
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/product/create`,
    data
  );
  return res.data;
};

// lấy dữ liệu sản phẩm
export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/product/get-details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_URL_BACKEND}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_URL_BACKEND}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_URL_BACKEND}/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/product/get-all-type`
  );
  return res.data;
};

export const getAllBranchProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/product/get-all-branch`
  );
  return res.data;
};

export const getProductType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const getProductBranch = async (branch, page, limit) => {
  if (branch) {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/product/get-all?filter=branch&filter=${branch}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const getAllsearchProducts = async (query) => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/product/catalogsearch/result?q=${query}`
  );
  return res.data;
};

export const getProductSearch = async (query, page, limit) => {
  if (query) {
    const res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/product/get-all-search?filter=name&filter=${query}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};
