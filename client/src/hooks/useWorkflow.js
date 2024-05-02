import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { queryClient } from "src/main";
import { customAxiosRequestForPost } from "src/utils/AxiosRequest";
import { v4 as uuid } from "uuid";
import { customAxiosRequestForGet } from "../utils/AxiosRequest";

let shouldFetch = false;

const useCreateWorkflow = () => {
  const navigate = useNavigate();

  //   const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/create-workflow", "post", payload);
    },
    onSuccess: (data) => {
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["workflowsIds"] });
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
      // navigate("/");
      // shouldFetch = false;
    },
    onError: (error) => {
      // console.log({ error }, error);
      toast.error(error?.response?.data?.toString());
    },
  });
};

const useGetWorkflows = () => {
  return useQuery({ queryKey: ["workflowsIds"], queryFn: () => customAxiosRequestForGet("/workflows") });
};

const id = uuid();
const useGetWorkflowStatus = ({ enabled }) => {
  return useQuery({
    queryKey: ["workflowStatus", id],
    queryFn: () => customAxiosRequestForGet("/workflow-status"),
    enabled: false,
    refetchInterval: 500,
    refetchIntervalInBackground: true,
  });
};

const useGetWorkFlowDetails = (id) => {
  return useQuery({
    queryKey: ["workflow-details", id],
    enabled: id ? true : false,
    queryFn: () => customAxiosRequestForGet("/workflow-details", { workFlowId: id }),
  });
};

// update workflow
const useUpdateWorkflow = (id) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload) => {
      return customAxiosRequestForPost("/update-workflow", "post", payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workflowsIds"] });
      navigate("/");
    },
    onError: (error) => {
      // console.log({ error }, error);
      toast.error(error?.response?.data?.toString());
    },
  });
};

export {
  useCreateWorkflow,
  useGetWorkFlowDetails,
  useGetWorkflowStatus,
  useGetWorkflows,
  useTriggerWorkFlow,
  useUpdateWorkflow,
};
