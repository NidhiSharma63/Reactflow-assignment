import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { customAxiosRequestForPost } from "src/utils/AxiosRequest";

const useCreateWorkflow = () => {
  const navigate = useNavigate();

  //   const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/create-workflow", "post", payload);
    },
    onSuccess: (data) => {
      navigate("/");
    },
    onError: (error) => {
      // console.log({ error }, error);
      toast.error(error?.response?.data?.toString());
    },
  });
};

const useTriggerWorkFlow = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/trigger-workflow", "post", payload, true);
    },
    onSuccess: (data) => {
      navigate("/");
    },
    onError: (error) => {
      // console.log({ error }, error);
      toast.error(error?.response?.data?.toString());
    },
  });
};

export { useCreateWorkflow, useTriggerWorkFlow };
