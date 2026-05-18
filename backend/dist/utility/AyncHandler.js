"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandeler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error));
    };
};
exports.default = asyncHandeler;
