"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    var _a, _b, _c, _d;
    if (!((_a = options.email) === null || _a === void 0 ? void 0 : _a.includes("@"))) {
        return [
            {
                field: "email",
                message: "Email must be valid.",
            },
        ];
    }
    if (((_b = options.username) === null || _b === void 0 ? void 0 : _b.length) <= 2) {
        return [
            {
                field: "username",
                message: "Username must be atleast 3 characters long.",
            },
        ];
    }
    if ((_c = options.username) === null || _c === void 0 ? void 0 : _c.includes("@")) {
        return [
            {
                field: "username",
                message: "Username must not include '@'.",
            },
        ];
    }
    if (((_d = options.password) === null || _d === void 0 ? void 0 : _d.length) <= 5) {
        return [
            {
                field: "password",
                message: "Password must be atleast 6 characters long.",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map