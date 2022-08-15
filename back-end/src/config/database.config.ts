import { registerAs } from "@nestjs/config";
import { prototype } from "events";
import * as Joi from 'joi';

export default registerAs('database', () => {
    // database environment variables
    const values = {
        database: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD,
        port: +process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
    };

    // joi validation schema
    const schema = Joi.object({
        database: Joi.string().required(),
        username: Joi.string().required().default('postgres'),
        password: Joi.string().required(),
        port: Joi.number(),
        host: Joi.string().required(),
    });

    // getting possible error from validation
    const { error } = schema.validate(values, { abortEarly: false });

    // if there is any error, throw it
    if (error) {
        throw new Error(
            `Validation failed - Is there an environment variable missing?
            ${error.message}`,
        );
    }

    // otherwise, return the database configuration variables
    return values;
});