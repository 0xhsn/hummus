"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};
const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
    return usernameRegex.test(username);
};
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
const validateRegister = (options) => {
    if (!validateEmail(options.email)) {
        return [
            {
                field: "email",
                message: "invalid email format",
            },
        ];
    }
    if (!validateUsername(options.username)) {
        return [
            {
                field: "username",
                message: "invalid username",
            },
        ];
    }
    if (!validatePassword(options.password)) {
        return [
            {
                field: "password",
                message: "invalid password",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map