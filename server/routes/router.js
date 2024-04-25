import express from "express";
import { registerUser } from "../controllers/Auth.js";
import createWorkFlow from "../controllers/CreateWorkflow.js";
import triggerWorkFlow from "../controllers/TriggerWorkFlow.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/create-workflow").post(createWorkFlow);
router.route("/trigger-workflow").post(triggerWorkFlow);
export default router;
