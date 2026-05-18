"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
}));
// Route import
const ApiVersion = "/api/v1";
const user_route_1 = __importDefault(require("./router/user.route"));
const products_route_1 = __importDefault(require("./router/products.route"));
// router declaration
app.use(`${ApiVersion}/users`, user_route_1.default);
app.use(`${ApiVersion}/products`, products_route_1.default);
exports.default = app;
