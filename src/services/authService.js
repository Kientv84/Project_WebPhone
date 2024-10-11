import axios from "axios";

export const apiLoginSuccess = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/auth/login-success`,
    { id }
  );
  return response.data; // Trả về dữ liệu từ API
};
