import axios from "axios";

export const apiLoginSuccess = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/auth/login-success`,
    { id }
  );
  console.log("API response data: ", response.data); // In ra dữ liệu trả về
  return response.data; // Trả về dữ liệu từ API
};
