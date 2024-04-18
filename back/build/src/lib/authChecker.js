"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customAuthChecker = void 0;
const customAuthChecker = ({ context }, roles) => {
    if (context.user) {
        if (!roles || roles.length === 0) {
            return true;
        }
        else if (roles.length > 0 && roles.includes(context.user.role)) {
            return true;
        }
    }
    return false;
};
exports.customAuthChecker = customAuthChecker;
