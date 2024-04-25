import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customAxiosRequestForPost } from "src/utils/AxiosRequest";
import { KEY_FOR_STORING_USER_ID } from "src/utils/LocalStoragekey.js";

const useRegisterQuery = () => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/register", "post", payload);
    },
    onSuccess: ({ token, user }) => {
      navigate("/"); // Navigate to the home page
      setValueToLs(KEY_FOR_STORING_TOKEN, token);
      setValueToLs(KEY_FOR_STORING_USER_ID, user.id);
      //   dispatch(userEmail(user.email));
    },
    onError: (error) => {
      console.log({ error });
      //   toast.error(error?.response?.data?.toString());
    },
  });
};

export default useRegisterQuery;
