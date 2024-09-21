import { apiLoginSuccess } from "../../services/authService";
import actionType from "./actionType";

// export const loginSuccess = (id) => async (dispatch) => {
//   try {
//     let response = await apiLoginSuccess(id);
//     // console.log("Login Success Response:", response);
//     if (response && response.data && response.data.err === 0) {
//       console.log(
//         "Login successful, dispatching LOGIN_SUCCESS with token:",
//         response.data.token
//       );
//       dispatch({
//         type: actionType.LOGIN_SUCCESS,
//         data: response.data.token,
//       });
//     } else {
//       console.log("Login failed, err code:", response?.data?.error);
//       dispatch({
//         type: actionType.LOGIN_SUCCESS,
//         data: null,
//       });
//     }
//   } catch (error) {
//     console.error("Error during loginSuccess:", error);
//     dispatch({
//       type: actionType.LOGIN_SUCCESS,
//       data: null,
//     });
//   }
// };

// export const loginSuccess = (id) => async (dispatch) => {
//   try {
//     let response = await apiLoginSuccess(id);

//     // Debug: log toàn bộ response để kiểm tra cấu trúc
//     console.log("Response from apiLoginSuccess:", response);

//     if (response && response.data) {
//       console.log("Login response data:", response.data);

//       if (response.data.err === 0) {
//         dispatch({
//           type: actionType.LOGIN_SUCCESS,
//           data: response.data.token,
//         });
//       } else {
//         console.log("Login failed, err code:", response.data.err);
//         dispatch({
//           type: actionType.LOGIN_SUCCESS,
//           data: null,
//         });
//       }
//     } else {
//       console.log("Invalid response format, response.data is undefined");
//       dispatch({
//         type: actionType.LOGIN_SUCCESS,
//         data: null,
//       });
//     }
//   } catch (error) {
//     console.error("Error during loginSuccess:", error);
//     dispatch({
//       type: actionType.LOGIN_SUCCESS,
//       data: null,
//     });
//   }
// };

export const loginSuccess = (id) => async (dispatch) => {
  try {
    let response = await apiLoginSuccess(id);

    if (response?.status === "OK") {
      // Kiểm tra đúng response từ API
      dispatch({
        type: actionType.LOGIN_SUCCESS,
        data: response.token, // Gửi token vào reducer
      });
    } else {
      dispatch({
        type: actionType.LOGIN_SUCCESS,
        data: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.LOGIN_SUCCESS,
      data: null,
    });
  }
};

export const logout = () => ({
  type: actionType.LOGOUT,
});
