import express from "express";
import { registerUser } from "../controllers/Auth.js";
const router = express.Router();

// const checkAuthorization = require("../middleware/auth");

router.route("/register").post(registerUser);
export default router;
