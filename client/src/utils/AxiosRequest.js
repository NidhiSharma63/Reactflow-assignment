import axios from "axios";
import { getValueFromLS } from "src/utils/LocalStorage";
import { KEY_FOR_STORING_USER_DETAILS } from "src/utils/LocalStoragekey";
import { BASE_URL } from "src/utils/constant";
// defining axios instance
const axiosInstance = axios.create({
  // ...AxiosInstanceConfig,
  baseURL: BASE_URL,
});

// AxiosResponseInterceptor(axiosInstance);

async function axiosRequest({ ...options }) {
  const AUTH_TOKEN = getValueFromLS(KEY_FOR_STORING_USER_DETAILS)?.token;
  //   axiosInstance.defaults.headers.common.Authorization = AUTH_TOKEN;

  if (AUTH_TOKEN) {
    axiosInstance.defaults.headers.Authorization = AUTH_TOKEN;
  }
  try {
    const response = await axiosInstance(options);
    return Promise.resolve(response.data);
  } catch (error) {
    console.log(error, "This is error");
    throw error;
  }
}

const customAxiosRequestForGet = async (url, params) => {
  const userId = getValueFromLS(KEY_FOR_STORING_USER_DETAILS)?._id;
  let paramsToPass = {};
  if (!userId) {
    throw new Error("User id is not present");
  }

  if (userId) {
    paramsToPass = { ...params, userId };
  }

  // console.log(paramsToPass, ":::params to pass");
  try {
    const response = await axiosRequest({
      url,
      method: "get",
      params: paramsToPass,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error; // Re-throw the error to propagate it to the caller
  }
};

const customAxiosRequestForPost = async (url, method = "post", payload, fileUpload) => {
  const userId = getValueFromLS(KEY_FOR_STORING_USER_DETAILS)?._id;

  // console.log({ url });
  let updatedPayload = { ...payload };
  if (userId) {
    updatedPayload = { ...payload, userId };
  }

  try {
    const response = await axiosRequest({
      url,
      method,
      data: updatedPayload,
      headers: {
        "Content-Type": fileUpload ? "multipart/form-data" : "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error; // Re-throw the error to propagate it to the caller
  }
};

// export default customAxiosRequest;
export { customAxiosRequestForGet, customAxiosRequestForPost };
