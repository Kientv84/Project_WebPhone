import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllPromotion = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/promotion/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_URL_BACKEND}/promotion/get-all?limit=${limit}`
    );
  }
  return res.data;
};

export const createPromotion = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/promotion/create`,
    data
  );
  return res.data;
};

export const getDetailsPromotion = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/promotion/get-details/${id}`
  );
  return res.data;
};

export const updatePromotion = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_URL_BACKEND}/promotion/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deletePromotion = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_URL_BACKEND}/promotion/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyPromotion = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_URL_BACKEND}/promotion/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
