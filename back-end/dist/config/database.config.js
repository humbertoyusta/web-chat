"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const Joi = require("joi");
exports.default = (0, config_1.registerAs)('database', () => {
    const values = {
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD,
        port: +process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
    };
    const schema = Joi.object({
        database: Joi.string().required(),
        username: Joi.string().required().default('postgres'),
        password: Joi.string().required(),
        port: Joi.number(),
        host: Joi.string().required(),
    });
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
        throw new Error(`Validation failed - Is there an environment variable missing?
            ${error.message}`);
    }
    return values;
});
//# sourceMappingURL=database.config.js.map