import  express  from "express";
import { loginController, registerController,testController } from "../controllers/authController.js";
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/test", requireSignIn, isAdmin,testController);

export default router;