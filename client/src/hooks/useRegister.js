import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { customAxiosRequestForPost } from "src/utils/AxiosRequest";
import { setValueToLs } from "src/utils/LocalStorage";
import { KEY_FOR_STORING_USER_DETAILS } from "src/utils/LocalStoragekey";

const useRegisterQuery = () => {
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/register", "post", payload);
    },
    onSuccess: (data) => {
      navigate("/"); // Navigate to the home page
      setValueToLs(KEY_FOR_STORING_USER_DETAILS, JSON.stringify(data?.user));
      //   dispatch(userEmail(user.email));
    },
    onError: (error) => {
      console.log({ error });
      //   toast.error(error?.response?.data?.toString());
    },
  });
};

export default useRegisterQuery;
