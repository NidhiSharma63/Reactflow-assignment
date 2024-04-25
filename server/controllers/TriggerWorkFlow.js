import WorkFlow from "../schema/WorkFlowSchema.js";

const triggerWorkFlow = async (req, res) => {
  const { workflowId, file } = req.body;
  const findWorkFlowUsingId = await WorkFlow.findById(workflowId);

  if (!findWorkFlowUsingId) {
    throw new Error("Workflow not found");
  }
};

export default triggerWorkFlow;
