import { Router } from "express";
import {
  createUser,
  getFarmerProducts,
  getFarmers,
  getOrders,
  verifyFarmerKYC,
} from "../controller/user.controller";
import { upload } from "../Middleware/Multer";
const router = Router();

router.route("/create").post(createUser);
router.route("/verify").post(
  upload.fields([
    {
      name: "citizenship-front",
      maxCount: 1,
    },
    {
      name: "citizenship-back",
      maxCount: 1,
    },
  ]),
  verifyFarmerKYC
);
router.route("/getorders/:userId").get(getOrders);
router.route("/getFarmerSoldProducts/:farmerId").get(getFarmerProducts);
router.route("/getFarmers").get(getFarmers);

export default router;
