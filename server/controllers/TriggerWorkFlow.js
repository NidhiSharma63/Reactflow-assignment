import WorkFlow from "../schema/WorkFlowSchema.js";
import { convertToJson, filterData, parseCsv, sendPostRequest, wait } from "../utils/WorkFlowFunction.js";
const triggerWorkFlow = async (req, res, next) => {
  try {
    const { file } = req;
    const { workflowId } = req.body;

    if (!file) {
      throw new Error("No CSV file uploaded");
    }

    const workflow = await WorkFlow.findOne({ workFlowId: workflowId });
    if (!workflow) {
      throw new Error("Workflow not found");
    }

    // Assuming workFlowSequence is an array of strings indicating the steps
    const sequence = workflow.workFlowSequence;
    let data;

    // Process the sequence
    for (const step of sequence) {
      switch (step) {
        case "Start":
          // Begin processing
          console.log("Workflow started");
          data = await parseCsv(file.buffer);
          break;

        case "Filter Data":
          // Convert the CSV string and filter data
          data = await filterData(file.buffer);
          break;

        case "Wait":
          await wait(60000); // Wait for 5 seconds or as needed
          break;

        case "Convert Format":
          data = convertToJson(data);
          break;

        case "Send Post Request":
          // Send data to a predefined URL
          await sendPostRequest(data);
          break;

        case "End":
          // End processing
          break;

        default:
          // Handle unknown steps
          console.log(`Unknown step: ${step}`);
      }
    }

    res.json({ message: "Workflow executed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export default triggerWorkFlow;
