import axios from "axios";

export const loginUser = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`, data)
    return res.data 
}

export const signupUser = async(data) => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-up`, data)
    return res.data 
}