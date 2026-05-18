"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errorhandler extends Error {
    constructor({ statusCode, message = "Something went wrong !" }) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
    }
}
exports.default = Errorhandler;
