import { Router } from "express";
import { upload } from "../Middleware/Multer";
import {
  buyProduct,
  createProduct,
  createProductFromVoice,
  getNearestProducts,
  getProduct,
  getProducts,
  searchProduct,
} from "../controller/product.controller";
const router = Router();

router.route("/add-voice").post(upload.single("audio"), createProductFromVoice);
router.route("/add").post(upload.single("picture"), createProduct);
router.route("/get").get(getProducts);
router.route("/order").post(buyProduct);
router.route("/getproduct/:productId").get(getProduct);
router.route("/search").get(searchProduct);
router.route("/getnearestproducts/:userId").get(getNearestProducts);

export default router;