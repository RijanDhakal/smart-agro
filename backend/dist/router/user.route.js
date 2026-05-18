"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const Multer_1 = require("../Middleware/Multer");
const router = (0, express_1.Router)();
router.route("/create").post(user_controller_1.createUser);
router.route("/verify").post(Multer_1.upload.fields([
    {
        name: "citizenship-front",
        maxCount: 1,
    },
    {
        name: "citizenship-back",
        maxCount: 1,
    },
]), user_controller_1.verifyFarmerKYC);
router.route("/getorders/:userId").get(user_controller_1.getOrders);
router.route("/getFarmerSoldProducts/:farmerId").get(user_controller_1.getFarmerProducts);
router.route("/getFarmers").get(user_controller_1.getFarmers);
exports.default = router;
