import WorkFlow from "../schema/WorkFlowSchema.js";

const createWorkFlow = async (req, res, next) => {
  try {
    const { userID, workFlowSequence, workFlowId } = req.body;
    if (!userID || !workFlowSequence) throw new Error("Missing Data");
    const workFlow = new WorkFlow({
      userId: userID,
      workFlowSequence,
      workFlowId,
    });
    await workFlow.save();
    res.status(200).send(workFlow);
  } catch (error) {
    next(error);
  }
};

export default createWorkFlow;
