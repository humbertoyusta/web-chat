import * as Joi from "joi";

export default () => {
    const values = {
        secretJwt: process.env.SECRET_JWT,
        bcryptSaltRounds: +process.env.BCRYPT_SALT_ROUNDS,
    }

    const schema = Joi.object({
        secretJwt: Joi.string().required(),
        bcryptSaltRounds: Joi.number().default(10),
    });

    const { error } = schema.validate(values, { abortEarly: false });

    if (error) {
        throw new Error(
            `Validation failed - Is there an environment variable missing?
            ${error.message}`,
        );
    }

    return values;
};