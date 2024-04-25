import WorkFlow from "../schema/WorkFlowSchema.js";
const getWorkflowIds = async (req, res, next) => {
  try {
    const findWorkFlowIds = await WorkFlow.find();
    const workFlowIds = findWorkFlowIds.map((workflow) => workflow.workFlowId);
    res.send(workFlowIds);
  } catch (error) {
    next(error);
  }
};

export default getWorkflowIds;
