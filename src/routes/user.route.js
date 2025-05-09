import { Router } from "express"; //the application “listens” for requests that match the specified route(s) when it detects a match, it calls the specified callback function.
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/register").post(
  //middleware injected
  upload.fields([
    {
      name: "avatr",
      maxCount: 1,
    },

    {
      name: "coverImage",
      maxCount: 2,
    },
  ]),
  registerUser
);

export default router;
