"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = () => {
    const values = {
        secretJwt: process.env.SECRET_JWT,
        bcryptSaltRounds: +process.env.BCRYPT_SALT_ROUNDS,
    };
    const schema = Joi.object({
        secretJwt: Joi.string().required(),
        bcryptSaltRounds: Joi.number().default(10),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
        throw new Error(`Validation failed - Is there an environment variable missing?
            ${error.message}`);
    }
    return values;
};
//# sourceMappingURL=app.config.js.map