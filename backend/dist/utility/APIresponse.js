"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIresponse {
    constructor({ statusCode, data, message = "sucess" }) {
        (this.statusCode = statusCode),
            (this.data = data),
            (this.message = message);
    }
}
exports.default = APIresponse;
