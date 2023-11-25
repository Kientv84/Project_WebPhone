import { axiosJWT } from "./UserService"

export const createOrder = async (data, access_token) => {
    // console.log('acs', { access_token, data })
    const res = await axiosJWT.post(`${process.env.REACT_APP_URL_BACKEND}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderByUserId = async (id, access_token) => {
    // console.log('acs', { access_token, data })
    const res = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder = async (id, access_token) => {
    // console.log('test', id, access_token)
    const res = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder = async (id, access_token, orderItems) => {
    // console.log('test cancel', id, access_token, orderItems)
    // const data = { orderItems, orderId: id }
    const res = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/order/cancel-order/${id}`, { data: orderItems }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}