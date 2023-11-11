import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-all`)
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/product/create`, data)
    return res.data
}
// lấy dữ liệu sản phẩm
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/product/get-details/${id}`)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/product/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_URL_BACKEND}/product/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}