import express from "express";
import { registerUser } from "../controllers/Auth.js";
import createWorkFlow from "../controllers/CreateWorkflow.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/create-workflow").post(createWorkFlow);
export default router;
